import { CohereClient } from "cohere-ai";
import { env } from "../config/env.js";

const cohere = new CohereClient({
  token: env.cohere_api_key,
});

const PLANT_API_KEY = env.plant_api_key;
const PLANT_API_URL = "https://plant.id/api/v3";

export async function chatwithrag(req, res) {
  console.log("Cuerpo de la solicitud:", req.body);

  const { query } = req.body;

  if (!query) {
    console.error("Error: La consulta está undefined o vacía");
    return res.status(400).json({ error: "La consulta es requerida" });
  }

  console.log(`Consulta recibida: "${query}"`);

  try {
    // Paso 1: Usar Cohere para extraer el nombre de la planta
    console.log("Extrayendo nombre de la planta con Cohere...");
    const extractionResponse = await cohere.chat({
      model: "command-r-plus",
      preamble:
        "El usuario te hará una consulta. Tu tarea es identificar el nombre de una planta en la consulta, si existe. Sigue estas instrucciones estrictamente:0- Responde con una sola palabra. Todas tus respuestas deben ser concisas y claras.1- Extrae ÚNICAMENTE el nombre de la planta de la consulta.2- Si no hay un nombre de planta, responde con 'null'.3- Si hay más de un nombre de planta, responde con el nombre más relevante.4-NUNCA uses un punto final. Responde solo con el nombre de la planta, sin puntuación adicional.",
      message: query,
      temperature: 0.1,
    });

    const plantName = extractionResponse.text.trim();
    console.log(`Nombre de planta extraído: "${plantName}"`);

    if (plantName === "null") {
      return res.status(400).json({
        error: "No se pudo identificar un nombre de planta en la consulta",
      });
    }

    // Paso 2: Buscar la planta en la API de Plant.id
    console.log(`Buscando información sobre ${plantName} en Plant.id API...`);
    const searchResponse = await fetch(
      `${PLANT_API_URL}/kb/plants/name_search?q=${encodeURIComponent(
        plantName
      )}&limit=1&language=es`,
      {
        method: "GET",
        headers: {
          "Api-Key": PLANT_API_KEY,
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error(
        `Error en la búsqueda de plantas: ${searchResponse.status}`
      );
    }

    const searchData = await searchResponse.json();
    console.log("Resultados de la búsqueda:", searchData);

    if (!searchData.entities || searchData.entities.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró información sobre la planta." });
    }

    const plantAccessToken = searchData.entities[0].access_token;
    if (!plantAccessToken) {
      throw new Error(
        "No se encontró token de acceso de la planta en los resultados de la búsqueda"
      );
    }

    // Paso 3: Obtener detalles completos de la planta
    const detailsResponse = await fetch(
      `${PLANT_API_URL}/kb/plants/${plantAccessToken}?details=common_names,url,description,taxonomy,image,synonyms,edible_parts,poisonous_parts,watering,propagation_methods&language=es`,
      {
        method: "GET",
        headers: {
          "Api-Key": PLANT_API_KEY,
        },
      }
    );

    if (!detailsResponse.ok) {
      throw new Error(
        `Error al obtener detalles de la planta: ${detailsResponse.status}`
      );
    }

    const plantDetails = await detailsResponse.json();
    console.log("Detalles de la planta:", plantDetails);

    // Paso 4: Usar Cohere para generar una respuesta informativa
    console.log("Generando respuesta informativa con Cohere...");
    const cohereContext = JSON.stringify(plantDetails);
    const cohereResponse = await cohere.chat({
      model: "command-r-plus",
      preamble: `Eres un asistente botánico virtual, y tu tarea es proporcionar una descripción clara, atractiva e informativa sobre la planta ${plantName}. Sigue estas pautas para crear una respuesta completa:

0- Prioriza calidad antes que cantidad de texto, no superar las 100 palabras.
1. Comienza con el nombre científico de la planta, su familia botánica y su origen geográfico.
2. Ofrece una breve descripción física de la planta, incluyendo sus características visuales distintivas.
3. Describe los usos comunes de la planta, tanto en aplicaciones cotidianas como en tradiciones culturales o históricas.
4. Menciona cualquier dato interesante o curioso relacionado con su cultivo, beneficios para la salud, o anécdotas relevantes.
5. Indica si la planta tiene partes comestibles, y sugiere recetas creativas y deliciosas para desayunos, almuerzos o cenas Presentaras esta parte con un titulo y distintos items donde explayaras cada ingrediente de las recetas.
6. Advierte sobre cualquier parte venenosa o tóxica, proporcionando instrucciones claras de seguridad.

Recuerda mantener un equilibrio entre la información concisa y atractiva. Tu objetivo es educar e inspirar a los usuarios con la versatilidad y las curiosidades de esta planta, siempre priorizando su seguridad."

La respuesta debe estar escrita en lenguaje natural, ser informativa pero no extensa, y mantener un tono descriptivo y atractivo. Prioriza la seguridad al mencionar partes tóxicas y demuestra creatividad al proponer recetas culinarias.`,
      message: `Usa la siguiente información sobre ${plantName} para generar una respuesta informativa y atractiva.`,
      temperature: 0.6,
      context: cohereContext,
    });

    console.log("Respuesta generada por Cohere");

    res.status(200).json({
      plantName: plantName,
      informativeResponse: cohereResponse.text,
    });
  } catch (error) {
    console.error("Error en el proceso:", error);
    res.status(500).json({
      error: `Error en el procesamiento de la solicitud: ${error.message}`,
    });
  }
}

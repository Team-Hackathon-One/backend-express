import { CohereClient } from "cohere-ai";
import { env } from "../config/env.js";
import Story from "../model/story.model.js";

const cohere = new CohereClient({
  token: env.cohere_api_key,
});

const PLANT_API_KEY = env.plant_api_key;
const PLANT_API_URL = "https://plant.id/api/v3";

export async function chatwithrag(req, res) {
  console.log("Cuerpo de la solicitud:", req.body);

  const { query } = req.body;
  // const userId = req.user.id;

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

    // Paso 4: Usar Cohere para generar una respuesta informativa y forzar un formato específico
    console.log("Generando respuesta informativa con Cohere...");
    const cohereContext = JSON.stringify(plantDetails);
    const cohereResponse = await cohere.chat({
      model: "command-r-plus",
      preamble: `Eres un asistente botánico virtual, y tu tarea es proporcionar una descripción clara, atractiva e informativa sobre la planta ${plantName}. Sigue estrictamente estas pautas para crear una respuesta completa y consistente:

- Prioriza la calidad y la concisión en tu respuesta.
- No superes las 100 palabras en total.
- Comienza con el nombre científico de la planta, seguido de su familia botánica y origen geográfico.
- Incluye una breve descripción física de la planta, destacando sus características visuales distintivas.
- Describe los usos comunes de la planta, tanto en aplicaciones cotidianas como en tradiciones culturales.
- Menciona cualquier dato interesante o curioso relacionado con su cultivo, beneficios para la salud, o anécdotas relevantes.
- Si la planta tiene partes comestibles, sugiere recetas creativas para desayunos, almuerzos o cenas. Utiliza el siguiente formato para las recetas:
  \`\`\`
  **Recetas deliciosas y creativas con [Nombre de la planta]:**

  **Desayuno:**
  - [Receta 1]
  - [Receta 2]

  **Almuerzo/Cena:**
  - [Receta 3]
  - [Receta 4]
  \`\`\`

- Advierte sobre cualquier parte venenosa o tóxica y proporciona instrucciones claras de seguridad.

Recuerda mantener un tono descriptivo y atractivo, y siempre prioriza la seguridad del usuario.`,
      message: `Usa la siguiente información sobre ${plantName} para generar una respuesta informativa y atractiva.`,
      temperature: 0.6,
      context: cohereContext,
    });

    console.log("Respuesta generada por Cohere");

    // Extraer recetas de la respuesta de Cohere
    // const recipesRegex =
    //   /\*\*Recetas deliciosas y creativas con .*?:(.*?)\*\*Precaución:/s;
    // const recipesMatch = cohereResponse.text.match(recipesRegex);
    // const recipes = recipesMatch ? recipesMatch[1] : null;

    // const newStory = new Story({
    //   // user_id: userId,
    //   search_query: query,
    //   plant_name: plantName,
    //   plant_description: plantDescription,
    //   plant_image: plantImage,
    //   plant_uses: plantUses,
    //   recipes: recipes,
    //   poisonous_parts: poisonousParts,
    //   safety_instructions: safetyInstructions,
    // });
    // await newStory.save();
    res.status(200).json({
      plantName: plantName,
      informativeResponse: cohereResponse.text,
      // recipes: recipes,
    });
  } catch (error) {
    console.error("Error en el proceso:", error);
    res.status(500).json({
      error: `Error en el procesamiento de la solicitud: ${error.message}`,
    });
  }
}

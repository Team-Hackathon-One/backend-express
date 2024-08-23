import { env } from "../config/env.js";
import { Story } from "../model/relations/relations.js";
// Configuración de la API
const API_KEY = env.plant_api_key;
const API_URL = "https://plant.id/api/v3";

export function searchPlant(req, res) {
  const { query, limit } = req.query;

  try {
    fetch(
      `${API_URL}/kb/plants/name_search?q=${query}&limit=${
        limit || 10
      }&language=es`,
      {
        method: "GET",
        headers: {
          "Api-Key": API_KEY,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(async (jsonData) => {
        // Guardar los resultados en la base de datos
        const stories = jsonData.map((plant) => ({
          plant_name: plant.common_name,
          plant_desc: plant.description,
          plant_image: plant.image_url,
        }));

        await Story.bulkCreate(stories);

        res.json(jsonData);
      })
      .catch((error) => {
        console.error("Error al buscar la planta: ", error);
        res.status(500).json({ error: "Error al buscar la planta" });
      });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
}

export function identifyPlant(req, res) {
  const { images } = req.body;

  const data = {
    images,
    latitude: 26.1852983,
    longitude: 58.1744976,
    similar_images: true,
  };

  try {
    fetch(`${API_URL}/identification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": API_KEY,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => res.json(jsonData))
      .catch((error) => {
        console.error("Error al identificar la planta: ", error);
        res.status(500).json({ error: "Error al identificar la planta" });
      });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
}

export function getPlantDetail(req, res) {
  const { access_token } = req.params;
  const details =
    "common_names,url,description,taxonomy,image,synonyms,edible_parts,watering,propagation_methods";

  try {
    fetch(
      `${API_URL}/kb/plants/${access_token}?details=${details}&language=es`,
      {
        method: "GET",
        headers: {
          "Api-Key": API_KEY,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => res.json(jsonData))
      .catch((error) => {
        console.error("Error al obtener los detalles de la planta: ", error);
        res
          .status(500)
          .json({ error: "Error al obtener los detalles de la planta" });
      });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
}

export function getChatbotConversation(req, res) {
  const { access_token, question, prompt } = req.body;

  const data = {
    question,
    prompt,
    app_name: "asd",
  };

  try {
    fetch(`${API_URL}/identification/${access_token}/conversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": API_KEY,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => res.json(jsonData))
      .catch((error) => {
        console.error("Error al obtener la conversación del chatbot: ", error);
        res
          .status(500)
          .json({ error: "Error al obtener la conversación del chatbot" });
      });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
}

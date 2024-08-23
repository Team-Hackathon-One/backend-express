import { env } from "../config/env.js";

const API_KEY = env.plant_api_key;
const API_URL = "https://plant.id/api/v3";

export async function identifyPlant(req, res) {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("No se proporcionaron imágenes válidas.");
    }

    const data = {
      images,
      latitude: 26.1852983,
      longitude: 58.1744976,
      similar_images: true,
    };

    const response = await fetch(`${API_URL}/identification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Error de API: ${response.status} ${response.statusText}`
      );
    }

    const jsonData = await response.json();

    if (!jsonData || !jsonData.description) {
      throw new Error("Respuesta de API inesperada.");
    }

    res.json(jsonData.description.value);
  } catch (error) {
    console.error("Error al identificar la planta:", error.message);
    res
      .status(500)
      .json({ error: "Ocurrió un error al identificar la planta." });
  }
}

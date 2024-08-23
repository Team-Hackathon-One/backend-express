import { env } from "../config/env";

// Configuración de la API
const API_KEY = env.plant_api_key;
const API_URL = "https://plant.id/api/v3";

async function makeApiRequest(endpoint, data = {}) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error al realizar la solicitud API: ", error);
    throw error;
  }
}

export async function identifyPlant(req, res) {
  const { images } = req.body;

  const lat = "-26.1852983";
  const lon = "-58.1744976";

  const data = {
    lat,
    lon,
    images,
  };

  try {
    const response = await makeApiRequest("identify", data);
    res.json(response);
  } catch (error) {
    console.error("Error al identificar la planta: ", error);
    res.status(500).json({ error: "Error al identificar la planta" });
  }
}

export async function getChatbotConversation(req, res) {
  const { access_token, question, prompt, temperature, app_name } = req.body;

  const data = {
    question,
    prompt,
    temperature,
    app_name,
  };

  try {
    const response = await makeApiRequest(
      `identification/${access_token}/conversation`,
      data
    );
    res.json(response);
  } catch (error) {
    console.error("Error al obtener la conversación del chatbot: ", error);
    res
      .status(500)
      .json({ error: "Error al obtener la conversación del chatbot" });
  }
}

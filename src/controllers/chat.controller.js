import { CohereClient } from "cohere-ai";
import { preamble } from "../utils/preamble";
import { env } from "../config/env";

const cohere = new CohereClient({ token: env.cohere_api_key });

export async function chat(req, res) {
  const { prompt } = req.body;

  try {
    const response = await cohere.chatStream({
      model: "command-r-plus",
      chatHistory: [
        {
          role: "system",
          content: preamble,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let messages = [];
    for (const message of response.messages) {
      console.log(`${message.role}: ${message.content}`);
      messages.push(`${message.role}: ${message.content}`);
    }

    res.json({ messages });
  } catch (error) {
    console.error("Error al chatear con Cohere: ", error);
    res.status(500).json({ error: "Error al chatear con Cohere" });
  }
}

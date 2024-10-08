import "dotenv/config";

export const env = {
  server_url: process.env.SERVER_URL || "http://localhost",
  server_port: Number(process.env.SERVER_PORT) || 3000,
  db_host: process.env.DB_HOST || "localhost",
  db_port: process.env.DB_PORT || 3306,
  db_name: process.env.DB_NAME || "plants",
  db_user: process.env.DB_USER || "root",
  db_password: process.env.DB_PASSWORD || "",
  jwt_secret: process.env.JWT_SECRET || "secret",
  plant_api_key: String(process.env.PLANT_API_KEY),
  cohere_api_key: process.env.COHERE_API_KEY,
};

export const env = {
  server_url: process.env.SERVER_URL || "http://localhost",
  server_port: process.env.SERVER_PORT || 3000,
  client_url: process.env.CLIENT_URL || "http://localhost",
  client_port: process.env.CLIENT_PORT || any,
  db_host: process.env.DB_HOST || "localhost",
  db_port: process.env.DB_PORT || 3306,
  db_name: process.env.DB_NAME || "plants",
  db_user: process.env.DB_USER || root,
  db_password: process.env.DB_PASSWORD || "",
  jwt_secret: process.env.JWT_SECRET || "secret",
  plant_api_key: process.env.PLANT_ID_API_KEY,
  cohere_api_key: process.env.COHERE_API_KEY,
};

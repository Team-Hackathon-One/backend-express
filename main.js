import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { initDb } from "./src/config/db.js";
import { initRelations } from "./src/model/relations/relations.js";
import authRouter from "./src/router/auth.routes.js";
import plantRouter from "./src/router/plants.routes.js";
import userRouter from "./src/router/user.routes.js";
import { env } from "./src/config/env.js";
import chatRouter from "./src/router/chat.routes.js";
// import { createFakeUsers } from "./src/utils/create-users.js";

const app = express();

const URL = env.server_url;
const PORT = env.server_port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use("/api", authRouter);
app.use("/api", chatRouter);
app.use("/api", userRouter);
app.use("/api", plantRouter);

app.listen(PORT, async () => {
  console.log("🔄 Iniciando servidor...");
  await initDb();
  await initRelations();
  // await createFakeUsers();
  console.log(`✅ Servidor ejecutándose en: ${URL}:${PORT}`);
});

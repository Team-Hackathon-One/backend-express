import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

//#RUTAS
// import authRouter from "./src/routes/auth.routes.js";
import userRoutes from "./src/router/user.routes.js";
//#CONFIG
import { initDb } from "./src/config/db.js";
// import { initRelations } from "./src/models/relations/relations.js";

const app = express();

const URL = "http://localhost";
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use("/", userRoutes);

app.listen(PORT, async () => {
  console.log("🔄 Iniciando servidor...");
  await initDb();
  //   await initRelations();
  console.log(`✅ Servidor ejecutándose en: ${URL}:${PORT}`);
});

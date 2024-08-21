import { Sequelize } from "sequelize";

const sequelize = new Sequelize("test", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export async function initDb() {
  try {
    console.log("🔄 Iniciando conexión a la base de datos...");
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida con éxito.");

    console.log("🔄 Sincronizando la base de datos...");
    await sequelize.sync({ alter: true }); // { alter: true } o { force: true }
    console.log("✅ Sincronización de la base de datos completada.");
  } catch (error) {
    console.error(`❌ Error al inicializar la base de datos: ${error}`);
    throw new Error(`❌ Error al inicializar la base de datos: ${error}`);
  }
}

export default sequelize;

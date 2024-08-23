import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import Story from "../story.model.js";
import Usuario from "../user.model.js";

export async function initRelations() {
  Usuario.hasMany(Story, {
    foreignKey: "usuario_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Story.belongsTo(Usuario, {
    foreignKey: "usuario_id",
  });

  // await Usuario.sync({ alter: true });
  // await Story.sync({ alter: true });
  console.log("🔄 Relaciones de modelos creadas correctamente");
}

export { Usuario, Story };

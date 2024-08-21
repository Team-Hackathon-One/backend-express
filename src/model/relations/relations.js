import Usuario from "../usuario.model.js";

//EJEMPLO DE RELACIONES EN SEQUELIZE
export async function initRelations() {
  Usuario.hasMany(Institucion, {
    foreignKey: "usuario_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Institucion.belongsTo(Usuario, {
    foreignKey: "usuario_id",
  });

  await Usuario.sync();
  await Institucion.sync();
  console.log("🔄 Relaciones de modelos creadas correctamente");
}
export { Usuario, Institucion };

import Usuario from "../models/usuario.model.js";

export const createUsuario = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  if (!email || !password) {
    console.log("Datos de entrada inválidos para la creación del usuario.");
    return res.status(400).json({
      status: "error",
      message: "Datos de entrada inválidos para la creación del usuario.",
    });
  }
  try {
    const result = await Usuario.create({ nombre, apellido, email, password });
    console.log(`Usuario con id: ${result.id} creado.`);
    console.log(result.dataValues);
    return res.status(201).json({
      status: "success",
      message: "Usuario creado exitosamente",
      data: result.dataValues,
    });
  } catch (error) {
    console.error("Error al crear usuario: ", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error al crear usuario",
      e: error.message,
    });
  }
};

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    console.log("Usuarios obtenidos: ", usuarios.length);
    return res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos exitosamente",
      data: usuarios,
    });
  } catch (error) {
    console.error("Error al obtener usuarios: ", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener usuarios",
      e: error.message,
    });
  }
};

export const getUsuario = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    console.log("ID de usuario no proporcionado.");
    return res.status(400).json({
      status: "error",
      message: "ID de usuario no proporcionado.",
    });
  }

  try {
    const usuario = await Usuario.findByPk(id);

    usuario
      ? (console.log(`Usuario obtenido exitosamente. ID: ${usuario.id}`),
        res.status(200).json({
          status: "success",
          message: "Usuario obtenido exitosamente",
          data: usuario,
        }))
      : (console.log(`No se encontró usuario con ID ${id}`),
        res.status(404).json({
          status: "error",
          message: "No se encontró usuario",
        }));

    return;
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}: ${error.message}`);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener usuario",
      e: error.message,
    });
  }
};

export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, password } = req.body;
  if (!email || !password) {
    console.log(
      "Datos de entrada inválidos para la actualización del usuario."
    );
    return res.status(400).json({
      status: "error",
      message: "Datos de entrada inválidos para la actualización del usuario.",
    });
  }

  try {
    const usuario = await Usuario.findOne({ where: { id } });
    if (!usuario) {
      console.log(`No se encontró el usuario con ID ${id}.`);
      return res.status(404).json({
        status: "error",

        message: "No se encontró el usuario",
      });
    }

    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.email = email;
    usuario.password = password;
    await usuario.save();

    console.log(`Usuario actualizado exitosamente. ID: ${id}`);
    return res.status(200).json({
      status: "succes",
      message: "Usuario actualizado",
      data: { affected_id: usuario.id },
    });
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${id}: ${error.message}`);
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar usuario",
      e: error.message,
    });
  }
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    console.log("ID de usuario no proporcionado.");
    return res.status(400).json({
      status: "error",
      message: "ID de usuario no proporcionado.",
    });
  }

  try {
    const deletedRows = await Usuario.destroy({
      where: { id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        status: "error",

        message: "No se encontró el usuario",
      });
    }

    console.log(`Usuario eliminado exitosamente. ID: ${id}`);
    return res.status(200).json({
      status: "success",
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${id}: `, error.message);
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar usuario",
      e: error.message,
    });
  }
};

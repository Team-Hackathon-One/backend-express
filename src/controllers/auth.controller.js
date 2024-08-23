import { Usuario } from "../model/relations/relations.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const SECRET_KEY = env.jwt_secret;
const EXPIRES_IN = "24h";

export async function signUp(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Datos de entrada inválidos para la creación del usuario.");
    res.setHeader("Authorization", "Bearer ");
    return res.status(400).json({
      status: "error",
      message: "Datos de entrada inválidos para la creación del usuario.",
    });
  }

  const found = await Usuario.findOne({ where: { email } });
  if (found) {
    res.setHeader("Authorization", "Bearer ");
    return res.status(400).json({
      status: "error",
      message: "El usuario ya existe.",
    });
  }

  const newUsuario = new Usuario({ email, password });
  const savedUsuario = await newUsuario.save();

  const token = jwt.sign({ id: savedUsuario.id }, SECRET_KEY, {
    expiresIn: EXPIRES_IN,
  });

  res.setHeader("Authorization", `Bearer ${token}`);
  return res.status(200).json({
    status: "success",
    token: token,
    message: "Usuario creado exitosamente",
  });
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  const found = await Usuario.findOne({ where: { email } });
  if (!found) {
    res.setHeader("Authorization", "Bearer ");
    return res.status(400).json({
      status: "error",
      message: "Usuario no encontrado.",
    });
  }

  const hashedpwd = found.password;

  const isMatch = await bcrypt.compare(password, hashedpwd);
  if (!isMatch) {
    res.setHeader("Authorization", "Bearer ");
    return res.status(400).json({
      status: "error",
      message: "Contraseña incorrecta.",
    });
  }

  const token = jwt.sign({ id: found.id }, SECRET_KEY, {
    expiresIn: EXPIRES_IN,
  });

  res.setHeader("Authorization", `Bearer ${token}`);
  return res.status(200).json({
    status: "success",
    token: token,

    message: "Inicio de sesión exitoso",
  });
}

export async function logout(req, res) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      res.setHeader("Authorization", "Bearer ");
      return res.status(400).json({
        status: "error",
        message: "No se ha proporcionado un token",
      });
    }

    res.setHeader("Authorization", "Bearer ");
    return res.status(200).json({
      status: "success",
      message: "Logout exitoso",
    });
  } catch (error) {
    console.error(`Error al cerrar sesión: ${error.message}`);
    res.setHeader("Authorization", "Bearer ");
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

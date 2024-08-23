import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Usuario } from "../model/relations/relations.js";

const JWT_SECRET = env.jwt_secret;

export async function isAuth(req, res, next) {
  const { Authorization } = req.headers;
  if (!Authorization) {
    return res
      .status(401)
      .json({ error: "Se requiere el encabezado de autorización" });
  }

  const token = Authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Se requiere el token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { id } = payload;

    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error al verificar el token: ", error);
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
}

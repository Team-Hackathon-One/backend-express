import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const JWT_SECRET = env.jwt_secret;

export async function isAuth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .json({ error: "Se requiere el encabezado de autorización" });
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Se requiere el token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error al verificar el token: ", error);
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
}

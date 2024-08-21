import { environment } from "../../config/environment";
import jwt from "jsonwebtoken";

export function extractTokenFromHeader(request) {
  const authorizationHeader = request.headers["authorization"];
  return authorizationHeader?.split(" ")[1];
}

export async function verifyJWT(jsonWebToken) {
  try {
    return await jwt.verifyAsync(jsonWebToken, environment.jwt.secret);
  } catch (error) {
    throw new Error("Token inválido");
  }
}

export async function authenticateJWT(request, response, nextFunction) {
  const token = extractTokenFromHeader(request);

  if (!token) {
    return response.sendStatus(401); // Unauthorized
  }

  try {
    request.user = await verifyJWT(token);
    nextFunction();
  } catch (error) {
    return response.sendStatus(403); // Forbidden
  }
}

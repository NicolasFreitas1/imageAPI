import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const accessTokenScret = process.env.ACCESS_TOKEN_SECRET;

interface UserToken  {
  userId: string;
}

// Verificação se o usuario possui token autenticado
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Pega o token da headers.authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  // Verifica se o token existe
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }
  // Caso o usuario tenha token corre a aplicação normalmente
  try {
    const decodedToken = jwt.verify(token, `${accessTokenScret}`);
    res.locals.userId = (decodedToken as UserToken).userId; // Armazena o userId do token no res.locals
    next();
  } catch (err) {
    // Caso não tenha mostra uma mensangem dizendo que o token é invaldio
    res.status(401).send({ message: "Token inválido" });
  }
}

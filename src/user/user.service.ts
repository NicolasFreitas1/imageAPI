import bcrypt from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import * as imageService from "../image/image.service";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();
const prisma = new PrismaClient();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

// Função para a criação do usuário
export async function registerUser(
  name: string,
  login: string,
  password: string
): Promise<{ user: User; token: string }> {
  // Busca no banco de dados algum usuário com o login informado
  const existingUser = await prisma.user.findUnique({ where: { login } });
  // Caso exista algum usuário com o login, envia um erro informando que o usuário já existe
  if (existingUser) {
    throw new Error("Usuário já existe");
  }
  // Validação de senha
  if (!validatePassword(password)) {
    throw new Error(
      "A senha deve ter pelo menos 8 caracteres e pelo menos um número."
    );
  }
  // Criptografia da senha do usuário
  const hashedPassword = await bcrypt.hash(password, 10);
  // Criação do usuário no banco
  const user = await prisma.user.create({
    data: {
      name,
      login,
      password: hashedPassword,
    },
  });
  // Cria o token do usuário, com o nome e o Id
  const token = jwt.sign(
    { name: user.name, userId: user.id },
    `${accessTokenSecret}`
  );
  return { user, token };
}

// Função para login do usuário
export async function loginUser(
  login: string,
  password: string
): Promise<{ name: string; login: string; token: string }> {
  // Busca no banco de dados algum usuário com o login informado
  const user = await prisma.user.findUniqueOrThrow({ where: { login } });
  // Caso não exista nenhum usuário com o login informado, envia um erro

  // Verifica se a senha digitada é a mesma que a senha criptografada, caso não for envia um erro
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Senha incorreta");
  }
  // Cria o token do usuário, com o nome e o Id
  const token = jwt.sign(
    { name: user.name, userId: user.id },
    `${accessTokenSecret}`
  );
  return { name: user.name, login, token };
}

// Função para atualização da senha do usuário
export async function updatePasswordUser(
  id: number,
  newPassword: string,
  password: string
): Promise<User> {
  // Busca no banco de dados algum usuário com o id informado, caso não tenha envia um erro
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  // Verifica se a senha digitada é a mesma que a senha criptografada salva
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Senha incorreta");
  }

  // Criptografa a senha nova
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  // Atualiza o usuário no banco com a nova senha
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return updatedUser;
}

// Função para deletar usuário
export async function deleteUser(id: number): Promise<User> {
  // Busca no banco de dados algum usuário com o id informado, caso não tenha envia um erro
  const existingUser = await prisma.user.findUniqueOrThrow({ where: { id } });

  // Procura se o usuário tem alguma imagem salva com seu Id, se tiver deleta todas as imagens
  const userImages = await prisma.image.findMany({ where: { userId: id } });

  for (const image of userImages) {
    imageService.deleteImagesStored(image.userId);
  }
  const user = await prisma.user.delete({ where: { id } });

  return user;
}

// Função para pegar os usuário do banco de dados
export async function getUsers(): Promise<User[]> {
  const users = await prisma.user.findMany();
  return users;
}

// Fuçai para pegar um único usuário do banco de dados com base no seu Id
export async function getUserById(id: number): Promise<User> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  return user;
}

// Validação de senha
function validatePassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }
  const regex = /\d+/;
  return regex.test(password);
}

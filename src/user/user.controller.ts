import { Request, Response } from "express";
import * as userService from "./user.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDtoPassword } from "./dto/update-user-password.dto";

// Função para criação do usuário
export async function register(req: Request, res: Response) {
  // Cria o usuário com as informações recebidas no body, com base no CreateUserDto
  const data = req.body as CreateUserDto;
  const createUser = new CreateUserDto(data);
  const errors = createUser.validate();
  if (errors.length > 0) return res.status(400).send({ messages: errors });

  try {
    // Envia para o service os dados do userDto
    const { name, login, password } = data;
    const result = await userService.registerUser(name, login, password);
    // Caso a criação no banco tenha dado certo, retorna um 201 (Created success) e o usuário criado
    res.status(201).send(result);
  } catch (error: any) {
    // Caso der errado, retorna o erro
    console.error(error);
    res.status(400).send({ message: (error as Error).message });
  }
}

// Função de Login do usuário
export async function login(req: Request, res: Response) {
  try {
    // Envia para o service os dados recebidos no body
    const { login, password } = req.body;
    const result = await userService.loginUser(login, password);
    // Caso o login de certo, retorna um 200 (Ok) e o login
    res.status(200).send(result);
  } catch (error: any) {
    // Caso der errado, retorna o erro
    res.status(404).send({ message: (error as Error).message });
    console.log(error);
  }
}

// Função de atualização de senha do usuário
export async function userUpdate(req: Request, res: Response) {
  // Atualiza o usuário com as informações recebidas no body, com base no CreateUserDto
  const data = req.body as UpdateUserDtoPassword;
  const updateUser = new UpdateUserDtoPassword(data);
  const errors = updateUser.validate();
  if (errors.length > 0) return res.status(400).send({ messages: errors });
  try {
    const { newPassword, password } = data;
    const result = await userService.updatePasswordUser(
      parseInt(req.params.id),
      newPassword,
      password
    );

    res.status(200).send({ message: "Usuário atualizado", result });
  } catch (error: any) {
    console.error(error);
    res.status(404).send({ message: (error as Error).message });
  }
}

// Função para deletar o usuário com base no Id do params
export async function userDelete(req: Request, res: Response) {
  try {
    const result = await userService.deleteUser(parseInt(req.params.id, 10));
    res.status(200).send(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).send({ message: (error as Error).message });
  }
}

// Função para pegar todos os usuário do banco
export async function userGet(req: Request, res: Response) {
  try {
    const result = await userService.getUsers();
    res.status(200).send(result);
    console.log(result);
  } catch (error: any) {
    console.error(error);
    res.status(404).send({ message: (error as Error).message });
  }
}
// Função para um único usuário do banco, com base no seu id
export async function userGetId(req: Request, res: Response) {
  try {
    const result = await userService.getUserById(parseInt(req.params.id, 10));
    res.status(200).send(result);
    console.log(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

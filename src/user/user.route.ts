import express from "express";
import {
  register,
  login,
  userUpdate,
  userDelete,
  userGet,
  userGetId,
} from "./user.controller";
import { authenticateToken } from "../authMiddleware";

const userRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Rotas para gerenciamento de usuários
 */
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna todos os usuário.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Exemplo retornado com sucesso.
 */

userRouter.get("/", authenticateToken, userGet);

/**
 * @swagger
 * /user/:id:
 *   get:
 *     summary: Retorna um usuário pelo ID.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso.
 */

userRouter.get("/:id", authenticateToken, userGetId);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Cria um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 */
userRouter.post("/register", register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Cria um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 */
userRouter.post("/login", login);

/**
 * @swagger
 * /user/:id:
 *   put:
 *     summary: Atualiza a senha do usuário.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordUpdate'
 *     responses:
 *       201:
 *         description: Usuário atualizado com sucesso.
 */
// Rota para atualização de senha do usuário
userRouter.put("/:id", authenticateToken, userUpdate);

/**
 * @swagger
 * /user/:id:
 *   delete:
 *     summary: Deleta um usuário pelo Id.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Usuário deletada com sucesso.
 */
// Rota para deletar usuários
userRouter.delete("/:id", authenticateToken, userDelete);

export default userRouter;

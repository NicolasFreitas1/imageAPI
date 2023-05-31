import express from "express";
import {
  uploadImage,
  deleteImage,
  imageGet,
  imageGetId,
} from "./image.controller";
import { authenticateToken } from "../authMiddleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const imageRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Rotas para gerenciamento das imagens
 */
/**
 * @swagger
 * /image:
 *   get:
 *     summary: Retorna todos as imagens do usuário.
 *     tags: [Images]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Imagens retornado com sucesso.
 */
// Rota para pegar todas as imagens
imageRouter.get("/", authenticateToken, imageGet);

/**
 * @swagger
 * /image/:id:
 *   get:
 *     summary: Retorna uma imagem pelo ID.
 *     tags: [Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da imagem.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imagem retornado com sucesso.
 */

// Rota para pegar uma única imagem com base no id
imageRouter.get("/:id", authenticateToken, imageGetId);

/**
 * @swagger
 * /image/upload:
 *   post:
 *     summary: Cria uma nova imagem.
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImageUpload'
 *     responses:
 *       201:
 *         description: Imagem criado com sucesso.
 */

// Rota de registro de Imagens
imageRouter.post(
  "/upload",
  upload.single("image"),
  authenticateToken,
  uploadImage
);

/**
 * @swagger
 * /image/:id:
 *   delete:
 *     summary: Deleta um usuário pelo Id.
 *     tags: [Images]
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
 *         description: Imagem deletada com sucesso.
 */
// Rota para deletar Imagens
imageRouter.delete("/:id", authenticateToken, deleteImage);

export default imageRouter;

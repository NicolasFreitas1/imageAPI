import { Request, Response } from "express";
import * as imageService from "./image.service";
import { UploadImageDto } from "./dto/create-image.dto";

// Função de criação da imagem
export async function uploadImage(req: Request, res: Response) {
  // Pega o token salvo no res.locals
  const jwtUserId = res.locals.userId;
  if (!req.file) {
    return res.status(400).send("Nenhum arquivo selecionado");
  }
  // Cria a imagem com base nas validações do UploadImageDto
  const data = req.file as unknown as UploadImageDto;
  const createImageDto = new UploadImageDto(data);
  const errors = createImageDto.validate();
  if (errors.length > 0) return res.status(400).json({ messages: errors });
  try {
    // Envia para o service os dados da imagem
    const userId: number = jwtUserId;
    const result = await imageService.createImage(userId, data);

    const image = await imageService.getImageById(result.id);

    res.status(201).send(image);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: (error as Error).message });
  }
}

// Função para deletar imagens com base no id enviado por req.params
export async function deleteImage(req: Request, res: Response) {
  const jwtUserId = res.locals.userId;

  try {
    const result = await imageService.deleteImage(
      parseInt(req.params.id, 10),
      jwtUserId
    );
    res.status(200).send({ message: "Imagem deletada", result });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: (error as Error).message });
  }
}
// Função para pegar todas as imagens do usuário
export async function imageGet(req: Request, res: Response) {
  const jwtUserId = res.locals.userId;
  try {
    const imgInfo = await imageService.getImageByUser(jwtUserId); //Pega todas as imagens com base no id do usuário salvo no res.locals
    res.status(200).send(imgInfo);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: (error as Error).message });
  }
}
// Função para exibir apenas uma imagem, com base no seu id
export async function imageGetId(req: Request, res: Response) {
  try {
    // Pega os dados da imagem pelo id
    const imgInfo = await imageService.getImageById(
      parseInt(req.params.id, 10)
    );

    res.status(200).send(imgInfo);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

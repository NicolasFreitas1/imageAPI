import { PrismaClient, Image } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Função de criação de imagem no banco
export async function createImage(userId: number, data: any): Promise<Image> {
  const image = await prisma.image.create({
    data: {
      userId,
      name: data.originalname,
      nmStored: data.filename,
      vlSize: data.size / 1000,
      extension: data.mimetype,
    },
  });
  return image;
}

// Função para deletar imagens no banco
export async function deleteImage(
  id: number,
  jwtUserId: number
): Promise<Image> {
  // Verifica se o id do usuário cadastrado na imagem é o mesmo que o id do usuário, se não for envia um erro

  const image = await prisma.image.findUniqueOrThrow({ where: { id } });

  const userId = image.userId;

  if (userId != jwtUserId) {
    throw new Error("Você nao pode deletar imagens de outros ");
  }

  const deleteImage = await prisma.image.delete({ where: { id } });
  // Função para remover as imagens do diretório uploads
  await deleteImageStored(id);
  return deleteImage;
}

// Função para pegar todas as imagens do usuário
export async function getImageByUser(id: number) {
  const images = await prisma.image.findMany({ where: { userId: id } });
  if (!images) {
    throw new Error("Você nao possui imagens");
  }
  const imageConverted = convertAllUserImageB64(id);

  return imageConverted;
}
// Função para exibir apenas uma imagem
export async function getImageById(id: number): Promise<Image> {
  const image = await prisma.image.findUnique({ where: { id } });
  if (!image) {
    throw new Error("Imagem não encontrado");
  }
  const imageConverted = convertOnlyOneImage(id);

  return imageConverted;
}

export async function deleteImagesStored(userId: number): Promise<Image[]> {
  const images = await prisma.image.findMany({ where: { userId } });
  if (!images) {
    throw new Error("Voce nao possui imagens");
  }
  for (const image of images) {
    fs.unlink(`../src/uploads/${image.nmStored}`, function (err) {
      if (err) throw err;
      console.log("File deleted!");
    });
  }

  return images;
}

export async function deleteImageStored(id: number): Promise<Image> {
  const image = await prisma.image.findUniqueOrThrow({ where: { id } });

  fs.unlink(`../src/uploads/${image.nmStored}`, function (err) {
    if (err) throw err;
    console.log("File deleted!");
  });

  return image;
}

export async function convertAllUserImageB64(
  userId: number,
  encoding: BufferEncoding = "base64"
): Promise<any[]> {
  const images = await prisma.image.findMany({ where: { userId } });

  if (!images) {
    throw new Error("Nenhuma imagem encontrada para o usuário");
  }

  const folderPath = process.cwd() + "/uploads/";
  const imageData: any[] = [];

  for (const image of images) {
    const filePath = path.join(folderPath, image.nmStored);
    const b64Image = fs.readFileSync(filePath, { encoding });
    const objectImage = { ...image, data: b64Image };
    imageData.push(objectImage);
  }

  return imageData;
}

export async function convertOnlyOneImage(id: number) {
  const image = await prisma.image.findUnique({ where: { id } });

  if (!image) {
    throw new Error("Imagem não encontrado");
  }
  const folderPath = process.cwd() + `/uploads/${image.nmStored}`; // Entra na pasta '/uploads' e procura o nome salvo da imagem
  const b64Image = fs.readFileSync(folderPath, { encoding: "base64" }); // Tranforma em base64 aquela unica imagem
  const objectImage = { ...image, data: b64Image }; // Cria um objeto da imagem, com os dados dela e o base64

  return objectImage;
}

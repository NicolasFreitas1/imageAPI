import {IDto} from '../../interfaces/interfaceIDto';

export class UploadImageDto implements IDto {
  filename!: string;
  originalname!: string;
  size!: number;
  mimetype!: string;
  createdAt!: Date;

  constructor(partial: Partial<UploadImageDto>) {
    Object.assign(this, partial);
  }

  validate(): string[] {
    const errors: string[] = [];

    const sizeErrors = this.validateSize();
    const mimetypeErrors = this.validateMimetype();

    if (sizeErrors) errors.push(sizeErrors);
    if (mimetypeErrors) errors.push(mimetypeErrors);

    return errors;
  }
  // Validação do tamanho da imagem
  private validateSize(): string | null {
    if (this.size > 1000000) return "Tamanho muito grande da imagem";

    return null;
  }
  // Validação do tipo de imagem
  private validateMimetype(): string | null {
    if (!this.mimetype.startsWith("image/"))
      return "Arquivo deve ser uma imagem";

    return null;
  }
}

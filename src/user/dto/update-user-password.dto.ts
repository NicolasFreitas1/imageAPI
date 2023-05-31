import {IDto} from '../../interfaces/interfaceIDto';

export class UpdateUserDtoPassword implements IDto {
 
  newPassword!: string;
  password!: string;

  constructor(partial: Partial<UpdateUserDtoPassword>) {
    Object.assign(this, partial);
  }

  validate(): string[] {
    const errors: string[] = [];
    const passwordError = this.validatePassword();
    const newPasswordError = this.validateNewPassword();

    if (passwordError) errors.push(passwordError);
    if (newPasswordError) errors.push(newPasswordError);

    // Verifica se a nova senha é igual a senha antiga
    if (this.password === this.newPassword) {
      errors.push("A nova senha não pode ser igual à senha antiga");
    }

    return errors;
  }

  private validatePassword(): string | null {
    if (typeof this.password !== "string") return "Nova senha não é uma string";
    if (this.password.length < 8 || this.password.length > 25)
      return "Nova senha deve ser maior que 8 ou menor que 25";
    return null;
  }

  private validateNewPassword(): string | null {
    if (typeof this.newPassword !== "string")
      return "Senha antiga não é uma string";
    if (this.newPassword.length < 8 || this.newPassword.length > 25)
      return "Senha antiga deve ser maior que 8 ou menor que 25";
    return null;
  }
}

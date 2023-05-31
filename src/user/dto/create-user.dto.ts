import {IDto} from '../../interfaces/interfaceIDto';

/** 
 * Valida a criação do usuario
 * @returns returna uma array com os erros de validação
 */

export class CreateUserDto implements IDto {
  name!: string;
  login!: string;
  password!: string;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  validate(): string[] {
    const errors: string[] = [];
    const nameError = this.validateName();
    const loginError = this.validateLogin();
    const passwordError = this.validatePassword();

    if (nameError) errors.push(nameError);
    if (loginError) errors.push(loginError);
    if (passwordError) errors.push(passwordError);

    return errors;
  }

  private validateName(): string | null {
    if (!this.name) return "Nome não informado";
    if (typeof this.name !== "string") return "Nome não é uma string";
    if (this.name.length < 5 || this.name.length > 50)
      return "Nome deve ser maior que 5 ou menor que 50";
    return null;
  }

  private validateLogin(): string | null {
    if (!this.login) return "Login não informado";
    if (typeof this.login !== "string") return "Login não é uma string";
    if (this.login.length < 5 || this.login.length > 50)
      return "Login deve ser maior que 5 ou menor que 50";
    return null;
  }

  private validatePassword(): string | null {
    if (!this.password) return "Senha não informada";
    if (typeof this.password !== "string") return "Senha nao é string";
    if (this.password.length < 8 || this.password.length > 25)
      return "Senha deve ser maior que 8 ou menor que 25";
    return null;
  }
}

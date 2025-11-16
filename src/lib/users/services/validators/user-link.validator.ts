import { DomainError, IValidationError } from "@/core/types/domain-errors";
import { Validator } from "@/core/utils/validator";
import { PLATFORMS } from "../../interfaces/user-links/platforms";
import { NewLinkDTO } from "../../interfaces/user-links/dtos/new-user-link.dto";

export class UserLinkValidator {
  private _errors: IValidationError[] = [];

  /**
   * Devuelve true si la validación tuvo errores.
   */
  public get hasErrors(): boolean {
    return this._errors.length > 0;
  }

  /**
   * Ejecuta todas las validaciones de un objeto User y lanza un error si hay fallos.
   * @param user El objeto User a validar (se asume que password_hash y created_at se manejan en otro lugar).
   */
  public validate(link: NewLinkDTO): void {
    this._errors = [];

    // Validar campos obligatorios y opcionales
    if (link.username !== undefined) this.username(link.username);
    if (link.platform !== undefined) this.platform(link.platform);
    if (this.hasErrors) {
      throw new DomainError(this._errors);
    }
  }

  private addError(error: IValidationError): void {
    this._errors.push(error);
  }

  public platform(value: string) {
    const field = "platform";

    if (Validator.isNullOrEmpty(value)) {
      this.addError({ message: "Is required", type: "REQUIRED", field });
      return;
    }

    if (!Validator.isEnum(value, PLATFORMS)) {
      this.addError({
        message: "Has to be a valid platoform",
        type: "INVALID_FORMAT",
        field,
      });
    }
  }

  public username(value: string) {
    const field = "username";

    if (Validator.isNullOrEmpty(value)) {
      this.addError({ message: "Is required", type: "REQUIRED", field });
      return;
    }

    if (!Validator.isString(value)) {
      this.addError({
        message: "Has to be a string",
        type: "INVALID_TYPE",
        field,
      });
    }
  }
}

// Asumimos que Validator, IValidationError, y DomainError están importados/definidos

import { DomainError, IValidationError } from "@/core/types/domain-errors";
import { Validator } from "@/core/utils/validator";
import { User } from "../../models/User";

export class UserValidator {
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
  public validate(user: Partial<User>): void {
    this._errors = [];

    // Validar campos obligatorios y opcionales
    if (user.user_id !== undefined) this.user_id(user.user_id);
    if (user.email !== undefined) this.email(user.email);
    if (user.username !== undefined) this.username(user.username);
    if (user.password_hash !== undefined) this.password(user.password_hash);
    if (user.about !== undefined) this.about(user.about);
    if (user.avatar_url !== undefined) this.avatar_url(user.avatar_url);

    if (this.hasErrors) {
      throw new DomainError(this._errors);
    }
  }

  // --- Métodos de Validación ---

  public user_id(value: number) {
    const field = "user_id";

    if (!Validator.isNumber(value)) {
      this.addError({
        message: "User ID must be a number",
        type: "INVALID_TYPE",
        field,
      });
      return;
    }

    if (!Validator.isPositive(value)) {
      this.addError({
        message: "User ID must be a positive number",
        type: "OUT_OF_RANGE",
        field,
      });
    }
  }

  public email(value: string) {
    const field = "email";

    if (Validator.isNullOrEmpty(value)) {
      this.addError({ message: "Email is required", type: "REQUIRED", field });
      return;
    }

    if (!Validator.isString(value)) {
      this.addError({
        message: "Email has to be a string",
        type: "INVALID_TYPE",
        field,
      });
    }

    if (!Validator.hasLengthBetween(value, 15, 255)) {
      this.addError({
        message: "Email needs to be between 15 and 255 characters long",
        type: "OUT_OF_RANGE",
        field,
      });
    }

    if (!Validator.isEmail(value)) {
      this.addError({
        message: "Email needs to be a valid email format",
        type: "INVALID_FORMAT",
        field,
      });
    }
  }

  public username(value: string) {
    const field = "username";
    value = value ? value.trim() : value; // Solo trim si existe para la validación isNullOrEmpty

    if (Validator.isNullOrEmpty(value)) {
      this.addError({
        message: "Username is required",
        type: "REQUIRED",
        field,
      });
      return;
    }

    if (!Validator.isString(value)) {
      this.addError({
        message: "Username has to be a string",
        type: "INVALID_TYPE",
        field,
      });
    }

    if (!Validator.hasLengthBetween(value, 5, 26)) {
      this.addError({
        message: "Username needs to be between 5 and 26 characters long",
        type: "OUT_OF_RANGE",
        field,
      });
    }

    // Regex para username: letras, números, guion bajo, o guion medio (ejemplo más simple y seguro)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;

    // Nota: Tu regex original es extremadamente complejo, he usado uno más simple.
    // Si necesitas el complejo: /^(?=[a-zA-Z0-9]|[^\w\s()+=\\'"?/><,#^&*!~`|\\-])(?:[a-zA-Z0-9]|[^\w\s()+=\\'"?/><,#^&*!~`|\\-](?![^\w\s()+=\\'"?/><,#^&*!~`|\\-]))+$/
    if (!Validator.matchesRegex(value, usernameRegex)) {
      this.addError({
        message:
          "Username contains invalid characters (only letters, numbers, underscore, and hyphen allowed).",
        type: "INVALID_FORMAT",
        field,
      });
    }
  }

  public password(value: string) {
    const field = "password";

    if (Validator.isNullOrEmpty(value)) {
      this.addError({
        message: "Password is required",
        type: "REQUIRED",
        field,
      });
      return;
    }

    if (!Validator.isString(value)) {
      this.addError({
        message: "Password has to be a string",
        type: "INVALID_TYPE",
        field,
      });
    }

    if (!Validator.hasLengthBetween(value, 8, 20)) {
      this.addError({
        message: "Password needs to be between 8 and 20 characters long",
        type: "OUT_OF_RANGE",
        field,
      });
    }
  }

  public about(value: string) {
    const field = "about";

    if (value && !Validator.isString(value)) {
      this.addError({
        message: "About field has to be a string",
        type: "INVALID_TYPE",
        field,
      });
    }

    if (value && !Validator.hasLengthBetween(value, 0, 500)) {
      this.addError({
        message: "About field is too long (max 500 characters)",
        type: "OUT_OF_RANGE",
        field,
      });
    }
  }

  public avatar_url(value: string) {
    const field = "avatar_url";

    // Asumimos que el avatar_url es opcional (puede ser nulo o vacío)
    if (Validator.isNullOrEmpty(value)) {
      // Si es opcional, salimos sin error si está vacío.
      return;
    }

    if (!Validator.isString(value)) {
      this.addError({
        message: "Avatar URL has to be a string",
        type: "INVALID_TYPE",
        field,
      });
    }

    if (!Validator.isUrl(value)) {
      this.addError({
        message: "Avatar URL needs to be a valid URL format",
        type: "INVALID_FORMAT",
        field,
      });
    }
  }

  // --- Función Auxiliar ---
  private addError(error: IValidationError): void {
    this._errors.push(error);
  }
}

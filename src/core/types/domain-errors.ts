import { ContentfulStatusCode } from "hono/utils/http-status";

// 1. Tipos de errores comunes para validación de dominio/formulario
export const VALIDATION_ERROR_TYPES = [
  "REQUIRED",
  "INVALID_TYPE",
  "OUT_OF_RANGE",
  "INVALID_FORMAT",
  "CUSTOM_RULE_FAILED",
] as const;

export type ValidationErrorType = (typeof VALIDATION_ERROR_TYPES)[number];

// 2. Interfaz para describir un único error de validación
export interface IValidationError {
  /** El campo (propiedad) donde ocurrió el error. Ej: 'email', 'password' */
  field: string;
  /** El tipo de validación que falló. Ej: 'REQUIRED', 'INVALID_TYPE' */
  type: ValidationErrorType;
  /** Un mensaje descriptivo del error. Ej: 'El campo email debe ser un string válido.' */
  message: string;
}

/**
 * Error personalizado para fallos de validación de Dominio, Esquemas o Formulario.
 * Almacena una lista de errores de validación específicos por campo.
 */
export class DomainError extends Error {
  /**
   * Tipo canónico del error, útil para manejarlo en los middlewares.
   */
  public readonly name: "DomainError" = "DomainError";

  /**
   * Lista de errores de validación detallados.
   */
  public readonly validationErrors: IValidationError[];

  /**
   * Código de estado HTTP que se recomienda devolver (por defecto 400 Bad Request).
   */
  public readonly status: ContentfulStatusCode = 400;

  /**
   * @param validationErrors - Un array de objetos IValidationError.
   * @param message - Mensaje general para el error (opcional).
   */
  constructor(
    validationErrors: IValidationError[],
    message: string = "Uno o más campos fallaron la validación del dominio.",
  ) {
    super(message);
    this.validationErrors = validationErrors;

    // Asegura que la instancia sea de tipo DomainError para la trazabilidad (importante en TS/Node)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainError);
    }
  }
}

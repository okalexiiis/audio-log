/**
 * Error personalizado para fallos de lógica de la aplicación (Reglas de Negocio).
 * Ejemplos: Entidad no encontrada (404), Conflicto de estado (409), etc.
 */
export class ApplicationError extends Error {
  public readonly name: "ApplicationError" = "ApplicationError";

  /**
   * Un código interno que ayuda a clasificar el error (ej: 'NOT_FOUND', 'CONFLICT').
   */
  public readonly code: string;

  /**
   * Código de estado HTTP que debe devolver la API.
   */
  public readonly status: number;

  /**
   * @param code - Código interno del error (ej: 'USER_NOT_FOUND').
   * @param message - Mensaje descriptivo para el error.
   * @param status - Código de estado HTTP (ej: 404). Por defecto 500.
   */
  constructor(
    code: string,
    message: string,
    status: number = 500, // Por defecto, si no se especifica, es un fallo interno
  ) {
    super(message);
    this.code = code;
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "RECURSO NO ENCONTRADO", code = "NOT_FOUND") {
    super(code, message, 404);
  }
}

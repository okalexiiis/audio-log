// En InfrastructureError.ts

/**
 * Error personalizado para fallos de Infraestructura, sistema, o servicios de terceros.
 * Ejemplos: Fallo de conexión a DB, timeout de API externa, errores de permisos de S3.
 */
export class InfrastructureError extends Error {
  public readonly name: "InfrastructureError" = "InfrastructureError";

  /**
   * Un código interno que ayuda a clasificar el error (ej: 'DB_CONNECTION_FAILED').
   */
  public readonly code: string;

  /**
   * Código de estado HTTP que debe devolver la API (casi siempre 500).
   */
  public readonly status: number = 500;

  /**
   * @param code - Código interno del error (ej: 'DB_UNAVAILABLE').
   * @param message - Mensaje descriptivo para el error (puede ser técnico).
   * @param originalError - Opcionalmente, la instancia de error nativa capturada (ej: el error de conexión de la DB).
   */
  constructor(code: string, message: string, originalError?: unknown) {
    // Al usuario final se le mostrará solo un mensaje genérico, no el mensaje interno.
    super(`Fallo de infraestructura: ${message}`);
    this.code = code;

    // Almacenar el error original ayuda en el logging y la depuración.
    if (originalError) {
      // Puedes adjuntar el error original al error para fines de depuración.
      (this as any).originalError = originalError;
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InfrastructureError);
    }
  }
}

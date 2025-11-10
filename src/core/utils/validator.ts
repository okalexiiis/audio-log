export class Validator {
  // --- Validación de Tipos Básicos ---

  /**
   * Valida si un valor es null, undefined, o una cadena vacía (después de trim).
   */
  static isNullOrEmpty(value: any): boolean {
    if (value === null || typeof value === "undefined") {
      return true;
    }
    if (typeof value === "string") {
      return value.trim().length === 0;
    }
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    // Para objetos, puedes extender esto para verificar si no tiene propiedades, si lo necesitas
    return false;
  }

  /**
   * Valida si un valor es un número finito (excluye NaN, Infinity, strings).
   */
  static isNumber(value: any): boolean {
    return typeof value === "number" && isFinite(value);
  }

  /**
   * Valida si un valor es una cadena de texto.
   */
  static isString(value: any): boolean {
    return typeof value === "string";
  }

  /**
   * Valida si un valor es un objeto (excluyendo null y arrays).
   */
  static isObject(value: any): boolean {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  /**
   * Valida si un valor es un array.
   */
  static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  // --- Validación de Formatos de String ---

  // --- Nuevo Método para Expresiones Regulares ---
  /**
   * Valida si una cadena coincide con el Regex proporcionado.
   */
  static matchesRegex(value: string, regex: RegExp): boolean {
    if (Validator.isNullOrEmpty(value) || typeof value !== "string") {
      return false;
    }
    return regex.test(value);
  }

  /**
   * Valida si una cadena coincide con el formato de email.
   */
  static isEmail(email: string): boolean {
    if (Validator.isNullOrEmpty(email)) return false;
    // Regex simple para email (puede ser más complejo según requerimientos)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Valida si una cadena es una URL válida.
   */
  static isUrl(url: string): boolean {
    if (Validator.isNullOrEmpty(url)) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Valida si una cadena tiene el formato de un UUID (Universally Unique Identifier).
   */
  static isUuid(uuid: string): boolean {
    if (Validator.isNullOrEmpty(uuid)) return false;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // --- Validación de Longitud y Rango ---

  /**
   * Valida si la longitud de una cadena (o un array) está dentro de un rango.
   */
  static hasLengthBetween(
    value: string | any[],
    min: number,
    max: number,
  ): boolean {
    if (Validator.isNullOrEmpty(value)) return false;
    const length = value.length;
    return length >= min && length <= max;
  }

  /**
   * Valida si un número está dentro de un rango (inclusivo).
   */
  static isBetween(value: number, min: number, max: number): boolean {
    if (!Validator.isNumber(value)) return false;
    return value >= min && value <= max;
  }

  /**
   * Valida si un número es positivo (mayor que cero).
   */
  static isPositive(value: number): boolean {
    if (!Validator.isNumber(value)) return false;
    return value > 0;
  }
}

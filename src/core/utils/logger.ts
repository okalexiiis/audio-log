export const LOG_LEVEL = ["debug", "info", "warn", "danger"] as const;
export type TLOG_LEVEL = (typeof LOG_LEVEL)[number];

export const LEVEL_WEIGHTS: Record<TLOG_LEVEL, number> = {
  debug: 0, // Nivel más bajo, registra todo
  info: 1,
  warn: 2,
  danger: 3, // Nivel más alto, registra solo lo crítico
};

export class Logger {
  // Establecer 'info' como nivel predeterminado
  private readonly level: TLOG_LEVEL = "info";

  constructor(level: TLOG_LEVEL) {
    // 1. Verificar si el nivel proporcionado es un nivel válido.
    if (!(LOG_LEVEL as readonly string[]).includes(level)) {
      throw new Error(
        `Nivel de log no válido: ${level}. Los niveles permitidos son: ${LOG_LEVEL.join(", ")}`,
      );
    }
    // 2. Si es válido, se asigna el nivel.
    this.level = level;
  }

  private shouldLog(messageLevel: TLOG_LEVEL): boolean {
    return LEVEL_WEIGHTS[messageLevel] >= LEVEL_WEIGHTS[this.level];
  }

  public info(module: string, message: string, data?: unknown) {
    if (this.shouldLog("info")) {
      console.info(`[INFO] [${module}] ${message}`, data || "");
    }
  }

  public warn(module: string, message: string, data?: unknown) {
    if (this.shouldLog("warn")) {
      console.warn(`[WARN] [${module}] ${message}`, data || "");
    }
  }

  public danger(
    module: string,
    message: string,
    error?: Error | unknown,
    data?: unknown,
  ) {
    if (this.shouldLog("danger")) {
      console.error(`[DANGER] [${module}] ${message}`, error, data || "");
    }
  }

  public debug(module: string, message: string, data?: unknown) {
    if (this.shouldLog("debug")) {
      console.log(`[DEBUG] [${module}] ${message}`, data || "");
    }
  }

  public log(
    level: TLOG_LEVEL,
    module: string,
    message: string,
    data?: unknown,
  ) {
    if (this.shouldLog(level)) {
      const output = data ? { message, data } : { message };
      console[level === "danger" ? "error" : level === "warn" ? "warn" : "log"](
        `[${level.toUpperCase()}] [${module}]`,
        output,
      );
    }
  }
}

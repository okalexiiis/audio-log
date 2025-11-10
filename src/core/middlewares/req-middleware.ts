import { Context, Next, MiddlewareHandler } from "hono";
import { Logger } from "../utils/logger";

interface HonoEnv {
  Variables: {
    logger: Logger;
  };
}

export const requestLogger = (
  loggerInstance: Logger,
): MiddlewareHandler<HonoEnv> => {
  return async (c: Context<HonoEnv>, next: Next) => {
    const start = Date.now();
    const url = c.req.url;
    const method = c.req.method;

    let body: unknown = {};
    try {
      if (["POST", "PUT", "PATCH"].includes(method)) {
        body = await c.req.json().catch(() => c.req.text().catch(() => "N/A"));
      }
    } catch (error) {
      body = { error: "No se pudo parsear el cuerpo de la petición" };
    }

    loggerInstance.info("REQUEST_IN", `Petición recibida: ${method} ${url}`, {
      body: body,
      headers: c.req.header,
      query: c.req.query(),
    });

    await next();

    const end = Date.now();
    const duration = end - start;
    const status = c.res.status;

    const logDetails = {
      status,
      duration_ms: duration,
    };

    if (status >= 500) {
      loggerInstance.danger(
        "REQUEST_OUT",
        `[ERROR] Petición terminada: ${method} ${url}`,
        logDetails,
      );
    } else if (status >= 400) {
      loggerInstance.warn(
        "REQUEST_OUT",
        `[CLIENT ERROR] Petición terminada: ${method} ${url}`,
        logDetails,
      );
    } else {
      loggerInstance.info(
        "REQUEST_OUT",
        `Petición terminada: ${method} ${url}`,
        logDetails,
      );
    }
  };
};

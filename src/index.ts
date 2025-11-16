import "dotenv/config";
import { Hono } from "hono";
import { UserDrizzleRepository } from "./lib/users/services/repositories/user.repository";
import { Logger, TLOG_LEVEL } from "./core/utils/logger";
import { requestLogger } from "./core/middlewares";
import UserRouter from "./lib/users/routes";
import { DomainError } from "./core/types/domain-errors";
import { ApplicationError } from "./core/types/application-errors";
import { ContentfulStatusCode } from "hono/utils/http-status";

const app = new Hono();
const log_level = process.env.LOG_LEVEL! as TLOG_LEVEL;
export const logger = new Logger(log_level);

// Pre-Request Middlewares
app.use("*", requestLogger(logger));

app.route("/", UserRouter);

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

app.onError((err: any, c) => {
  logger.danger("CATCH ERROR", err.message, err);
  if (err instanceof DomainError) {
    return c.json(
      { message: err.message, errors: err.validationErrors },
      err.status,
    );
  }

  if (err instanceof ApplicationError) {
    return c.json(
      { message: err.message, code: err.code },
      err.status as ContentfulStatusCode,
    );
  }
  return c.json(
    { cause: err.cause, message: err.message, name: err.name },
    500,
  );
});

export default app;

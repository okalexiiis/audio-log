import "dotenv/config";
import { Hono } from "hono";
import { UserDrizzleRepository } from "./lib/users/services/repositories/user.repository";
import { Logger, TLOG_LEVEL } from "./core/utils/logger";
import { requestLogger } from "./core/middlewares";
import UserRouter from "./lib/users/routes";
import { DomainError } from "./core/types/domain-errors";

const app = new Hono();
const log_level = process.env.LOG_LEVEL! as TLOG_LEVEL;
const logger = new Logger(log_level);

// Pre-Request Middlewares
app.use("*", requestLogger(logger));

app.route("/", UserRouter);

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

app.get("/test", async (c) => {
  const repo = new UserDrizzleRepository();

  const users = await repo.findAll({}, { username: "ito" });

  return c.json({ data: users });
});

app.onError((err: any, c) => {
  logger.danger("CATCH ERROR", err.message, err);
  if (err instanceof DomainError) {
    return c.json(
      { message: err.message, errors: err.validationErrors },
      err.status,
    );
  }
  return c.json({ cause: err.cause, message: err.message, name: err.name });
});

export default app;

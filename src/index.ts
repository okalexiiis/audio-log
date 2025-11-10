import { Hono } from "hono";
import { UserDrizzleRepository } from "./lib/users/services/repositories/user.repository";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

app.get("/test", async (c) => {
  const repo = new UserDrizzleRepository();

  const users = await repo.findAll({}, { username: "ito" });

  return c.json({ data: users });
});

app.onError((err, c) => {
  console.log(err);
  return c.json({ cause: err.cause, message: err.message, name: err.name });
});

export default app;

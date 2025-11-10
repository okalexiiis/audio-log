import { Context, Hono } from "hono";
import { RegisterUser } from "../services/use-cases/register";

const app = new Hono();

app.post("/user/register", async (c: Context) => {
  const uc = new RegisterUser();
  const raw = await c.req.json();
  const res = await uc.execute(raw);
  return c.json(res);
});

export default app;

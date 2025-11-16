import { Context, Hono } from "hono";
import { RegisterUser } from "../services/use-cases/register";
import { SearchUserByUsername } from "../services/use-cases/search-user-by-username";

const app = new Hono();

app.post("/user/register", async (c: Context) => {
  const uc = new RegisterUser();
  const raw = await c.req.json();
  const res = await uc.execute(raw);
  return c.json(res, 201);
});

app.get("/user/:username", async (c: Context) => {
  const uc = new SearchUserByUsername();
  const raw = c.req.param("username");
  const res = await uc.execute(raw);
  return c.json({ message: "User Found", data: res }, 200);
});

export default app;

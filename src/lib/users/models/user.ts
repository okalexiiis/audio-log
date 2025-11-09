import { index, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const User = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 25 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password_hash: varchar({ length: 255 }).notNull(),
  avatar_url: varchar({ length: 255 }),
});

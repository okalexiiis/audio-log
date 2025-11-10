import { date, integer, pgTable, varchar } from "drizzle-orm/pg-core";

const DEFAULT_PFP =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Fb6%2F47%2F0b%2Fb6470b72ee3ad6dc963ad5a5f792b264.jpg%3Fnii%3Dt&f=1&nofb=1&ipt=d29bac7bca80b3592bf8e2fbde5462d047d217bc9409bb69a4e526fd9975eee2";

export const Users = pgTable("users", {
  user_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 25 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password_hash: varchar({ length: 255 }).notNull(),
  about: varchar({ length: 500 })
    .notNull()
    .$default(() => ""),
  avatar_url: varchar({ length: 255 })
    .notNull()
    .$default(() => DEFAULT_PFP),
  created_at: date({ mode: "date" }).notNull().defaultNow(),
});

export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  about: string;
  avatar_url: string;
  created_at: Date;
}

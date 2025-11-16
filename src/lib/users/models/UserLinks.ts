import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { Users } from "./User";

export const UserLinks = pgTable("user_links", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .references(() => Users.user_id, { onDelete: "cascade" })
    .notNull(),
  platform: varchar({ length: 15 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
});

export interface UserLink {
  id: number;
  user_id: number;
  platform: string;
  link: string;
}

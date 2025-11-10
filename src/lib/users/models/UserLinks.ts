import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { Users } from "./User";
import { Platforms } from "../interfaces/user-links/platforms";

export const UserLinks = pgTable("user_links", {
  user_link_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fk_user_id: integer()
    .references(() => Users.user_id, { onDelete: "cascade" })
    .notNull(),
  platform: varchar({ length: 15 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
});

export interface UserLink {
  id: number;
  user_id: number;
  platform: Platforms;
  link: string;
}

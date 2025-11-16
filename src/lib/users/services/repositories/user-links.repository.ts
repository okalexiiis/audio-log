import { db } from "@/core/db.config";
import {
  NewUserLink,
  UserLinkFilters,
  UserLinkRepository,
} from "../../interfaces/user-links/repository";
import { UserLink, UserLinks } from "../../models/UserLinks";
import { PaginationParams } from "@/core/interfaces/api";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { applyFilters } from "@/core/utils/apply-filters";

export class UserLinksDrizzleRepository implements UserLinkRepository {
  constructor(private readonly _db = db) {}

  async save(newUserLink: NewUserLink): Promise<UserLink> {
    const savedUser: UserLink[] = await db
      .insert(UserLinks)
      .values(newUserLink)
      .returning();
    return savedUser[0];
  }

  async search({
    id,
    user_id,
  }: Omit<UserLinkFilters, "created_at">): Promise<UserLink[]> {
    const where = [];

    if (id !== undefined) where.push(eq(UserLinks.id, id));
    if (user_id !== undefined) where.push(eq(UserLinks.user_id, user_id));

    if (where.length === 0) {
      throw new Error("Debe proporcionar al menos un filtro para findOne()");
    }

    const result = await this._db
      .select()
      .from(UserLinks)
      .where(and(...where));

    return result ?? [];
  }

  async delete(id: number): Promise<boolean> {
    const result = await this._db
      .delete(UserLinks)
      .where(eq(UserLinks.user_id, id))
      .returning();

    return result.length > 0;
  }

  async update(id: number, newUser: Partial<NewUserLink>): Promise<UserLink> {
    const updated = await this._db
      .update(UserLinks)
      .set(newUser)
      .where(eq(UserLinks.user_id, id))
      .returning();

    if (updated.length === 0) {
      return null as any;
    }

    return updated[0];
  }
}

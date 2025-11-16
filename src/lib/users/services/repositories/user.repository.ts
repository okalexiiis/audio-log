import { db } from "@/core/db.config";
import {
  NewUser,
  UserFilters,
  UserRepository,
} from "../../interfaces/users/repository";
import { User, Users } from "../../models/User";
import { PaginationParams } from "@/core/interfaces/api";
import { and, asc, desc, eq, gte, like, lte, sql } from "drizzle-orm";
import { applyFilters } from "@/core/utils/apply-filters";

export class UserDrizzleRepository implements UserRepository {
  constructor(private readonly _db = db) {}

  async save(newUser: NewUser): Promise<User> {
    const savedUser: User[] = await db
      .insert(Users)
      .values(newUser)
      .returning();
    return savedUser[0];
  }

  async findAll(
    {
      limit = 10,
      page = 1,
      sort = "asc",
      orderBy = "user_id",
      includeTotal = true,
    }: PaginationParams<User> & { includeTotal?: boolean } = {},
    filters?: UserFilters,
  ): Promise<User[] | { data: User[]; total: number }> {
    const offset = (page - 1) * limit;

    let query = this._db
      .select()
      .from(Users)
      .limit(limit)
      .offset(offset)
      .orderBy(sort === "desc" ? desc(Users[orderBy]) : asc(Users[orderBy]));

    query = applyFilters({ entity: Users, filters, query });

    const data = await query;
    if (includeTotal) {
      const [{ count }] = await this._db
        .select({ count: sql<number>`count(*)` })
        .from(Users);
      return { data, total: count };
    }

    return data;
  }

  async findOne({
    user_id,
    username,
    email,
  }: Omit<UserFilters, "created_at">): Promise<User | null> {
    const where = [];

    if (username !== undefined) where.push(eq(Users.username, username));
    if (email !== undefined) where.push(eq(Users.email, email));
    if (user_id !== undefined) where.push(eq(Users.user_id, user_id));

    if (where.length === 0) {
      throw new Error("Debe proporcionar al menos un filtro para findOne()");
    }

    const result = await this._db
      .select()
      .from(Users)
      .where(and(...where))
      .limit(1);

    return result[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this._db
      .delete(Users)
      .where(eq(Users.user_id, id))
      .returning();

    return result.length > 0;
  }

  async update(id: number, newUser: Partial<NewUser>): Promise<User> {
    const updated = await this._db
      .update(Users)
      .set(newUser)
      .where(eq(Users.user_id, id))
      .returning();

    if (updated.length === 0) {
      return null as any;
    }

    return updated[0];
  }
}

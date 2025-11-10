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
    // console.log("[USER REPOSITORY: save()] saved user: ", savedUser);
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

    // Construimos la base del query
    let query = this._db
      .select()
      .from(Users)
      .limit(limit)
      .offset(offset)
      .orderBy(sort === "desc" ? desc(Users[orderBy]) : asc(Users[orderBy]));

    query = applyFilters({ entity: Users, filters, query });

    // console.log("[USER REPOSITORY: findAll()] query: ", query);
    const data = await query;
    // console.log("[USER REPOSITORY: findAll()] data: ", data);
    if (includeTotal) {
      const [{ count }] = await this._db
        .select({ count: sql<number>`count(*)` })
        .from(Users);
      return { data, total: count };
    }

    return data;
  }

  async findOne(filters: UserFilters): Promise<User | null> {
    // to implement
    return null;
  }

  async delete(id: number): Promise<boolean> {
    return true;
  }

  async update(id: number, newUser: Partial<NewUser>): Promise<User> {
    return {
      about: "",
      avatar_url: "",
      created_at: new Date(),
      email: "",
      password_hash: "",
      user_id: 1,
      username: "",
    } as User;
  }
}

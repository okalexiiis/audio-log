import { type PaginationParams } from "@/core/interfaces/api";
import { User } from "../../models/User";

export type UserFilters = Partial<
  Pick<User, "email" | "username" | "user_id" | "created_at">
>;
export type NewUser = Omit<
  User,
  "user_id" | "created_at" | "about" | "avatar_url"
>;

export interface UserRepository {
  save(newUser: NewUser): Promise<User>;
  findAll(
    options?: PaginationParams<User> & { includeTotal: boolean | false },
    filters?: UserFilters,
  ): Promise<User[] | { data: User[]; total: number }>;
  findOne(filters: UserFilters): Promise<User | null>;
  update(id: number, newUser: Partial<NewUser>): Promise<User>;
  delete(id: number): Promise<boolean>;
}

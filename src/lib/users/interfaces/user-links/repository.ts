import { type PaginationParams } from "@/core/interfaces/api";
import { UserLink } from "../../models/UserLinks";

export type UserLinkFilters = Partial<Pick<UserLink, "id">>;
export type NewUserLink = Omit<UserLink, "id">;

export interface UserRepository {
  save(newUserLink: NewUserLink): Promise<UserLink>;
  findAll(
    options?: PaginationParams<UserLink> & { includeTotal: boolean | false },
    filters?: UserLinkFilters,
  ): Promise<UserLink[] | { data: UserLink[]; total: number }>;
  findOne(filters: UserLinkFilters): Promise<UserLink | null>;
  update(id: number, newUser: Partial<NewUserLink>): Promise<UserLink>;
  delete(id: number): Promise<boolean>;
}

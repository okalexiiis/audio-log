import { UserLink } from "../../models/UserLinks";

export type UserLinkFilters = Partial<
  Pick<UserLink, "id" | "user_id" | "platform">
>;
export type NewUserLink = Omit<UserLink, "id">;

export interface UserLinkRepository {
  save(newUserLink: NewUserLink): Promise<UserLink>;
  search(filters: UserLinkFilters): Promise<UserLink[]>;
  update(id: number, newUser: Partial<NewUserLink>): Promise<UserLink>;
  delete(id: number): Promise<boolean>;
}

import { NotFoundError } from "@/core/types/application-errors";
import { UserRepository } from "../../interfaces/users/repository";
import { UserDrizzleRepository } from "../repositories/user.repository";
import { UserValidator } from "../validators/user.validator";
import { User } from "../../models/User";
import { UserLinkRepository } from "../../interfaces/user-links/repository";
import { UserLinksDrizzleRepository } from "../repositories/user-links.repository";
import { UserLink } from "../../models/UserLinks";
import { logger } from "@/index";

export interface SearchUserByUsernameResult
  extends Omit<User, "password_hash" | "user_id"> {
  links: Partial<UserLink>[];
}
export class SearchUserByUsername {
  constructor(
    private readonly _logger = logger,
    private readonly validator = new UserValidator(),
    private readonly userRepo: UserRepository = new UserDrizzleRepository(),
    private readonly userLinkRepo: UserLinkRepository = new UserLinksDrizzleRepository(),
  ) {}

  async execute(username: string): Promise<SearchUserByUsernameResult> {
    this.validator.validate({ username });

    const user = await this.userRepo.findOne({ username });

    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }
    logger.debug("SEARCH BY USERNAME UC", "user: ", user);
    const userLinks = await this.userLinkRepo.search({ user_id: user.user_id });
    const cleanLinks = userLinks.map((l) => {
      const { id, user_id, ...rest } = l;
      return rest;
    });
    const { password_hash, user_id, ...rest } = user;

    return { links: cleanLinks, ...rest };
  }
}

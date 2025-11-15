import { NotFoundError } from "@/core/types/application-errors";
import { UserRepository } from "../../interfaces/users/repository";
import { UserDrizzleRepository } from "../repositories/user.repository";
import { UserValidator } from "../validators/user.validator";
import { User } from "../../models/User";

export class SearchUserByUsername {
  constructor(
    private readonly validator = new UserValidator(),
    private readonly userRepo: UserRepository = new UserDrizzleRepository(),
  ) {}

  async execute(
    username: string,
  ): Promise<Omit<User, "password_hash" | "user_id">> {
    this.validator.validate({ username });

    const user = await this.userRepo.findOne({ username });

    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    const { password_hash, user_id, ...rest } = user;

    return rest;
  }
}

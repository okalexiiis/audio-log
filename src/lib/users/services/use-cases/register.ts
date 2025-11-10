import { registerUserDTO } from "../../interfaces/users/dtos/register-user.dto";
import { UserRepository } from "../../interfaces/users/repository";
import { User } from "../../models/User";
import { UserDrizzleRepository } from "../repositories/user.repository";
import { UserValidator } from "../validators/user.validator";

export class RegisterUser {
  constructor(
    private readonly validator = new UserValidator(),
    private readonly userRepo: UserRepository = new UserDrizzleRepository(),
  ) {}

  public async execute({
    email,
    password,
    username,
  }: registerUserDTO): Promise<Omit<User, "password_hash" | "user_id">> {
    // Validation
    this.validator.validate({ email, username, password_hash: password });

    const password_hashed = await Bun.password.hash(password);

    const { password_hash, user_id, ...rest } = await this.userRepo.save({
      email,
      username,
      password_hash: password_hashed,
    });

    return rest;
  }
}

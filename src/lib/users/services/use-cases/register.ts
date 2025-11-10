import { registerUserDTO } from "../../interfaces/users/dtos/register-user.dto";
import { UserRepository } from "../../interfaces/users/repository";
import { User } from "../../models/User";
import { UserDrizzleRepository } from "../repositories/user.repository";

export class RegisterUser {
  constructor(
    private readonly userRepo: UserRepository = new UserDrizzleRepository(),
  ) {}

  public async execute({
    email,
    password,
    username,
  }: registerUserDTO): Promise<Omit<User, "password_hash" | "user_id">> {
    try {
      const password_hashed = await Bun.password.hash(password);
      const { password_hash, user_id, ...rest } = await this.userRepo.save({
        email,
        username,
        password_hash: password_hashed,
      });

      return rest;
    } catch (err: unknown) {
      throw err;
    }
  }
}

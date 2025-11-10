import { Prettify } from "@/core/types/prettify";
import { NewUser } from "../repository";

export type registerUserDTO = Prettify<
  Omit<NewUser, "password_hash"> & {
    password: string;
  }
>;

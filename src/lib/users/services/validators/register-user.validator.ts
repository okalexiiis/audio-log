import { Validator } from "@/core/utils/validator";

export class UserValidator {
  public email(value: string) {
    if (Validator.isNullOrEmpty(value)) {
      // Error 400 campo vacio
      throw new Error();
    }

    if (!Validator.isString(value)) {
      // Error 400 email has to be a string
      throw new Error();
    }

    if (!Validator.hasLengthBetween(value, 15, 255)) {
      // Error email need to have a length between 15 chars and 255 chars
      throw new Error();
    }

    if (!Validator.isEmail(value)) {
      // Error 400 email has to be a email
      throw new Error();
    }
  }

  public username(value: string) {
    if (Validator.isNullOrEmpty(value)) {
      // Error 400 campo vacio
      throw new Error();
    }

    if (!Validator.isString(value)) {
      // Error 400 email has to be a string
      throw new Error();
    }

    const usernameRegex =
      /^(?=[a-zA-Z0-9]|[^\w\s()+=\\'"?/><,#^&*!~`|\\-])(?:[a-zA-Z0-9]|[^\w\s()+=\\'"?/><,#^&*!~`|\\-](?![^\w\s()+=\\'"?/><,#^&*!~`|\\-]))+$/;
    value = value.trim();

    if (!Validator.hasLengthBetween(value, 5, 26)) {
      // Error email need to have a length between 5 chars and 25 chars
      throw new Error();
    }

    if (!Validator.matchesRegex(value, usernameRegex)) {
      // Error username doesnt match the regex for an username
      throw new Error();
    }
  }
}

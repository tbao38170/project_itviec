import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

/**
 * Custom decorator to validate strong passwords.
 * A strong password must:
 * - Be at least 12 characters long.
 * - Contain at least one uppercase letter.
 * - Contain at least one lowercase letter.
 * - Contain at least one numeric digit.
 * - Contain at least one special character.
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsStrongPassword",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") {
            return false;
          }
          const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
          return strongPasswordRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          // Return a plain string only
          return "Password must be at least 12 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
        },
      },
    });
  };
}

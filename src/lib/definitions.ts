import * as z from "zod/v4";

export const SignupFormSchema = z
  .object({
    email: z.email().trim(),
    name: z
      .string()
      .refine(
        (val) => val.split(" ").length >= 2,
        "Include first and last name",
      )
      .trim(),
    password: z
      .string()
      .min(8, "At least 8 characters long")
      .regex(/[a-zA-Z]/, "Contain at least one letter.")
      .regex(/[0-9]/, "Contain at least one number.")
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormState =
  | {
      errors?: {
        email?: string[];
        name?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;

export const LoginFormSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(1, "Invalid password").trim(),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const LoginAuthCodes = {
  email_not_confirmed: "Check your email to confirm account",
  invalid_credentials: "Invalid login credentials",
};

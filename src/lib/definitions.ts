import { events } from "@/app/data";
import { unauthorized } from "next/navigation";
import * as z from "zod/v4";

const password = z
  .string()
  .min(8, "At least 8 characters long")
  .max(256, "At most 256 characters long")
  .trim();

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
    password,
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
  email_not_confirmed: "Check your email to confirm this account.",
  invalid_credentials: "Invalid login credentials.",
  same_password: "Use a new password.",
  over_email_send_rate:
    "Too many emails sent to this address, please wait a while before trying again.",
  over_request_rate_limit:
    "Too many requests from this client, please wait a while before trying again.",
  email_address_invalid: "Use a different email address.",
};

export const isLoginAuthCode = (
  code: any,
): code is keyof typeof LoginAuthCodes => {
  return code in LoginAuthCodes;
};

export const LoginMessages = {
  check_email: {
    error: false,
    title: "Check your email",
    description:
      "We just sent you a confirmation email. Click the link inside it to activate your account.",
  },
  oauth_failed: {
    error: true,
    title: "Something went wrong",
    description:
      "Something went wrong while signing in with Google OAuth. Please try again.",
  },
  unauthorized: {
    error: true,
    title: "Unauthorized access",
    description:
      "You weren't authorized to access this resource. Please log in.",
  },
};

export const isLoginMessageKey = (
  key: string,
): key is keyof typeof LoginMessages => {
  return key in LoginMessages;
};

const noEmptyGaps = (arr: string[]) => {
  let foundEmpty = false;
  for (const val of arr) {
    if (val === "") {
      foundEmpty = true;
    } else if (foundEmpty) {
      return false;
    }
  }
  return true;
};

export const VolunteerProfileSchema = z.object({
  education: z.string().min(1, "Education cannot be empty"),
  bio: z.string().min(1, "Bio cannot be empty"),
  experience: z.string().min(1, "Experience cannot be empty"),
  eventsB: z
    .array(z.string().refine((val) => val === "" || events.B.includes(val)))
    .length(4)
    .refine(noEmptyGaps, {
      message: "Empty slots must come after all selected events",
    }),
  eventsC: z
    .array(z.string().refine((val) => val === "" || events.C.includes(val)))
    .length(4)
    .refine(noEmptyGaps, {
      message: "Empty slots must come after all selected events",
    }),
});

export const EmailSchema = z.object({
  email: z.email().trim(),
});

export type EmailState =
  | { errors?: { email?: string[] }; message?: string }
  | undefined;

export const UpdatePasswordSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UpdatePasswordState =
  | {
      errors?: { password?: string[]; confirmPassword?: string[] };
      message?: string;
    }
  | undefined;

export const UpdateSettingsSchema = z.object({
  email: z.email().trim(),
  name: z
    .string()
    .refine((val) => val.split(" ").length >= 2, "Include first and last name")
    .trim(),
});

export type UpdateSettingsState =
  | {
      errors?: { email?: string[]; name?: string[] };
      message?: string;
      success?: boolean;
    }
  | undefined;

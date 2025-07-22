import { events, usStates } from "@/app/data";
import * as z from "zod/v4";
import { AppError } from "./errors";

export type Result<T> = { data?: T; error?: AppError };

const password = z
  .string()
  .min(8, "At least 8 characters long")
  .max(256, "At most 256 characters long")
  .trim();

export const SignupFormSchema = z
  .object({
    email: z.email().trim(),
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

const noDuplicatesIgnoringEmpty = (arr: string[]) => {
  const seen = new Set();
  for (const str of arr) {
    if (str === "") continue;
    if (seen.has(str)) return false;
    seen.add(str);
  }
  return true;
};

export const EventPreferences = z
  .array(
    z
      .string()
      .refine(
        (val) => val === "" || events.B.includes(val) || events.C.includes(val),
      )
      .trim(),
  )
  .length(4)
  .refine(noEmptyGaps, {
    message: "Empty slots must come after all selected events",
  })
  .refine(noDuplicatesIgnoringEmpty, {
    message: "Duplicates are not allowed",
  });
export const EventPreferencesB = z
  .array(
    z
      .string()
      .refine((val) => val === "" || events.B.includes(val))
      .trim(),
  )
  .length(4)
  .refine(noEmptyGaps, {
    message: "Empty slots must come after all selected events",
  })
  .refine(noDuplicatesIgnoringEmpty, {
    message: "Duplicates are not allowed",
  });
export const EventPreferencesC = z
  .array(
    z
      .string()
      .refine((val) => val === "" || events.C.includes(val))
      .trim(),
  )
  .length(4)
  .refine(noEmptyGaps, {
    message: "Empty slots must come after all selected events",
  })
  .refine(noDuplicatesIgnoringEmpty, {
    message: "Duplicates are not allowed",
  });
export const VolunteerProfileSchema = z.object({
  name: z
    .string()
    .refine((val) => val.split(" ").length >= 2, "Include first and last name")
    .trim(),
  education: z.string().min(1, "Education cannot be empty").trim(),
  bio: z.string().min(1, "Bio cannot be empty").trim(),
  experience: z.string().min(1, "Experience cannot be empty").trim(),
  preferencesB: EventPreferencesB,
  preferencesC: EventPreferencesC,
});

export type UpdateProfileState =
  | {
      errors?: {
        name?: string[];
        education?: string[];
        bio?: string[];
        experience?: string[];
        preferencesB?: string[];
        preferencesC?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

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

export const EditTournamentSchemaBase = z.object({
  imageUrl: z.url("Invalid image"),
  websiteUrl: z.url(),
  name: z.string().min(1, "Required field").trim(),
  location: z
    .string()
    .refine((value) => value === "Online" || usStates.includes(value), {
      message: "Required field",
    }),
  division: z.enum(["B", "C"], "Choose a division"),
  closedEarly: z.boolean(),
  applicationFields: z
    .array(
      z.object({
        prompt: z.string().trim(),
        type: z.enum(["short", "long"]),
        id: z.uuid({ version: "v4" }),
      }),
    )
    .refine(
      (val) => !val.find((field) => !field.prompt),
      "Application fields cannot be empty",
    ),
});

export const EditTournamentSchemaClient = EditTournamentSchemaBase.extend({
  startDate: z.date("Required field"),
  endDate: z.date("Required field"),
  applyDeadlineDate: z.date("Required field"),
  applyDeadlineTime: z.iso.time({ precision: -1 }),
})
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })
  .refine((data) => data.applyDeadlineDate <= data.startDate, {
    message: "Application deadline must be on or before start date",
    path: ["applyDate"],
  });

export const EditTournamentSchemaServer = EditTournamentSchemaBase.extend({
  id: z.uuid({ version: "v4" }).optional(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  applyDeadline: z.iso.datetime({ offset: true }),
  approved: z.boolean().optional(),
})
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })
  .refine((data) => data.applyDeadline.substring(0, 10) <= data.startDate, {
    message: "Application deadline must be on or before start date",
    path: ["applyDate"],
  });

export type EditTournamentServerState =
  | {
      error?: {
        imageUrl?: string[];
        websiteUrl?: string[];
        name?: string[];
        location?: string[];
        division?: string[];
        startDate?: string[];
        endDate?: string[];
        applyDeadline?: string[];
        closedEarly?: string[];
        approved?: string[];
        id?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export const TournamentApplicationInfoSchema = EditTournamentSchemaServer.omit({
  closedEarly: true,
  approved: true,
}).extend({ id: z.uuid({ version: "v4" }) });

export const InsertTournamentApplicationSchema = z.object({
  tournamentId: z.uuid({ version: "v4" }),
  mode: z.enum(["save", "submit"]),
  preferences: z
    .array(
      z
        .string()
        .refine(
          (val) =>
            val === "" || events.B.includes(val) || events.C.includes(val),
        )
        .trim(),
    )
    .length(4)
    .refine(noEmptyGaps, {
      message: "Empty slots must come after all selected events",
    })
    .refine(noDuplicatesIgnoringEmpty, {
      message: "Duplicates are not allowed",
    })
    .refine((data) => data[0], { message: "You must select at least 1 event" }),
  responses: z.array(
    z.object({
      fieldId: z.uuid({ version: "v4" }),
      response: z.string().min(1, "Field required, otherwise put N/A").trim(),
    }),
  ),
});

export type InsertTournamentApplicationState =
  | {
      errors?: {
        mode?: string[];
        tournamentId?: string[];
        preferences?: string[];
        responses?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

// used for passing tournameent info from server action to the search tournaments table
export const TournamentCardInfo = TournamentApplicationInfoSchema.omit({
  applicationFields: true,
}).extend({
  slug: z.string(),
});
export const TournamentCards = z.array(TournamentCardInfo);

// used for passing tournament info from the search tournaments table to the tournament apply card
export const TournamentCardDisplay = TournamentCardInfo.omit({
  startDate: true,
  endDate: true,
  applyDeadline: true,
}).extend({
  startDate: z.date(),
  endDate: z.date(),
  applyDeadline: z.date(),
});

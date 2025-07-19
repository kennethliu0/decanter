import {
  AuthApiError,
  isAuthApiError,
  PostgrestError,
} from "@supabase/supabase-js";
import { ZodError } from "zod/v4";

export enum ERROR_CODES {
  INVALID_INPUT = "INVALID_INPUT",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  INVALID_REFERENCE = "INVALID_REFERENCE",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  ALREADY_SUBMITTED = "ALREADY_SUBMITTED",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN = "UNKNOWN",
  EMAIL_NOT_CONFIRMED = "EMAIL_NOT_CONFIRMED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  SAME_PASSWORD = "SAME_PASSWORD",
  OVER_EMAIL_SEND_RATE = "OVER_EMAIL_SEND_RATE",
  OVER_REQUEST_RATE_LIMIT = "OVER_REQUEST_RATE_LIMIT",
  EMAIL_ADDRESS_INVALID = "EMAIL_ADDRESS_INVALID",
  AUTH_ERROR = "AUTH_ERROR",
}

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type AppError = {
  code: ERROR_CODES;
  message: string;
  status?: number;
  name?: string;
  meta?: Record<string, any>;
};

export function isAppError(obj: unknown): obj is AppError {
  return (
    typeof obj === "object"
    && obj !== null
    && "code" in obj
    && typeof (obj as any).code === "string"
    && Object.values(ERROR_CODES).includes((obj as any).code)
    && "message" in obj
    && typeof (obj as any).message === "string"
  );
}

export function toAppError(err: unknown): AppError {
  if (isAppError(err)) return err;

  if (err instanceof ZodError) {
    return {
      message: "Invalid input.",
      code: ERROR_CODES.INVALID_INPUT,
      status: 400,
      meta: {
        issues: err.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
    };
  }

  if (err instanceof PostgrestError) {
    return convertPostgrestError(err);
  }

  if (err instanceof Error) {
    // return new AppError(err.message, ERROR_CODES.UNKNOWN, 500);
  }
  return {
    message: "An unknown error occurred.",
    code: ERROR_CODES.UNKNOWN,
    status: 500,
  };
}

function convertPostgrestError(err: PostgrestError): AppError {
  if (isAuthApiError(err)) {
    return convertAuthApiError(err);
  }
  switch (err.code) {
    case "23505": // unique_violation
      return {
        message: "That record already exists.",
        code: ERROR_CODES.ALREADY_EXISTS,
        status: 409,
        name: "PostgrestError",
      };
    case "23503": // foreign_key_violation
      return {
        message: "Referenced record not found.",
        code: ERROR_CODES.INVALID_REFERENCE,
        status: 400,
        name: "PostgrestError",
      };
    case "23502": // not_null_violation
      return {
        message: "A required field was missing.",
        code: ERROR_CODES.INVALID_INPUT,
        status: 400,
        name: "PostgrestError",
      };
    default:
      return {
        message: "A database error occurred.",
        code: ERROR_CODES.SERVER_ERROR,
        status: 500,
        name: "PostgrestError",
        meta: {
          code: err.code,
          details: err.details,
          hint: err.hint,
        },
      };
  }
}

function convertAuthApiError(err: AuthApiError): AppError {
  switch (err.code) {
    case "email_not_confirmed":
      return {
        message: "Check your email to confirm this account.",
        code: ERROR_CODES.EMAIL_NOT_CONFIRMED,
        status: 401,
        name: "AuthApiError",
      };

    case "invalid_login_credentials":
      return {
        message: "Invalid login credentials.",
        code: ERROR_CODES.INVALID_CREDENTIALS,
        status: 401,
        name: "AuthApiError",
      };

    case "same_password":
      return {
        message: "Use a new password.",
        code: ERROR_CODES.SAME_PASSWORD,
        status: 400,
        name: "AuthApiError",
      };

    case "over_email_send_rate":
      return {
        message:
          "Too many emails sent to this address, please wait a while before trying again.",
        code: ERROR_CODES.OVER_EMAIL_SEND_RATE,
        status: 429,
        name: "AuthApiError",
      };

    case "over_request_rate_limit":
      return {
        message:
          "Too many requests from this client, please wait a while before trying again.",
        code: ERROR_CODES.OVER_REQUEST_RATE_LIMIT,
        status: 429,
        name: "AuthApiError",
      };

    case "email_address_invalid":
      return {
        message: "Use a different email address.",
        code: ERROR_CODES.EMAIL_ADDRESS_INVALID,
        status: 400,
        name: "AuthApiError",
      };

    default:
      return {
        message: err.message || "Authentication failed.",
        code: ERROR_CODES.AUTH_ERROR,
        status: err.status ?? 400,
        name: "AuthApiError",
        meta: { code: err.code },
      };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import {
  LoginAuthCodes,
  LoginFormSchema,
  LoginFormState,
  EmailSchema,
  SignupFormSchema,
  SignupFormState,
  UpdatePasswordSchema,
  UpdatePasswordState,
  EmailState,
  isLoginAuthCode,
} from "@/lib/definitions";
import z from "zod/v4";
import { isAuthApiError } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function login(
  state: LoginFormState,
  formData: z.infer<typeof LoginFormSchema>,
) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.email,
    password: formData.password,
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  if (error) {
    if (isAuthApiError(error) && isLoginAuthCode(error.code)) {
      return { message: LoginAuthCodes[error.code] };
    } else {
      console.error("Login error", {
        message: error?.message,
        code: error?.code,
        name: error?.name,
      });
      return { message: "An error occurred while signing in." };
    }
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    if (isAuthApiError(error) && isLoginAuthCode(error.code)) {
      return { message: LoginAuthCodes[error.code] };
    } else {
      console.error("Log out error", {
        message: error?.message,
        code: error?.code,
        name: error?.name,
      });
      return { message: "An error occurred while logging out." };
    }
  }
  revalidatePath("/login", "layout");
  redirect("/login");
}

export async function signup(
  state: SignupFormState,
  formData: z.infer<typeof SignupFormSchema>,
) {
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });
  if (error) {
    if (isAuthApiError(error) && isLoginAuthCode(error.code)) {
      return { message: LoginAuthCodes[error.code] };
    } else {
      console.error("Signup error", {
        message: error?.message,
        code: error?.code,
        name: error?.name,
      });
      return {
        message:
          "An error occurred. If you already have an account, try logging in instead.",
      };
    }
  }
  revalidatePath("/login", "layout");
  redirect("/login?message=check_email");
}

export async function resetPasswordEmail(
  formState: EmailState,
  formData: z.infer<typeof EmailSchema>,
) {
  const validatedFields = EmailSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const email = validatedFields.data.email;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    if (isAuthApiError(error) && isLoginAuthCode(error.code)) {
      return { message: LoginAuthCodes[error.code] };
    } else {
      console.error("Reset password error", {
        message: error?.message,
        code: error?.code,
        name: error?.name,
      });
      return { message: "An error occurred while resetting your password." };
    }
  }

  // Return a success message or redirect
  return {
    message:
      "If an account with that email exists, we've sent a password reset link.",
  };
}

export async function updatePassword(
  formState: UpdatePasswordState,
  formData: z.infer<typeof UpdatePasswordSchema>,
) {
  const validatedFields = UpdatePasswordSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const password = validatedFields.data.password;
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/login");
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (isAuthApiError(error) && isLoginAuthCode(error.code)) {
      return { message: LoginAuthCodes[error.code] };
    } else {
      console.error("Update password", {
        message: error?.message,
        code: error?.code,
        name: error?.name,
      });
      return { message: "An error occurred while updating your password." };
    }
  }
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function signInWithGoogleAction() {
  const supabase = await createClient();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin"); // e.g., 'http://localhost:3000' or 'https://your-site.com'

  const allowedOrigins = ["http://localhost:3000"];
  if (!origin || !allowedOrigins.includes(origin)) {
    console.error("Untrusted origin:", origin);
    return redirect("/login");
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Dynamically set the callback URL based on the request origin
      redirectTo: `${origin}/auth/callback?next=%2Fdashboard`,
    },
  });
  if (error) {
    console.error("Error signing in with Google:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
    });
    return redirect("/login?message=oauth_failed");
  }

  if (data.url) {
    // Redirect the browser to the Google auth page
    return redirect(data.url);
  } else {
    console.error("signInWithOAuth did not return a URL");
    return redirect("/login?message=oauth_failed");
  }
}

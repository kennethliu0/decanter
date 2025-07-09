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

  const isLoginAuthCode = (code: any): code is keyof typeof LoginAuthCodes => {
    return code in LoginAuthCodes;
  };

  if (error) {
    console.log(error?.message);
    if (isAuthApiError(error) && error.code && isLoginAuthCode(error.code)) {
      return { message: LoginAuthCodes[error.code] };
    } else {
      return { message: "An error occurred while signing in." };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    return { message: "An error occurred while logging out." };
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
    name: formData.name,
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
    options: {
      data: { display_name: validatedFields.data.name },
    },
  });
  if (error) {
    console.log(error);
    return {
      message:
        "Something went wrong. If you already have an account, try logging in instead.",
    };
  }
  revalidatePath("/login", "layout");
  redirect("/login?message=check-email");
}

export async function resetPassword(
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
    return { message: "An error occurred while resetting your password." };
  }
}

export async function updatePassword(
  formState: UpdatePasswordState,
  formData: z.infer<typeof UpdatePasswordSchema>,
) {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay for the action
  const validatedFields = UpdatePasswordSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const password = validatedFields.data.password;
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (!user || sessionError) {
    return { message: "User not authenticated" };
  }
  const { error } = await supabase.auth.updateUser({ password });
  console.log(error?.code);
  if (error) {
    return { message: "An error occurred while updating your password." };
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogleAction() {
  const supabase = await createClient();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin"); // e.g., 'http://localhost:3000' or 'https://your-site.com'

  if (!origin) {
    console.error("Missing origin header");
    return redirect("/login?error=OriginMissing"); // Or your login page
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Dynamically set the callback URL based on the request origin
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    return redirect(`/login?error=OAuthSigninFailed&message`);
  }

  if (data.url) {
    // Redirect the browser to the Google auth page
    return redirect(data.url);
  } else {
    console.error("signInWithOAuth did not return a URL");
    return redirect("/login?error=OAuthConfigurationError");
  }
}

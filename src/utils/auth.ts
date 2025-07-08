"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import {
  LoginAuthCodes,
  LoginFormSchema,
  LoginFormState,
  SignupFormSchema,
  SignupFormState,
} from "@/lib/definitions";
import z from "zod/v4";
import { isAuthApiError } from "@supabase/supabase-js";

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
    return { message: "An error occurred while creating your account." };
  }
  revalidatePath("/login", "layout");
  redirect("/login");
}

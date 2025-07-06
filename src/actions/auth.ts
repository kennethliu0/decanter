"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SignupFormSchema, SignupFormState } from "@/lib/definitions";
import z from "zod/v4";

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email as string,
    password: formData.password as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  console.log(error);
  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  state: SignupFormState,
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
  },
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
  console.log(error);
  if (error) {
    return { message: "An error occurred while creating your account." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

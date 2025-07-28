"use server";

import { upsertProfile } from "@/dal/profile";
import { VolunteerProfileSchema, UpdateProfileState } from "@/lib/definitions";
import { ERROR_CODES } from "@/lib/errors";
import { redirect } from "next/navigation";
import { infer as zodInfer, flattenError } from "zod/v4";

export async function upsertProfileAction(
  formState: UpdateProfileState,
  formData: zodInfer<typeof VolunteerProfileSchema>,
) {
  const validatedFields = VolunteerProfileSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { error } = await upsertProfile(validatedFields.data);
  if (error) {
    if (error.code === ERROR_CODES.AUTH_ERROR) {
      redirect("/login");
    } else {
      return { message: error.message, success: false };
    }
  }
  return { success: true };
}

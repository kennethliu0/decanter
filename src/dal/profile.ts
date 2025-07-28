import "server-only";

import {
  EventPreferencesB,
  EventPreferencesC,
  Result,
  VolunteerProfileSchema,
} from "@/lib/definitions";
import { AppAuthError, AppError, ERROR_CODES, toAppError } from "@/lib/errors";
import { createClient } from "@/utils/supabase/server";
import { infer as zodInfer } from "zod/v4";

export async function upsertProfile(
  profile: zodInfer<typeof VolunteerProfileSchema>,
): Promise<{ error?: AppError }> {
  const validatedFields = VolunteerProfileSchema.safeParse(profile);
  if (!validatedFields.success) {
    return { error: toAppError(validatedFields.error) };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }

  const { error } = await supabase.from("volunteer_profiles").upsert({
    id: authData.claims.sub,
    email: authData.claims.email,
    name: validatedFields.data.name,
    education: validatedFields.data.education,
    bio: validatedFields.data.bio,
    experience: validatedFields.data.experience,
    preferences_b: validatedFields.data.preferencesB,
    preferences_c: validatedFields.data.preferencesC,
  });

  if (error) {
    return { error: toAppError(error) };
  }
  return {};
}

export async function getProfile(): Promise<
  Result<{ profile: zodInfer<typeof VolunteerProfileSchema> }>
> {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }
  const { data, error } = await supabase
    .from("volunteer_profiles")
    .select("name, education, bio, experience, preferences_b, preferences_c")
    .eq("id", authData.claims.sub)
    .maybeSingle();

  if (error) {
    console.error(error);
    return { error: toAppError(error) };
  }
  if (!data) {
    return {};
  }
  const { name, education, bio, experience } = data;
  const validatedFields = VolunteerProfileSchema.safeParse({
    name,
    education,
    bio,
    experience,
    preferencesB: data.preferences_b,
    preferencesC: data.preferences_c,
  });
  if (!validatedFields.success) {
    return { error: toAppError(validatedFields.error) };
  } else {
    return { data: { profile: validatedFields.data } };
  }
}

export async function getEventPreferences(): Promise<
  Result<{ preferencesB: string[]; preferencesC: string[] }>
> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }
  const { data, error } = await supabase
    .from("volunteer_profiles")
    .select("preferences_b, preferences_c")
    .eq("id", authData.claims.sub)
    .maybeSingle();

  if (error) {
    console.error(error);
    return { error: toAppError(error) };
  }
  if (!data?.preferences_b || !data?.preferences_c) {
    return {
      error: {
        message: "Please create a volunteer profile before applying.",
        code: ERROR_CODES.VOLUNTEER_PROFILE_NOT_FOUND,
        status: 404,
      },
    };
  }
  const validatedB = EventPreferencesB.safeParse(data.preferences_b);
  const validatedC = EventPreferencesC.safeParse(data.preferences_c);

  if (!validatedB.success || !validatedC.success) {
    console.error(validatedB.error || validatedC.error);
    return {
      error: {
        message: "Invalid output from database.",
        code: ERROR_CODES.INVALID_REFERENCE,
        status: 400,
      },
    };
  }

  return {
    data: { preferencesB: validatedB.data, preferencesC: validatedC.data },
  };
}

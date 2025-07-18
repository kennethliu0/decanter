"use server";

import {
  VolunteerProfileSchema,
  UpdateProfileState,
  EventPreferences,
  EventPreferencesB,
  EventPreferencesC,
} from "@/lib/definitions";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod/v4";

export async function getProfile() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("volunteer_profiles")
    .select("name, education, bio, experience, preferences_b, preferences_c")
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Failed to load profile");
  }
  if (!data) {
    return undefined;
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
    return undefined;
  } else {
    return validatedFields.data;
  }
}

export async function upsertProfile(
  formState: UpdateProfileState,
  formData: z.infer<typeof VolunteerProfileSchema>,
) {
  const validatedFields = VolunteerProfileSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user?.id || !user?.email || userError) {
    console.error(userError);
    return { message: "Unauthenticated", success: false };
  }

  const { error } = await supabase.from("volunteer_profiles").upsert({
    id: user.id,
    email: user.email,
    name: validatedFields.data.name,
    education: validatedFields.data.education,
    bio: validatedFields.data.bio,
    experience: validatedFields.data.experience,
    preferences_b: validatedFields.data.preferencesB,
    preferences_c: validatedFields.data.preferencesC,
  });
  if (error) {
    console.error(error);
  }
  return { success: !error };
}

export async function getEventPreferences(): Promise<{
  data?: { preferencesB: string[]; preferencesC: string[] };
  error?: Error;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user?.id || authError) {
    return { error: new Error("Unauthenticated") };
  }

  const { data, error } = await supabase
    .from("volunteer_profiles")
    .select("preferences_b, preferences_c")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data?.preferences_b || !data?.preferences_c) {
    return { error: new Error("Couldn't locate profile or preferences") };
  }
  const validatedB = EventPreferencesB.safeParse(data.preferences_b);
  const validatedC = EventPreferencesC.safeParse(data.preferences_c);

  if (!validatedB.success || !validatedC.success) {
    return { error: new Error("Returned events could not be validated") };
  }

  return {
    data: { preferencesB: validatedB.data, preferencesC: validatedC.data },
  };
}

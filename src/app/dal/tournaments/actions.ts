"use server";

import {
  EditTournamentSchemaServer,
  EditTournamentServerState,
  InsertTournamentApplicationState,
  TournamentApplicationInfoSchema,
  InsertTournamentApplicationSchema,
  Result,
} from "@/lib/definitions";
import z, { ZodError } from "zod/v4";
import { createClient } from "../../../utils/supabase/server";
import { v4 as uuidv4, validate } from "uuid";
import { toCamel, toSnake } from "@/lib/utils";
import { redirect } from "next/navigation";
import { events, seasonYear } from "@/app/data";
import { ERROR_CODES, toAppError } from "@/lib/errors";
const slugify = require("slugify");

export async function upsertTournament(
  formState: EditTournamentServerState,
  formData: z.infer<typeof EditTournamentSchemaServer>,
) {
  const validatedFields = EditTournamentSchemaServer.safeParse(formData);
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      success: false,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user?.id || userError) {
    console.error(userError);
    return { message: "Unauthenticated", success: false };
  }
  // dont allow user to update approved and check id to see if a new tournament
  // should be created
  let { id, approved, ...values } = validatedFields.data;
  const newTournament = !id;
  let created_by = null,
    slug = null;
  if (!id) {
    id = uuidv4();
    created_by = user.id;
    slug = slugify(
      `${values.name.substring(0, 15)}-div${values.division}-${seasonYear}-${id.substring(0, 8)}`,
      {
        lower: true,
        strict: true,
        trim: true,
      },
    );
  } else {
    const { data, error } = await supabase
      .from("tournament_admins")
      .select("tournament_id")
      .eq("tournament_id", id)
      .eq("user_id", id);
    if (error || !data) {
      return {
        message: "Unauthorized or tournament does not exist",
        success: false,
      };
    }
  }

  const { error } = await supabase.from("tournaments").upsert({
    id,
    ...toSnake({ ...values }),
    ...(created_by ? { created_by } : {}),
    ...(slug ? { slug } : {}),
  });
  if (error) {
    console.error(error);
    return { message: "Error updating database", success: false };
  }
  if (newTournament) {
    const { error } = await supabase.from("tournament_admins").insert({
      tournament_id: id,
      user_id: user.id,
    });
    if (error) {
      console.error(error);
      return {
        message: "Error setting admin privileges, contact Decanter support",
        success: false,
      };
    }
    redirect(`/tournaments/manage/${slug}`);
  }
  return { success: true };
}

export async function getTournamentManagementFromSlug(
  slug: string,
): Promise<z.infer<typeof EditTournamentSchemaServer> | { error: string }> {
  const validatedFields = z.string().safeParse(slug);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (!validatedFields.success) {
    redirect("/tournaments/manage/new");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select(
      "id, name, location, division, image_url, website_url, closed_early, start_date, end_date, apply_deadline, application_fields, approved",
    )
    .eq("slug", validatedFields.data)
    .maybeSingle();

  if (error || !data) {
    redirect("/tournaments/manage/new");
  }
  const validatedData = EditTournamentSchemaServer.safeParse(toCamel(data));
  if (!validatedData.success) {
    return { error: "Validation error on database results" };
  }
  return validatedData.data;
}

export async function getTournamentApplicationInfo(slug: string): Promise<{
  data?: z.infer<typeof TournamentApplicationInfoSchema>;
  error?: Error;
}> {
  const validatedFields = z.string().safeParse(slug);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (!validatedFields.success) {
    redirect("/tournaments/manage/new");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select(
      "id, name, location, division, image_url, website_url, start_date, end_date, apply_deadline, application_fields",
    )
    .eq("slug", validatedFields.data)
    .eq("closed_early", false)
    .eq("approved", true)
    .maybeSingle();

  if (error || !data) {
    return {
      error: new Error(
        "Tournament could not be found, or the application already closed",
      ),
    };
  }
  const validatedData = TournamentApplicationInfoSchema.safeParse(
    toCamel(data),
  );
  if (!validatedData.success) {
    return { error: new Error("Validation error on database results") };
  }
  return { data: validatedData.data };
}

export async function upsertTournamentApplication(
  formState: InsertTournamentApplicationState,
  formData: z.infer<typeof InsertTournamentApplicationSchema>,
) {
  const validatedFields = InsertTournamentApplicationSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      success: false,
    };
  }

  const { tournamentId, preferences, responses, mode } = validatedFields.data;

  const supabase = await createClient();

  // check that events are within the correct division
  const { data: divisionData, error: divisionError } = await supabase
    .from("tournaments")
    .select("division")
    .eq("id", tournamentId)
    .single();

  if (divisionError) {
    if (divisionError.code === "PGRST116") {
      return { message: "No such tournament found", success: false };
    } else {
      console.error(divisionError);
      return { message: "Error checking tournament", success: false };
    }
  }

  const division = z.enum(["B", "C"]).safeParse(divisionData.division);
  if (!division.success) {
    console.error("Division returned from database was not B or C");
    return { message: "Error checking tournament", success: false };
  }
  for (const event of preferences) {
    if (event !== "" && !events[division.data].includes(event)) {
      return {
        errors: { preferences: ["Event does not exist in this division"] },
        success: false,
      };
    }
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user?.id || !user?.email || authError) {
    console.error(authError);
    return { message: "Authentication failed", success: false };
  }
  // check if an application was submitted already
  const { data: existingData, error: existingError } = await supabase
    .from("tournament_applications")
    .select("submitted")
    .eq("tournament_id", tournamentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    console.error(existingError);
    return { message: "Error contacting database", success: false };
  }
  if (existingData?.submitted) {
    return {
      message: "You have already applied for this tournament",
      success: false,
    };
  }
  const { error } = await supabase.from("tournament_applications").upsert({
    user_id: user.id,
    email: user.email,
    tournament_id: tournamentId,
    preferences,
    responses,
    submitted: mode === "submit",
  });
  if (error) {
    console.error(error);
    return { message: "Something went wrong", success: false };
  }
  return { success: true };
}

export async function getSavedTournamentApplication(
  slugRaw: string,
): Promise<
  Result<{ application: z.infer<typeof InsertTournamentApplicationSchema> }>
> {
  const validatedData = z.string().safeParse(slugRaw);

  if (!validatedData.success) {
    return { error: toAppError(validatedData.error) };
  }

  const slug = validatedData.data;

  const supabase = await createClient();

  const { data: tournamentData, error: tournamentError } = await supabase
    .from("tournaments")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!tournamentData?.id || tournamentError) {
    return { error: toAppError(tournamentError) };
  }
  const validatedTournament = z
    .uuid({ version: "v4" })
    .safeParse(tournamentData.id);
  if (!validatedTournament.success) {
    return { error: toAppError(validatedTournament.error) };
  }
  const tournamentId = validatedTournament.data;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user?.id || authError) {
    return { error: toAppError(authError) };
  }

  const { data, error } = await supabase
    .from("tournament_applications")
    .select("preferences, responses, submitted")
    .eq("tournament_id", tournamentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return { error: toAppError(error) };
  }

  if (!data) {
    return {};
  }
  if (data.submitted) {
    return {
      error: {
        message: "Application already submitted",
        code: ERROR_CODES.ALREADY_SUBMITTED,
        status: 409,
      },
    };
  }

  const validatedApplication = InsertTournamentApplicationSchema.safeParse({
    mode: "save",
    preferences: data.preferences,
    responses: data.responses,
    tournamentId,
  });

  if (!validatedApplication.success) {
    console.error(validatedApplication.error);
    return { error: toAppError(validatedApplication.error) };
  }

  return {
    data: { application: validatedApplication.data },
  };
}

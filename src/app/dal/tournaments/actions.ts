"use server";

import {
  EditTournamentSchemaServer,
  EditTournamentServerState,
  InsertTournamentApplicationState,
  TournamentApplicationInfoSchema,
  InsertTournamentApplicationSchema,
} from "@/lib/definitions";
import z from "zod/v4";
import { createClient } from "../../../utils/supabase/server";
import { v4 as uuidv4, validate } from "uuid";
import { toCamel, toSnake } from "@/lib/utils";
import { redirect } from "next/navigation";
import { seasonYear } from "@/app/data";
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

export async function insertTournamentApplication(
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

  const { tournamentId, preferences, responses } = validatedFields.data;

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user?.id || !user?.email || authError) {
    console.error(authError);
    return { message: "Authentication failed", success: false };
  }
  const { error } = await supabase.from("tournament_applications").insert({
    user_id: user.id,
    email: user.email,
    tournament_id: tournamentId,
    preferences,
    responses,
  });
  if (error) {
    if (error.code === "23505") {
      return {
        message: "You have already applied for this tournament",
        success: false,
      };
    } else {
      console.error(error);
      return { message: "Something went wrong", success: false };
    }
  }
  return { success: true };
}

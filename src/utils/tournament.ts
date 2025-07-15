"use server";

import {
  EditTournamentSchemaServer,
  EditTournamentServerState,
} from "@/lib/definitions";
import z from "zod/v4";
import { createClient } from "./supabase/server";
import { v4 as uuidv4 } from "uuid";
import { toCamel, toSnake } from "@/lib/utils";

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
  let { id, ...values } = validatedFields.data;
  const newTournament = !id;
  let created_by = null;
  if (newTournament) {
    id = uuidv4();
    created_by = user.id;
  }
  console.log({
    id,
    ...toSnake({ ...values }),
    ...(created_by ? { created_by } : {}),
  });
  const { error } = await supabase.from("tournaments").upsert({
    id,
    ...toSnake({ ...values }),
    ...(created_by ? { created_by } : {}),
  });
  if (error) {
    return { message: "Something went wrong", success: false };
  }
  if (newTournament) {
    const { error } = await supabase.from("tournament_admins").insert({
      tournament_id: id,
      user_id: user.id,
    });
    if (error) {
      console.error(error);
      return { message: "Error setting admin privileges", success: false };
    }
  }
  return { success: true };
}

export async function getTournament(id: string) {
  const validatedFields = z.uuid({ version: "v4" }).safeParse(id);

  if (!validatedFields.success) {
    return { error: true, message: "Invalid id" };
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

  const { data, error } = await supabase
    .from("tournaments")
    .select(
      "name, location, division, image_url, website_url, closed_early, start_date, end_date, apply_deadline, application_fields",
    )
    .maybeSingle();

  if (error || !data) {
    console.error(error);
    return {
      message: "Error occurred while accessing database",
      success: false,
    };
  }
  console.log(toCamel(data));
  const validatedData = EditTournamentSchemaServer.safeParse(toCamel(data));
  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      success: false,
    };
  }
  return validatedData.data;
}

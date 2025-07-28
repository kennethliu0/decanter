"use server";

import {
  EditTournamentSchemaServer,
  EditTournamentServerState,
  InsertTournamentApplicationState,
  InsertTournamentApplicationSchema,
} from "@/lib/definitions";
import { infer as zodInfer, flattenError, enum as zodEnum } from "zod/v4";
import { notFound, redirect } from "next/navigation";
import { upsertTournament } from "@/dal/tournament-management";
import { ERROR_CODES } from "@/lib/errors";
import { upsertTournamentApplication } from "@/dal/tournament-application";

export async function upsertTournamentAction(
  formState: EditTournamentServerState,
  formData: zodInfer<typeof EditTournamentSchemaServer>,
) {
  const validatedFields = EditTournamentSchemaServer.safeParse(formData);
  if (!validatedFields.success) {
    return {
      errors: flattenError(validatedFields.error).fieldErrors,
      success: false,
    };
  }

  const { data, error } = await upsertTournament(validatedFields.data);
  if (error) {
    switch (error.code) {
      case ERROR_CODES.UNAUTHORIZED:
        redirect("/login");
      case ERROR_CODES.NOT_FOUND:
        notFound();
      default:
        return { message: error.message, success: false };
    }
  }
  // new tournaments need to be redirected
  if (data?.slug) {
    redirect(`/tournaments/manage/${data.slug}`);
  }

  return { success: true };
}

export async function upsertTournamentApplicationAction(
  formState: InsertTournamentApplicationState,
  formData: zodInfer<typeof InsertTournamentApplicationSchema>,
) {
  const validatedFields = InsertTournamentApplicationSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      errors: flattenError(validatedFields.error).fieldErrors,
      success: false,
    };
  }

  const { error } = await upsertTournamentApplication(validatedFields.data);
  if (error) {
    switch (error.code) {
      case ERROR_CODES.UNAUTHORIZED:
        redirect("/login");
      case ERROR_CODES.NOT_FOUND:
        notFound();
      default:
        return { message: error.message, success: false };
    }
  }
  return { success: true };
}

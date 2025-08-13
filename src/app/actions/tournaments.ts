"use server";

import {
  EditTournamentSchemaServer,
  EditTournamentServerState,
  InsertTournamentApplicationState,
  InsertTournamentApplicationSchema,
  AcceptTournamentInviteState,
} from "@/lib/definitions";
import { infer as zodInfer, flattenError, uuid as zodUuid } from "zod/v4";
import { notFound, redirect } from "next/navigation";
import {
  insertTournament,
  updateTournament,
} from "@/dal/tournament-management";
import { acceptTournamentInvite } from "@/dal/tournament-invites";
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

  if (validatedFields.data.id) {
    const { error } = await updateTournament(
      validatedFields.data.id,
      validatedFields.data,
    );
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
  } else {
    const { id, approved, ...tournament } = validatedFields.data;
    const { data, error } = await insertTournament(tournament);
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
    if (!data?.slug) {
      redirect("/tournaments");
    }
    redirect(`/tournaments/manage/${data.slug}`);
  }
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

export async function acceptTournamentInviteAction(
  formState: AcceptTournamentInviteState,
  inviteIdRaw: string,
) {
  const validatedFields = zodUuid({ version: "v4" }).safeParse(inviteIdRaw);
  if (!validatedFields.success) {
    notFound();
  }
  const { data, error } = await acceptTournamentInvite(validatedFields.data);
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
  if (data?.slug) {
    redirect(`/tournaments/manage/${data.slug}`);
  } else {
    redirect(`/tournaments`);
  }
}

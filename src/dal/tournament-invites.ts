import "server-only";
import { Result } from "@/lib/definitions";
import {
  AppAuthError,
  ERROR_CODES,
  toAppError,
  TournamentNotFoundError,
} from "@/lib/errors";
import { createClient } from "@/utils/supabase/server";
import { string as zodString, uuid as zodUuid } from "zod/v4";
import {
  acceptInvite,
  checkUserIsTournamentAdmin,
  getAdminEmails,
  getInviteId,
  getInviteInfo,
  getTournamentId,
} from "./tournament-invites-queries";

export async function getInviteManagement(
  slugRaw: string,
): Promise<Result<{ link: string; emails: string[] }>> {
  const validatedFields = zodString().safeParse(slugRaw);
  if (!validatedFields.success) {
    return { error: TournamentNotFoundError };
  }
  const slug = validatedFields.data;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (!authData?.claims || authError) {
    return { error: AppAuthError };
  }

  const { data: tournamentData, error: tournamentError } =
    await getTournamentId(slug);

  if (tournamentError) {
    return { error: toAppError(tournamentError) };
  }

  if (!tournamentData?.id) {
    return { error: TournamentNotFoundError };
  }
  const tournamentId = tournamentData.id;

  // check user authorization

  const { data: adminData, error: adminError } =
    await checkUserIsTournamentAdmin(authData.claims.sub, tournamentId);
  if (adminError || !adminData) {
    return {
      error: {
        message: "Unauthorized access",
        code: ERROR_CODES.UNAUTHORIZED,
        status: 401,
      },
    };
  }

  const { data: allAdminsData, error: allAdminsError } =
    await getAdminEmails(tournamentId);
  if (allAdminsError) {
    return { error: toAppError(allAdminsError) };
  }

  const emails = allAdminsData ? allAdminsData.map((val) => val.email) : [];

  const { data: inviteData, error: inviteError } =
    await getInviteId(tournamentId);

  if (inviteError) {
    return { error: toAppError(inviteError) };
  }
  const link =
    inviteData?.id ?
      `${process.env.NEXT_PUBLIC_SITE_URL!}/tournaments/invite/${inviteData.id}`
    : "Couldn't retrieve invite link";
  return { data: { link, emails } };
}

export async function getTournamentInviteInfo(inviteIdRaw: string): Promise<
  Result<{
    name: string;
    division: string;
    imageUrl: string;
  }>
> {
  const validatedFields = zodUuid({ version: "v4" }).safeParse(inviteIdRaw);
  if (!validatedFields.success) {
    return { error: TournamentNotFoundError };
  }
  const inviteId = validatedFields.data;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }

  const { data, error } = await getInviteInfo(inviteId);
  if (error) {
    if (error.code === "P0001") {
      // exception was raised by rpc
      if (error.message.startsWith(ERROR_CODES.UNAUTHORIZED)) {
        return { error: AppAuthError };
      } else if (error.message.startsWith(ERROR_CODES.NOT_FOUND)) {
        return { error: TournamentNotFoundError };
      } else {
        console.error(error);
        return {
          error: {
            message: "Unknown exception was raised",
            code: ERROR_CODES.UNKNOWN,
            status: 400,
          },
        };
      }
    } else {
      console.error(error);
      return { error: toAppError(error) };
    }
  }
  if (data[0]) {
    return {
      data: {
        name: data[0].name,
        division: data[0].division,
        imageUrl: data[0].image_url,
      },
    };
  } else {
    return { error: TournamentNotFoundError };
  }
}

export async function acceptTournamentInvite(
  inviteIdRaw: string,
): Promise<Result<{ slug: string }>> {
  const validatedFields = zodUuid({ version: "v4" }).safeParse(inviteIdRaw);
  if (!validatedFields.success) {
    return { error: TournamentNotFoundError };
  }
  const inviteId = validatedFields.data;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }

  const { data, error } = await acceptInvite(inviteId);
  if (error) {
    if (error.code === "P0001") {
      // exception was raised by rpc
      if (error.message.startsWith(ERROR_CODES.UNAUTHORIZED)) {
        return { error: AppAuthError };
      } else if (error.message.startsWith(ERROR_CODES.NOT_FOUND)) {
        return { error: TournamentNotFoundError };
      } else {
        console.error(error);
        return {
          error: {
            message: "Unknown exception was raised",
            code: ERROR_CODES.UNKNOWN,
            status: 400,
          },
        };
      }
    } else {
      console.error(error);
      return { error: toAppError(error) };
    }
  }
  if (!data) {
    return { error: TournamentNotFoundError };
  }
  return { data: { slug: data } };
}

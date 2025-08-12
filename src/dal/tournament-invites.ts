import "server-only";
import { Result } from "@/lib/definitions";
import {
  AppAuthError,
  ERROR_CODES,
  toAppError,
  TournamentNotFoundError,
} from "@/lib/errors";
import { createClient } from "@/utils/supabase/server";
import {
  string as zodString,
  uuid as zodUuid,
  infer as zodInfer,
} from "zod/v4";

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

  const { data: tournamentData, error: tournamentError } = await supabase
    .from("tournaments")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (tournamentError) {
    return { error: toAppError(tournamentError) };
  }

  if (!tournamentData?.id) {
    return { error: TournamentNotFoundError };
  }
  const tournamentId = tournamentData.id;

  // check user authorizaton

  const { data: adminData, error: adminError } = await supabase
    .from("tournament_admins")
    .select("user_id")
    .eq("user_id", authData.claims.sub)
    .eq("tournament_id", tournamentId)
    .single();

  if (adminError || !adminData) {
    return {
      error: {
        message: "Unauthorized access",
        code: ERROR_CODES.UNAUTHORIZED,
        status: 401,
      },
    };
  }

  const { data: allAdminsData, error: allAdminsError } = await supabase
    .from("tournament_admins")
    .select("email")
    .eq("tournament_id", tournamentId);
  if (allAdminsError) {
    return { error: toAppError(allAdminsError) };
  }

  const emails = allAdminsData ? allAdminsData.map((val) => val.email) : [];

  const { data: inviteData, error: inviteError } = await supabase
    .from("tournament_invites")
    .select("id")
    .eq("tournament_id", tournamentId)
    .maybeSingle();

  if (inviteError) {
    return { error: toAppError(inviteError) };
  }
  const link =
    inviteData?.id ?
      `${process.env.NEXT_PUBLIC_SITE_URL!}/tournaments/invite/${inviteData.id}`
    : "";
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

  const { data, error } = await supabase.rpc("get_invite_info", {
    invite_id: inviteId,
  });
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
  if (data) {
    return {
      data: {
        name: data.tour_name,
        division: data.tour_division,
        imageUrl: data.tour_image,
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

  const { data, error } = await supabase.rpc("accept_invite", {
    invite_id: inviteId,
  });
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

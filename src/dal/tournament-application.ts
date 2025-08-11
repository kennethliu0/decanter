import "server-only";

import {
  InsertTournamentApplicationSchema,
  Result,
  TournamentApplicationInfoSchema,
  TournamentCards,
} from "@/lib/definitions";
import {
  AppAuthError,
  AppError,
  ERROR_CODES,
  toAppError,
  TournamentNotFoundError,
} from "@/lib/errors";
import { toCamel } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import {
  infer as zodInfer,
  string as zodString,
  enum as zodEnum,
  number,
} from "zod/v4";
import { EVENTS } from "@/lib/config";

export async function getTournaments(): Promise<
  Result<zodInfer<typeof TournamentCards>>
> {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }
  const { data, error } = await supabase
    .from("tournaments")
    .select(
      `id, image_url, website_url, name, location, division, 
      start_date, end_date, apply_deadline, slug, 
      tournament_applications!left(submitted)`,
    )
    .eq("approved", true)
    .eq("closed_early", false)
    .eq("tournament_applications.user_id", authData.claims.sub);
  if (error) {
    console.error(error);
    return { error: toAppError(error) };
  }
  const validatedFields = TournamentCards.safeParse(
    data.map(({ tournament_applications, ...rest }) => {
      return toCamel({
        applied: !!tournament_applications?.[0]?.submitted,
        ...rest,
      });
    }),
  );
  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return { error: toAppError(validatedFields.error) };
  }
  return {
    data: validatedFields.data,
  };
}

export async function getTournamentCounts(): Promise<
  Result<{
    savedApplications: number;
    tournamentsB: number;
    tournamentsC: number;
  }>
> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }
  const { data: applicationData, error: applicationError } = await supabase
    .from("tournament_applications")
    .select("tournament_id")
    .eq("user_id", authData.claims.sub)
    .eq("submitted", false);
  if (applicationError) {
    return { error: toAppError(applicationError) };
  }

  const { data, error } = await supabase
    .from("tournaments")
    .select("division")
    .eq("approved", true);
  if (error) {
    console.error(error);
    return { error: toAppError(error) };
  }
  const total = data.length;
  const tournamentsB = data.filter((t) => t.division === "B").length;
  const tournamentsC = data.filter((t) => t.division === "C").length;
  return {
    data: {
      savedApplications: applicationData.length,
      tournamentsB,
      tournamentsC,
    },
  };
}

export async function getTournamentApplicationInfo(slug: string): Promise<
  Result<{
    application: zodInfer<typeof TournamentApplicationInfoSchema>;
  }>
> {
  const validatedFields = zodString().safeParse(slug);
  if (!validatedFields.success) {
    return {
      error: TournamentNotFoundError,
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return {
      error: AppAuthError,
    };
  }
  const { data, error } = await supabase
    .from("tournaments")
    .select(
      "id, name, location, division, image_url, website_url, start_date, end_date, apply_deadline, application_fields, closed_early",
    )
    .eq("slug", validatedFields.data)
    .eq("approved", true)
    .maybeSingle();
  if (error) {
    return { error: toAppError(error) };
  }
  if (!data) {
    return {
      error: TournamentNotFoundError,
    };
  }
  if (new Date(data.apply_deadline) < new Date() || data.closed_early) {
    return {
      error: {
        message: "Application deadline for this tournament has already passed",
        code: ERROR_CODES.DEADLINE_PASSED,
        status: 422,
      },
    };
  }
  const validatedData = TournamentApplicationInfoSchema.safeParse(
    toCamel(data),
  );
  if (!validatedData.success) {
    console.error(error);
    return { error: toAppError(validatedData.error) };
  }

  return { data: { application: validatedData.data } };
}

export async function getSavedTournamentApplication(slugRaw: string): Promise<
  Result<{
    application: zodInfer<typeof InsertTournamentApplicationSchema>;
    submitted: boolean;
  }>
> {
  const validatedData = zodString().safeParse(slugRaw);
  if (!validatedData.success) {
    return {
      error: TournamentNotFoundError,
    };
  }
  const slug = validatedData.data;

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return {
      error: AppAuthError,
    };
  }

  const { data: tournamentData, error: tournamentError } = await supabase
    .from("tournaments")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (tournamentError) {
    console.error(tournamentError);
    return { error: toAppError(tournamentError) };
  }
  if (!tournamentData?.id) {
    return {
      error: TournamentNotFoundError,
    };
  }
  const tournamentId = tournamentData.id;

  const { data, error } = await supabase
    .from("tournament_applications")
    .select("preferences, responses, submitted")
    .eq("tournament_id", tournamentId)
    .eq("user_id", authData.claims.sub)
    .maybeSingle();

  if (error) {
    console.error(error);
    return { error: toAppError(error) };
  }

  if (!data) {
    return {};
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
    data: {
      application: validatedApplication.data,
      submitted: data.submitted ?? false,
    },
  };
}

export async function upsertTournamentApplication(
  application: zodInfer<typeof InsertTournamentApplicationSchema>,
): Promise<{ error?: AppError }> {
  const validatedFields =
    InsertTournamentApplicationSchema.safeParse(application);
  if (!validatedFields.success) {
    return {
      error: toAppError(validatedFields.error),
    };
  }

  const { tournamentId, preferences, responses, mode } = validatedFields.data;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }

  // check that events are within the correct division
  const { data: divisionData, error: divisionError } = await supabase
    .from("tournaments")
    .select("division")
    .eq("id", tournamentId)
    .maybeSingle();

  if (divisionError) {
    console.error(divisionError);
    return { error: toAppError(divisionError) };
  }

  if (!divisionData) {
    return { error: TournamentNotFoundError };
  }

  const division = zodEnum(["B", "C"]).safeParse(divisionData.division);
  if (!division.success) {
    console.error("Division returned from database was not B or C");
    return {
      error: {
        message: "Error retrieving tournament",
        code: ERROR_CODES.UNKNOWN,
      },
    };
  }
  for (const event of preferences) {
    if (event !== "" && !EVENTS[division.data].includes(event)) {
      return {
        error: {
          message: "Invalid event input",
          code: ERROR_CODES.INVALID_INPUT,
        },
      };
    }
  }

  const { data: profileData, error: profileError } = await supabase
    .from("volunteer_profiles")
    .select("name")
    .eq("id", authData.claims.sub)
    .maybeSingle();

  if (!profileData || profileError) {
    return {
      error: {
        message: "You must create a volunteer profile before applying",
        code: ERROR_CODES.VOLUNTEER_PROFILE_NOT_FOUND,
      },
    };
  }

  // check if an application was submitted already
  const { data: existingData, error: existingError } = await supabase
    .from("tournament_applications")
    .select("submitted")
    .eq("tournament_id", tournamentId)
    .eq("user_id", authData.claims.sub)
    .maybeSingle();

  if (existingError) {
    console.error(existingError);
    return { error: toAppError(existingError) };
  }
  if (existingData?.submitted) {
    return {
      error: {
        message: "You have already applied for this tournament",
        code: ERROR_CODES.ALREADY_SUBMITTED,
      },
    };
  }
  const { error } = await supabase.from("tournament_applications").upsert({
    user_id: authData.claims.sub,
    tournament_id: tournamentId,
    preferences,
    responses,
    submitted: mode === "submit",
  });
  if (error) {
    console.error(error);
    return { error: toAppError(error) };
  }
  return {};
}

import "server-only";

import {
  EditTournamentSchemaServer,
  Result,
  TournamentAdminCards,
} from "@/lib/definitions";
import {
  AppAuthError,
  AppError,
  ERROR_CODES,
  toAppError,
  TournamentNotFoundError,
} from "@/lib/errors";
import { toCamel, toSnake } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import {
  infer as zodInfer,
  string as zodString,
  uuid as zodUuid,
} from "zod/v4";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import { SEASON_YEAR } from "@/lib/config";
import {
  checkUserIsTournamentAdmin,
  fetchManagedTournaments,
  fetchTournamentApplications,
  fetchTournamentDetails,
  fetchTournamentId,
  fetchTournamentApplicationsFull,
  getTournamentWithFieldsBySlug,
  updateTournamentTable,
  insertTournamentTable,
} from "./tournament-management-queries";

export async function getTournamentsManagedByUser(): Promise<
  Result<zodInfer<typeof TournamentAdminCards>>
> {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }

  const { data, error } = await fetchManagedTournaments(authData.claims.sub);
  if (error) {
    console.error(error);
    return { error: toAppError(error) };
  }
  if (!data) {
    return { data: [] };
  }

  const validatedFields = TournamentAdminCards.safeParse(
    data
      .flatMap((admin) => admin.tournaments || [])
      .map((tournament) => ({
        ...toCamel<Record<string, string>>({ ...tournament }),
        applicationCount: tournament.tournament_applications?.[0]?.count || 0,
      })),
  );
  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return { error: toAppError(validatedFields.error) };
  }
  return {
    data: validatedFields.data,
  };
}

export async function getTournamentManagement(slug: string): Promise<
  Result<{
    tournament: zodInfer<typeof EditTournamentSchemaServer>;
    applications: {
      id: string;
      name: string;
      email: string;
      education: string;
    }[];
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

  const { data: tournamentIdData, error: tournamentIdError } =
    await fetchTournamentId(validatedFields.data);

  if (tournamentIdError) {
    console.error(tournamentIdError);
    return { error: toAppError(tournamentIdError) };
  }
  if (!tournamentIdData?.id) {
    return {
      error: TournamentNotFoundError,
    };
  }
  const tournamentId = tournamentIdData.id;

  const { data: adminData, error: adminError } =
    await checkUserIsTournamentAdmin(authData.claims.sub, tournamentId);
  if (adminError) {
    return { error: toAppError(adminError) };
  }

  if (!adminData) {
    return {
      error: {
        message: "You are not authorized to manage this tournament",
        code: ERROR_CODES.FORBIDDEN,
        status: 403,
      },
    };
  }
  const { data: tournamentData, error: tournamentError } =
    await fetchTournamentDetails(tournamentId);
  if (tournamentError) {
    return { error: toAppError(tournamentError) };
  }
  if (!tournamentData) {
    return { error: TournamentNotFoundError };
  }
  const validatedTournament = EditTournamentSchemaServer.safeParse(
    toCamel(tournamentData),
  );
  if (!validatedTournament.success) {
    return { error: toAppError(validatedTournament.error) };
  }
  const tournament = validatedTournament.data;

  // return up to 100 applications for performance

  const { data: applicationData, error: applicationError } =
    await fetchTournamentApplications(tournamentId);
  if (applicationError) {
    console.error(applicationError);
    return { error: toAppError(applicationError) };
  }
  const applications =
    applicationData ?
      applicationData
        .filter((val) => val.volunteer_profiles != null)
        .map((val) => {
          // force treat volunteer_profiles as an object, not an array
          const profile = val.volunteer_profiles as {
            name?: string;
            education?: string;
            email?: string;
          };
          return {
            id: val.user_id,
            email: profile?.email || "Unknown",
            name: profile?.name || "Unknown",
            education: profile?.education || "Unknown",
          };
        })
    : [];

  return {
    data: {
      tournament,
      applications,
    },
  };
}

export async function insertTournament(
  values: Omit<zodInfer<typeof EditTournamentSchemaServer>, "id" | "approved">,
): Promise<Result<{ slug: string }>> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (!authData?.claims || authError) {
    return { error: AppAuthError };
  }
  const id = uuidv4();
  const created_by = authData.claims.sub;
  const slug = slugify(
    `${values.name.substring(0, 15)}-div${values.division}-${SEASON_YEAR}-${id.substring(0, 8)}`,
    {
      lower: true,
      strict: true,
      trim: true,
    },
  );
  const { error: tournamentError } = await insertTournamentTable({
    id,
    ...toSnake({ ...values }),
    created_by,
    slug,
  });
  if (tournamentError) {
    console.error(tournamentError);
    return { error: toAppError(tournamentError) };
  }
  return { data: { slug } };
}

export async function updateTournament(
  id: string,
  values: Omit<zodInfer<typeof EditTournamentSchemaServer>, "id" | "approved">,
): Promise<{ error?: AppError }> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (!authData?.claims || authError) {
    return { error: AppAuthError };
  }
  const { data, error } = await checkUserIsTournamentAdmin(
    authData.claims.sub,
    id,
  );
  if (error || !data) {
    return {
      error: TournamentNotFoundError,
    };
  }
  const { error: updateError } = await updateTournamentTable(id, {
    ...toSnake({ ...values }),
  });
  if (updateError) {
    console.error(error);
    return { error: toAppError(error) };
  }
  return {};
}

export async function getApplicationsCSV(
  slugRaw: string,
): Promise<Result<string>> {
  const validatedFields = zodString().safeParse(slugRaw);
  if (!validatedFields.success) {
    return { error: TournamentNotFoundError };
  }
  const supabase = await createClient();

  const slug = validatedFields.data;

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }

  const { data: tournamentData, error: tournamentError } =
    await getTournamentWithFieldsBySlug(slug);

  if (tournamentError) {
    return { error: toAppError(tournamentError) };
  }

  if (!tournamentData?.id) {
    return { error: TournamentNotFoundError };
  }
  const tournamentId = tournamentData.id;

  // check user authorizaton

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
  const { data, error } = await fetchTournamentApplicationsFull(tournamentId);

  if (error) {
    return { error: toAppError(error) };
  }
  const applicationFields = tournamentData.application_fields as {
    id: string;
    type: string;
    prompt: string;
  }[];
  const csv = [
    [
      "Timestamp",
      "Email",
      "Name",
      "Education",
      "Bio",
      "First Preference",
      "Second Preference",
      "Third Preference",
      "Fourth Preference",
      "Experience",
      ...applicationFields.map((field) => field.prompt),
    ],
    ...data
      .filter((application) => application.volunteer_profiles != null)
      .map((application) => {
        const volunteerProfile = application.volunteer_profiles as {
          bio?: string;
          name?: string;
          email?: string;
          education?: string;
          experience?: string;
        };
        const responses = application.responses as {
          fieldId?: string;
          response?: string;
        }[];
        const timestamp = new Date(application.updated_at);
        return [
          timestamp.toLocaleString("en-US", { timeZoneName: "short" }),
          volunteerProfile.email ?? "",
          volunteerProfile.name ?? "",
          volunteerProfile.education ?? "",
          volunteerProfile.bio ?? "",
          ...application.preferences,
          volunteerProfile.experience,
          ...applicationFields.map(
            (field) =>
              responses.find((response) => response.fieldId === field.id)
                ?.response ?? "",
          ),
        ];
      }),
  ];
  const escapeCSVCell = (cell: string) => {
    const str = String(cell ?? ""); // handle null/undefined
    const escaped = str.replace(/"/g, '""'); // escape quotes
    return `"${escaped}"`;
  };

  return {
    data: csv.map((row) => row.map(escapeCSVCell).join(",")).join("\n"),
  };
}

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

export async function getTournamentsManagedByUser(): Promise<
  Result<zodInfer<typeof TournamentAdminCards>>
> {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { error: AppAuthError };
  }

  const { data, error } = await supabase
    .from("tournament_admins")
    .select(
      `tournaments (
        id, image_url, website_url, name, location, division, start_date, end_date, apply_deadline, slug, tournament_applications(count)
      )`,
    )
    .eq("user_id", authData.claims.sub);
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

  const { data: tournamentIdData, error: tournamentIdError } = await supabase
    .from("tournaments")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

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

  const { data: adminData, error: adminError } = await supabase
    .from("tournament_admins")
    .select("tournament_id")
    .eq("tournament_id", tournamentId)
    .eq("user_id", authData.claims.sub)
    .maybeSingle();
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
  const { data: tournamentData, error: tournamentError } = await supabase
    .from("tournaments")
    .select(
      "id, name, location, division, image_url, website_url, closed_early, start_date, end_date, apply_deadline, application_fields, approved",
    )
    .eq("id", tournamentId)
    .maybeSingle();
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

  const { data: applicationData, error: applicationError } = await supabase
    .from("tournament_applications")
    .select("user_id, volunteer_profiles(name, email, education)")
    .eq("tournament_id", tournamentId)
    .eq("submitted", true)
    .order("updated_at", { ascending: true })
    .limit(100);
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

export async function upsertTournament(
  tournamentData: zodInfer<typeof EditTournamentSchemaServer>,
): Promise<Result<{ slug: string }>> {
  const validatedFields = EditTournamentSchemaServer.safeParse(tournamentData);
  if (!validatedFields.success) {
    return {
      error: toAppError(validatedFields.error),
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (!authData?.claims || authError) {
    return { error: AppAuthError };
  }
  // dont allow user to update approved and check id to see if a new tournament
  // should be created
  let { id, approved, ...values } = validatedFields.data;
  const newTournament = !id;
  let created_by = null,
    slug = null;
  if (!id) {
    id = uuidv4();
    created_by = authData.claims.sub;
    slug = slugify(
      `${values.name.substring(0, 15)}-div${values.division}-${SEASON_YEAR}-${id.substring(0, 8)}`,
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
      .eq("user_id", authData.claims.sub);
    if (error || !data) {
      return {
        error: TournamentNotFoundError,
      };
    }
  }
  if (!newTournament) {
    const { error } = await supabase
      .from("tournaments")
      .update({
        ...toSnake({ ...values }),
      })
      .eq("id", id);
    if (error) {
      console.error(error);
      return { error: toAppError(error) };
    }
  } else {
    const { error: tournamentError } = await supabase
      .from("tournaments")
      .insert({
        id,
        ...toSnake({ ...values }),
        created_by,
        slug,
      });
    if (tournamentError) {
      console.error(tournamentError);
      return { error: toAppError(tournamentError) };
    }
    const { error } = await supabase.from("tournament_admins").insert({
      tournament_id: id,
      user_id: authData.claims.sub,
      email: authData.claims.email,
    });
    if (error) {
      console.error(error);
      return {
        error: {
          message: "Couldn't set tournament admin privileges",
          code: ERROR_CODES.UNKNOWN,
        },
      };
    }
    const { error: inviteError } = await supabase
      .from("tournament_invites")
      .insert({ tournament_id: id });
    if (inviteError) {
      console.error(error);
      return {
        error: {
          message: "Couldn't create tournament invite",
          code: ERROR_CODES.UNKNOWN,
        },
      };
    }
    if (!slug) {
      console.error("Slug could not be found after tournament creation");
      return {
        error: {
          message: "Couldn't find tournament url, contact Decanter support.",
          code: ERROR_CODES.UNKNOWN,
        },
      };
    }
    return { data: { slug } };
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

  const { data: tournamentData, error: tournamentError } = await supabase
    .from("tournaments")
    .select("id, application_fields")
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
  const { data, error } = await supabase
    .from("tournament_applications")
    .select(
      "user_id, preferences, updated_at, responses, volunteer_profiles(name, email, education, bio, experience)",
    )
    .eq("tournament_id", tournamentId)
    .eq("submitted", true)
    .order("updated_at", { ascending: true });

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
    inviteData?.id ? `${process.env.NEXT_PUBLIC_SITE_URL}/tournaments/invite/${inviteData.id}` : "";
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

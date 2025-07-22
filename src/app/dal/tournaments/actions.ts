"use server";

import {
  EditTournamentSchemaServer,
  EditTournamentServerState,
  InsertTournamentApplicationState,
  TournamentApplicationInfoSchema,
  InsertTournamentApplicationSchema,
  Result,
  TournamentCards,
} from "@/lib/definitions";
import z from "zod/v4";
import { createClient } from "../../../utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { toCamel, toSnake } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { EVENTS, SEASON_YEAR } from "@/lib/config";
import { ERROR_CODES, toAppError } from "@/lib/errors";
import slugify from "slugify";

export async function getTournamentId(
  slugRaw: string,
): Promise<Result<{ id: string }>> {
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

  if (tournamentError) {
    return { error: toAppError(tournamentError) };
  }
  if (!tournamentData?.id) {
    return {
      error: {
        message: "Tournament ID not found",
        code: ERROR_CODES.NOT_FOUND,
        status: 404,
        name: "PostgrestError",
      },
    };
  }

  const validatedTournament = z
    .uuid({ version: "v4" })
    .safeParse(tournamentData.id);
  if (!validatedTournament.success) {
    return { error: toAppError(validatedTournament.error) };
  }
  const tournamentId = validatedTournament.data;
  return { data: { id: tournamentId } };
}

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

export async function getTournamentManagement(
  slug: string,
): Promise<Result<{ tournament: z.infer<typeof EditTournamentSchemaServer> }>> {
  const validatedFields = z.string().safeParse(slug);
  if (!validatedFields.success) {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select(
      "id, name, location, division, image_url, website_url, closed_early, start_date, end_date, apply_deadline, application_fields, approved",
    )
    .eq("slug", validatedFields.data)
    .maybeSingle();
  if (error) {
    return { error: toAppError(error) };
  }
  if (!data) {
    notFound();
  }
  const validatedData = EditTournamentSchemaServer.safeParse(toCamel(data));
  if (!validatedData.success) {
    return { error: toAppError(validatedData.error) };
  }
  return { data: { tournament: validatedData.data } };
}

export async function getTournamentApplicationInfo(slug: string): Promise<
  Result<{
    application: z.infer<typeof TournamentApplicationInfoSchema>;
  }>
> {
  const validatedFields = z.string().safeParse(slug);
  if (!validatedFields.success) {
    notFound();
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
  if (error) {
    return { error: toAppError(error) };
  }
  if (!data) {
    notFound();
  }
  const validatedData = TournamentApplicationInfoSchema.safeParse(
    toCamel(data),
  );
  if (!validatedData.success) {
    return { error: toAppError(validatedData.error) };
  }
  return { data: { application: validatedData.data } };
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
    if (event !== "" && !EVENTS[division.data].includes(event)) {
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
  const { data: profileData, error: profileError } = await supabase
    .from("volunteer_profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { message: "Error checking profile", success: false };
  }
  if (!profileData) {
    return {
      message: "You must create a volunteer profile first",
      success: false,
    };
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
  const { data: tournamentIdData, error: tournamentIdError } =
    await getTournamentId(slugRaw);

  if (tournamentIdError) {
    return { error: tournamentIdError };
  }
  if (!tournamentIdData?.id) {
    return {
      error: {
        message: "Tournament ID not found",
        code: ERROR_CODES.NOT_FOUND,
        status: 404,
        name: "PostgrestError",
      },
    };
  }
  const tournamentId = tournamentIdData?.id;

  const supabase = await createClient();

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

type VolunteerProfile = {
  name: string;
  education: string;
};

type TournamentApplication = {
  user_id: string;
  email: string;
  volunteer_profiles: VolunteerProfile | null;
};

function toApplications(data: any[] | null): TournamentApplication[] {
  if (!Array.isArray(data)) return [];

  return data.filter(
    (d): d is TournamentApplication => !!d?.volunteer_profiles,
  );
}

export async function getTournamentApplicationsSummary(
  slugRaw: string,
): Promise<
  Result<{
    applications: {
      id: string;
      name: string;
      email: string;
      education: string;
    }[];
  }>
> {
  const { data: tournamentIdData, error: tournamentIdError } =
    await getTournamentId(slugRaw);

  if (tournamentIdError) {
    return { error: tournamentIdError };
  }
  if (!tournamentIdData?.id) {
    return {
      error: {
        message: "Tournament ID not found",
        code: ERROR_CODES.NOT_FOUND,
        status: 404,
        name: "PostgrestError",
      },
    };
  }
  const tournamentId = tournamentIdData?.id;

  const supabase = await createClient();

  // check user authorizaton

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.id) {
    redirect("/login");
  }

  const { data: adminData, error: adminError } = await supabase
    .from("tournament_admins")
    .select("user_id")
    .eq("user_id", user.id)
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

  // return up to 100 applications for performance

  const { data, error } = await supabase
    .from("tournament_applications")
    .select(
      `user_id, email, 
        volunteer_profiles (
          name,
          education
        )
      `,
    )
    .eq("tournament_id", tournamentId)
    .eq("submitted", true)
    .order("updated_at", { ascending: true })
    .limit(100);
  if (error) {
    console.error(error);
    return { error: toAppError(error) };
  }
  if (!data) {
    return { data: { applications: [] } };
  }
  return {
    data: {
      applications: toApplications(data)
        .filter((val) => val.volunteer_profiles != null)
        .map((val) => ({
          id: val.user_id,
          email: val.email,
          name: val.volunteer_profiles?.name ?? "Unknown",
          education: val.volunteer_profiles?.education ?? "Unknown",
        })),
    },
  };
}

export async function getTournaments(): Promise<
  Result<z.infer<typeof TournamentCards>>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournaments")
    .select(
      "id, image_url, website_url, name, location, division, start_date, end_date, apply_deadline, slug",
    )
    .eq("approved", true)
    .eq("closed_early", false);
  if (error) {
    return { error: toAppError(error) };
  }
  const validatedFields = TournamentCards.safeParse(
    data.map((entry) => toCamel(entry)),
  );
  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return { error: toAppError(validatedFields.error) };
  }

  return {
    data: validatedFields.data,
  };
}

import "server-only";
import { createClient } from "@/utils/supabase/server";

/* v8 ignore start*/
export async function fetchTournaments(id: string) {
  const supabase = await createClient();
  return await supabase
    .from("tournaments")
    .select(
      `id, image_url, website_url, name, location, division, 
      start_date, end_date, apply_deadline, slug, 
      tournament_applications!left(submitted)`,
    )
    .eq("approved", true)
    .eq("closed_early", false)
    .eq("tournament_applications.user_id", id);
}

export async function fetchApplicationCount(id: string) {
  const supabase = await createClient();
  return await supabase
    .from("tournament_applications")
    .select("tournament_id")
    .eq("user_id", id)
    .eq("submitted", false);
}

export async function fetchTournamentDivisionsCount() {
  const supabase = await createClient();
  return await supabase
    .from("tournaments")
    .select("division")
    .eq("approved", true);
}

export async function fetchApplicationInfo(slug: string) {
  const supabase = await createClient();
  return await supabase
    .from("tournaments")
    .select(
      "id, name, location, division, image_url, website_url, start_date, end_date, apply_deadline, application_fields, closed_early",
    )
    .eq("slug", slug)
    .eq("approved", true)
    .maybeSingle();
}

export async function fetchTournamentId(slug: string) {
  const supabase = await createClient();
  return await supabase
    .from("tournaments")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
}

export async function fetchSavedApplication(
  tournamentId: string,
  userId: string,
) {
  const supabase = await createClient();
  return await supabase
    .from("tournament_applications")
    .select("preferences, responses, submitted")
    .eq("tournament_id", tournamentId)
    .eq("user_id", userId)
    .maybeSingle();
}

export async function fetchTournamentDivision(tournamentId: string) {
  const supabase = await createClient();
  return await supabase
    .from("tournaments")
    .select("division")
    .eq("id", tournamentId)
    .maybeSingle();
}

export async function fetchName(userId: string) {
  const supabase = await createClient();
  return await supabase
    .from("volunteer_profiles")
    .select("name")
    .eq("id", userId)
    .maybeSingle();
}

export async function upsertApplication(payload: {
  user_id: string;
  tournament_id: string;
  preferences: string[];
  responses: { fieldId: string; response: string }[];
  submitted: boolean;
}) {
  const supabase = await createClient();
  return await supabase.from("tournament_applications").upsert(payload);
}

/* v8 ignore stop*/

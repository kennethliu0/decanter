import "server-only";

import { createClient } from "@/utils/supabase/server";
/* v8 ignore start */
export async function fetchManagedTournaments(userId: string) {
  const supabase = await createClient();
  return supabase
    .from("tournament_admins")
    .select(
      `tournaments (
      id, image_url, website_url, name, location, division, start_date, end_date, apply_deadline, slug, tournament_applications(count)
    )`,
    )
    .eq("user_id", userId);
}

export async function fetchTournamentId(slug: string) {
  const supabase = await createClient();
  return supabase
    .from("tournaments")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
}

export async function checkUserIsTournamentAdmin(
  userId: string,
  tournamentId: string,
) {
  const supabase = await createClient();
  return supabase
    .from("tournament_admins")
    .select("tournament_id")
    .eq("tournament_id", tournamentId)
    .eq("user_id", userId)
    .maybeSingle();
}

export async function fetchTournamentDetails(tournamentId: string) {
  const supabase = await createClient();
  return supabase
    .from("tournaments")
    .select(
      "id, name, location, division, image_url, website_url, closed_early, start_date, end_date, apply_deadline, application_fields, approved",
    )
    .eq("id", tournamentId)
    .maybeSingle();
}

export async function fetchTournamentSummary(slug: string) {
  const supabase = await createClient();
  return supabase
    .from("tournaments")
    .select("name, division, image_url")
    .eq("slug", slug)
    .maybeSingle();
}

export async function fetchTournamentApplications(
  tournamentId: string,
  limit = 100,
) {
  const supabase = await createClient();
  return supabase
    .from("tournament_applications")
    .select("user_id, volunteer_profiles(name, email, education)")
    .eq("tournament_id", tournamentId)
    .eq("submitted", true)
    .order("updated_at", { ascending: true })
    .limit(limit);
}

export async function updateTournamentTable(
  id: string,
  values: Record<string, unknown>,
) {
  const supabase = await createClient();
  return supabase.from("tournaments").update(values).eq("id", id);
}

export async function insertTournamentTable(values: Record<string, unknown>) {
  const supabase = await createClient();
  return supabase.from("tournaments").insert(values);
}

export async function insertTournamentAdmin(admin: {
  tournament_id: string;
  user_id: string;
  email: string;
}) {
  const supabase = await createClient();
  return supabase.from("tournament_admins").insert(admin);
}

export async function insertTournamentInvite(tournamentId: string) {
  const supabase = await createClient();
  return supabase
    .from("tournament_invites")
    .insert({ tournament_id: tournamentId });
}

export async function getTournamentWithFieldsBySlug(slug: string) {
  const supabase = await createClient();
  return supabase
    .from("tournaments")
    .select("id, application_fields")
    .eq("slug", slug)
    .maybeSingle();
}

export async function fetchTournamentApplicationsFull(tournamentId: string) {
  const supabase = await createClient();
  return supabase
    .from("tournament_applications")
    .select(
      "user_id, preferences, updated_at, responses, volunteer_profiles(name, email, education, bio, experience)",
    )
    .eq("tournament_id", tournamentId)
    .eq("submitted", true)
    .order("updated_at", { ascending: true });
}
/* v8 ignore end */

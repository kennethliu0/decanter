import { createClient } from "@/utils/supabase/server";
/* v8 ignore start */
export async function getTournamentId(slug: string) {
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

export async function getAdminEmails(tournamentId: string) {
  const supabase = await createClient();
  return supabase
    .from("tournament_admins")
    .select("email")
    .eq("tournament_id", tournamentId);
}

export async function getInviteId(tournamentId: string) {
  const supabase = await createClient();
  return supabase
    .from("tournament_invites")
    .select("id")
    .eq("tournament_id", tournamentId)
    .maybeSingle();
}

export async function getInviteInfo(inviteId: string) {
  const supabase = await createClient();
  return supabase.rpc("get_invite_info", { invite_id: inviteId });
}

export async function acceptInvite(inviteId: string) {
  const supabase = await createClient();
  return supabase.rpc("accept_invite", { invite_id: inviteId });
}
/* v8 ignore end */

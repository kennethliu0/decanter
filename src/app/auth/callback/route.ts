import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if `next` is in param, use it or default to '/'
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // URL to redirect to after successful auth exchange, combining origin and next path
      const redirectUrl = `${origin}${next}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to login page
  console.error("Error exchanging code for session or missing code");
  const redirectUrl = `${origin}/login?message=oauth-failed`;
  return NextResponse.redirect(redirectUrl);
}

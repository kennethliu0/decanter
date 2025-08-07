"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { isSafeRedirect } from "@/lib/utils";

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Log out error", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
    });
    return { message: "An error occurred while logging out." };
  }
  
  revalidatePath("/login", "layout");
  redirect("/login");
}

export async function signInWithGoogleAction(redirectToRaw: string) {
  const supabase = await createClient();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin"); 
  if (origin !== process.env.NEXT_PUBLIC_SITE_URL!) {
    console.error("Untrusted origin:", origin);
    return redirect("/login");
  }
  const redirectTo =
    isSafeRedirect(redirectToRaw) ? redirectToRaw! : "/dashboard";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Dynamically set the callback URL based on the request origin
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  });
  if (error) {
    console.error("Error signing in with Google:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
    });
    return redirect("/login?message=oauth_failed");
  }

  if (data.url) {
    // Redirect the browser to the Google auth page
    return redirect(data.url);
  } else {
    console.error("signInWithOAuth did not return a URL");
    return redirect("/login?message=oauth_failed");
  }
}

"use client";

import { Button } from "@/components/shadcn/button";
import { signInWithGoogleAction } from "@/app/actions/auth";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isSafeRedirect } from "@/lib/utils";

type Props = {};

const GoogleSignInButton = (props: Props) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const params = useSearchParams();
  const redirectToRaw = params.get("redirect");
  const redirectTo =
    isSafeRedirect(params.get("redirect")) ? redirectToRaw! : "/dashboard";

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogleAction(redirectTo);
    } catch (error) {
      console.error("OAuth error", error);
      setGoogleLoading(false);
    }
  };
  return (
    <Button
      className="w-full"
      onClick={handleGoogleSignIn}
      disabled={googleLoading}
    >
      {googleLoading ? "Redirecting..." : `Sign in with Google`}
    </Button>
  );
};

export default GoogleSignInButton;

"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogleAction } from "@/utils/auth";
import React, { useState } from "react";

type Props = {
  signin?: boolean;
};

const GoogleSignInButton = ({ signin = true }: Props) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogleAction();
      setGoogleLoading(false);
    } catch (error) {
      console.error("OAuth error", error);
      setGoogleLoading(false);
    }
  };
  return (
    <Button
      className="w-full"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={googleLoading}
    >
      {googleLoading ?
        "Redirecting..."
      : `Sign ${signin ? "in" : "up"} with Google`}
    </Button>
  );
};

export default GoogleSignInButton;

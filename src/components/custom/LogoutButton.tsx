"use client";
import { logout } from "@/app/actions/auth";
import LoadingButton from "./LoadingButton";
import { startTransition, useActionState } from "react";

const LogoutButton = () => {
  const [, action, pending] = useActionState(logout, undefined);
  return (
    <LoadingButton
      pending={pending}
      onClick={() => {
        startTransition(() => {
          action();
        });
      }}
      className="font-semibold"
      variant="outline"
    >
      Log out
    </LoadingButton>
  );
};

export default LogoutButton;

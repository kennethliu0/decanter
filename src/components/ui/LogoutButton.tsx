"use client";
import { logout } from "@/app/actions/auth";
import LoadingButton from "./LoadingButton";
import { startTransition, useActionState, useTransition } from "react";

type Props = {};

const LogoutButton = (props: Props) => {
  const [state, action, pending] = useActionState(logout, undefined);
  return (
    <LoadingButton
      pending={pending}
      onClick={() => {
        startTransition(() => {
          action();
        });
      }}
      className="font-semibold"
      variant="ghost"
    >
      Log out
    </LoadingButton>
  );
};

export default LogoutButton;

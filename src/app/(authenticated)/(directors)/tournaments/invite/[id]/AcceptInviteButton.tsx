"use client";

import { acceptTournamentInviteAction } from "@/app/actions/tournaments";
import LoadingButton from "@/components/ui/LoadingButton";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  id: string;
};

const AcceptInviteButton = (props: Props) => {
  const [state, action, pending] = useActionState(
    acceptTournamentInviteAction,
    undefined,
  );
  useEffect(() => {
    if (state?.success === false) {
      toast.error(state?.message);
    }
  }, [state]);

  return (
    <LoadingButton
      pending={pending}
      onClick={() => {
        startTransition(() => {
          action(props.id);
        });
      }}
    >
      Accept Invite
    </LoadingButton>
  );
};

export default AcceptInviteButton;

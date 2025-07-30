"use client";

import { useTournamentInviteAction } from "@/app/actions/tournaments";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
};

const AcceptInviteButton = (props: Props) => {
  return (
    <Button
      onClick={() => {
        useTournamentInviteAction(props.id);
      }}
    >
      Accept Invite
    </Button>
  );
};

export default AcceptInviteButton;

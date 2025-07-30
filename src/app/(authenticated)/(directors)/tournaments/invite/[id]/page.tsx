import React from "react";
import AcceptInviteButton from "./AcceptInviteButton";

type Props = {
  params: Promise<{ id: string }>;
};

const page = async (props: Props) => {
  const params = await props.params;
  return (
    <div>
      You have been invited to manage a tournament.
      <AcceptInviteButton id={params.id} />
    </div>
  );
};

export default page;

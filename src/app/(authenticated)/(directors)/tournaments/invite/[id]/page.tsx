import React from "react";
import AcceptInviteButton from "./AcceptInviteButton";
import { getTournamentInviteInfo } from "@/dal/tournament-management";
import { ERROR_CODES } from "@/lib/errors";
import { notFound, redirect } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DecanterIcon from "@/components/ui/DecanterIcon";

type Props = {
  params: Promise<{ id: string }>;
};

const page = async (props: Props) => {
  const params = await props.params;
  const { data, error } = await getTournamentInviteInfo(params.id);

  if (error) {
    switch (error.code) {
      case ERROR_CODES.AUTH_ERROR:
        redirect("/login");
      case ERROR_CODES.NOT_FOUND:
        notFound();
      default:
        redirect("/error");
    }
  }
  if (!data) {
    notFound();
  }
  return (
    <main>
      <div className="w-full max-w-2xl mx-auto bg-card border flex rounded-lg p-2 gap-2">
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={data.imageUrl}
            alt={`${data.name} tournament picture`}
          />
          <AvatarFallback className="rounded-lg">
            <DecanterIcon />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div>
            <h2 className="text-xl text-muted-foreground">
              You have been invited to manage
            </h2>
            <h1 className="text-2xl">
              {data.name} (Division {data.division})
            </h1>
          </div>
          <AcceptInviteButton id={params.id} />
        </div>
      </div>
    </main>
  );
};

export default page;

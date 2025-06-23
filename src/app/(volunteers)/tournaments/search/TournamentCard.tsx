import React from "react";
import { Globe } from "lucide-react";
import VolunteerEventRankingDialog from "../VolunteerEventRankingDialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";

type Props = {
  tournament: TournamentInfo;
};

const TournamentCard = (props: Props) => {
  return (
    <div className="max-w-[400px] border p-4 rounded-lg bg-zinc-900">
      <div className="flex gap-2">
        <Avatar className="w-[40px] h-[40px] rounded-sm">
          <AvatarImage
            src={props.tournament.imageUrl}
            alt={props.tournament.name}
          />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
        <div className="grow-1">
          <p className="text-sm">
            <strong>{props.tournament.name}</strong>
          </p>
          <div className="flex gap-1">
            <p className="text-sm">
              {props.tournament.startDate.toLocaleDateString()} -{" "}
              {props.tournament.endDate.toLocaleDateString()}{" "}
            </p>
            <Badge className="rounded-sm">{props.tournament.location}</Badge>{" "}
            <Badge className="rounded-sm">{props.tournament.division}</Badge>
          </div>
        </div>
        <a href={props.tournament.websiteUrl}>
          <Globe width="1.5em" />
        </a>
      </div>
      <div className="flex justify-between align-middle">
        <p className="text-sm">
          Apply By{" "}
          {props.tournament.applicationDeadlineDate.toLocaleDateString()} Tests
          Due {props.tournament.testDeadlineDate.toLocaleDateString()}
        </p>
        <VolunteerEventRankingDialog division={props.tournament.division} />
      </div>
    </div>
  );
};

type TournamentInfo = {
  name: string;
  startDate: Date;
  endDate: Date;
  testDeadlineDate: Date;
  applicationDeadlineDate: Date;
  location: string;
  websiteUrl: string;
  division: "B" | "C";
  imageUrl: string;
};

export { TournamentCard };
export type { TournamentInfo };

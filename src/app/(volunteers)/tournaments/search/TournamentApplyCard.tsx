import React from "react";
import { FlaskConical, Globe } from "lucide-react";
import VolunteerEventRankingDialog from "@/app/(volunteers)/tournaments/search/VolunteerEventRankingDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Props = {
  tournament: TournamentInfo;
};

const TournamentApplyCard = (props: Props) => {
  const truncate = (str: string, maxLength = 69, ellipsis = "...") => {
    if (str.length <= maxLength) return str;

    const truncatedLength = maxLength - ellipsis.length;

    if (truncatedLength <= 0) {
      return ellipsis.slice(0, maxLength);
    }

    return str.slice(0, truncatedLength) + ellipsis;
  };

  return (
    <div className="min-w-[312px] max-w-[413px] border p-4 rounded-lg bg-card">
      <div className="flex gap-2">
        <Avatar className="w-[60px] h-[60px] rounded-sm">
          <AvatarImage
            className="rounded-sm"
            src={props.tournament.imageUrl}
            alt={props.tournament.name}
          />
          <AvatarFallback className="rounded-sm">
            <FlaskConical />
          </AvatarFallback>
        </Avatar>
        <div className="grow text-sm">
          <strong>{truncate(props.tournament.name)}</strong>{" "}
          <span className="inline-flex flex-wrap gap-x-1 gap-y-1 align-middle">
            <Badge className="rounded-sm shrink-0">
              {props.tournament.location}
            </Badge>
            <Badge className="rounded-sm shrink-0">
              {props.tournament.division}
            </Badge>
          </span>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm">
            {props.tournament.startDate.toLocaleDateString()} -{" "}
            {props.tournament.endDate.toLocaleDateString()}
          </p>
          <p className="text-sm">
            {"\n"}Apply By{" "}
            {props.tournament.applicationDeadlineDate.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-1 items-center">
          <Link href={props.tournament.websiteUrl}>
            <Globe width="1.5em" />
          </Link>
          <VolunteerEventRankingDialog division={props.tournament.division} />
        </div>
      </div>
    </div>
  );
};

type TournamentInfo = {
  name: string;
  startDate: Date;
  endDate: Date;
  applicationDeadlineDate: Date;
  location: string;
  websiteUrl: string;
  division: "B" | "C";
  imageUrl: string;
};

export { TournamentApplyCard };
export type { TournamentInfo };

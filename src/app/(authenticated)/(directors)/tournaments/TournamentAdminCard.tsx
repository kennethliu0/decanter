import React from "react";
import { FlaskConical, Globe, Pencil } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TournamentInfo } from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentApplyCard";
import { Button } from "@/components/ui/button";
import { parse } from "date-fns";

type Props = {
  tournament: TournamentInfo;
  applicationCount: number;
};

const TournamentAdminCard = (props: Props) => {
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
        <Avatar className="w-[60px] h-[60px]">
          <AvatarImage
            src={props.tournament.imageUrl}
            alt={props.tournament.name}
          />
          <AvatarFallback>
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
          <p>{props.applicationCount} applications</p>
          <p className="text-sm">
            {parse(
              props.tournament.startDate,
              "yyyy-MM-dd",
              new Date(),
            ).toLocaleDateString()}{" "}
            -{" "}
            {parse(
              props.tournament.endDate,
              "yyyy-MM-dd",
              new Date(),
            ).toLocaleDateString()}
          </p>
        </div>
        <Link href="/tournaments/manage">
          <Button>Manage Tournament</Button>
        </Link>
      </div>
    </div>
  );
};

export { TournamentAdminCard };

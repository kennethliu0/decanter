import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shadcn/avatar";
import { Badge } from "@/components/shadcn/badge";
import Link from "next/link";
import { format } from "date-fns";
import { TournamentCardDisplay } from "@/lib/definitions";
import { Button } from "@/components/shadcn/button";
import { infer as zodInfer } from "zod/v4";
import { formatToUTCDate } from "@/lib/utils";
import DecanterIcon from "@/components/custom/DecanterIcon";
import { ExternalLinkIcon } from "@/components/custom/external-link-icon";

type Props = {
  tournament: zodInfer<typeof TournamentCardDisplay>;
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
    <div className="min-w-[312px] w-full max-w-[413px] border shadow-sm p-4 rounded-lg bg-card justify-self-start self-start">
      <div className="flex gap-2">
        <Avatar className="w-[60px] h-[60px]">
          <AvatarImage
            src={props.tournament.imageUrl}
            alt={props.tournament.name}
          />
          <AvatarFallback>
            <DecanterIcon />
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
            {formatToUTCDate(props.tournament.startDate)}-{" "}
            {formatToUTCDate(props.tournament.endDate)}
          </p>
          <p className="text-sm">
            {"\n"}Apply By {format(props.tournament.applyDeadline, "Pp")}
          </p>
        </div>
        <div className="flex gap-1 items-center">
          <ExternalLinkIcon
            href={props.tournament.websiteUrl}
            label={`${props.tournament.name} external link`}
          />

          <Button
            asChild
            variant={
              props.tournament.status === "applied" ? "outline" : "default"
            }
            className="w-17"
          >
            <Link href={`/tournaments/apply/${props.tournament.slug}`}>
              {props.tournament.status === "applied" ?
                "Applied"
              : props.tournament.status === "saved" ?
                "Saved"
              : "Apply"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { TournamentApplyCard };

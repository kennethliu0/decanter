"use client";

import { TournamentApplyCard } from "./TournamentApplyCard";
import { clearUTCTime, fuzzyMatch } from "@/lib/utils";
import { Pagination } from "@/components/custom/pagination";
import { SEASON_END_DATE, TOURNAMENT_CARDS_PER_PAGE } from "@/lib/config";
import { useSearchParams } from "next/navigation";
import { infer as zodInfer } from "zod/v4";
import { TournamentCards } from "@/lib/definitions";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { AlertCircleIcon } from "lucide-react";

type Props = {
  tournaments: zodInfer<typeof TournamentCards>;
};

const TournamentTable = (props: Props) => {
  const today = clearUTCTime(new Date());
  const params = useSearchParams();
  const query = params.get("query");
  const location = params.getAll("location");
  const division = params.getAll("division");
  const showApplied = params.get("showApplied");
  const sort = params.get("sort") ?? "startDate";
  const currentPage = parseInt(params.get("page") ?? "1");
  const startDateAfter = clearUTCTime(
    new Date(params.get("startDateAfter") ?? today),
  );
  const startDateBefore = clearUTCTime(
    new Date(params.get("startDateBefore") ?? SEASON_END_DATE),
  );
  const applyDeadlineAfter = clearUTCTime(
    new Date(params.get("applyDeadlineAfter") ?? today),
  );
  const filteredTournaments = props.tournaments
    .map(({ startDate, endDate, applyDeadline, ...rest }) => ({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applyDeadline: new Date(applyDeadline),
      ...rest,
    }))
    .filter(
      (t) =>
        (location.length === 0 || location.includes(t.location))
        && (division.length === 0 || division.includes(t.division))
        && t.startDate > startDateAfter
        && t.startDate < startDateBefore
        && t.applyDeadline > applyDeadlineAfter
        && (!query || fuzzyMatch(query, t.name))
        && (showApplied || !t.applied),
    )
    .sort((a, b) =>
      sort === "applyDeadline" ?
        a.applyDeadline.getTime() - b.applyDeadline.getTime()
      : a.startDate.getTime() - b.startDate.getTime(),
    );
  const totalPages = Math.max(
    Math.ceil(filteredTournaments.length / TOURNAMENT_CARDS_PER_PAGE),
    1,
  );
  const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const start = (safePage - 1) * TOURNAMENT_CARDS_PER_PAGE;
  const end = start + TOURNAMENT_CARDS_PER_PAGE;
  const displayedTournaments = filteredTournaments.slice(start, end);

  return (
    <div className="flex flex-col grow gap-4">
      <div className="text-center">
        Displaying {filteredTournaments.length === 0 ? 0 : start + 1} -{" "}
        {Math.min(end, filteredTournaments.length)} of{" "}
        {filteredTournaments.length} tournaments
        {startDateAfter
          && startDateBefore
          && startDateAfter > startDateBefore && (
            <Alert
              variant="destructive"
              className="text-left mt-4"
            >
              <AlertCircleIcon />
              <AlertTitle>Invalid filters</AlertTitle>
              <AlertDescription>
                &quot;Start Date After&quot; field cannot be greater than
                &quot;Start Date Before&quot;
              </AlertDescription>
            </Alert>
          )}
      </div>
      <div className="grow grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 place-content-start">
        {displayedTournaments.map((tournament) => (
          <TournamentApplyCard
            tournament={tournament}
            key={tournament.id}
          />
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        className="mt-5 flex w-full justify-center"
      />
    </div>
  );
};

export default TournamentTable;

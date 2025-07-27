import { TournamentApplyCard } from "./TournamentApplyCard";
import { getTournaments } from "@/app/dal/tournaments/actions";
import { fuzzyMatch, matchesFilter } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { TOURNAMENT_CARDS_PER_PAGE } from "@/lib/config";

type Props = {
  query?: string;
  filters: {
    location?: string[] | string;
    division?: ("B" | "C")[] | "B" | "C";
    startDateAfter: Date;
    startDateBefore: Date;
    applyDeadlineAfter: Date;
  };
  sort?: string;
  currentPage: number;
};

const TournamentTable = async (props: Props) => {
  const { data: rawTournaments = [], error } = await getTournaments();
  if (error) {
    return <div>{error.message}</div>;
  }
  const {
    query,
    filters: {
      location,
      division,
      startDateAfter,
      startDateBefore,
      applyDeadlineAfter,
    },
    sort = "startDate",
    currentPage,
  } = props;
  const filteredTournaments = rawTournaments
    .map(({ startDate, endDate, applyDeadline, ...rest }) => ({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applyDeadline: new Date(applyDeadline),
      ...rest,
    }))
    .filter(
      (t) =>
        matchesFilter(location, t.location)
        && matchesFilter(division, t.division)
        && t.startDate > startDateAfter
        && t.startDate < startDateBefore
        && t.applyDeadline > applyDeadlineAfter
        && (!query || fuzzyMatch(query, t.name)),
    )
    .sort((a, b) =>
      sort === "applyDeadline" ?
        a.applyDeadline.getTime() - b.applyDeadline.getTime()
      : a.startDate.getTime() - b.startDate.getTime(),
    );
  const totalPages = Math.ceil(
    filteredTournaments.length / TOURNAMENT_CARDS_PER_PAGE,
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

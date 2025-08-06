import TournamentApplyCardSkeleton from "./TournamentApplyCardSkeleton";
import { TOURNAMENT_CARDS_PER_PAGE } from "@/lib/config";
import { Pagination } from "@/components/custom/pagination";

type Props = {};

const TournamentTableSkeleton = (props: Props) => {
  const count = Array.from({ length: TOURNAMENT_CARDS_PER_PAGE });
  return (
    <div className="flex flex-col grow gap-4">
      <div className="text-center">Loading tournaments...</div>
      <div className="grow grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 place-content-start">
        {count.map((_, index) => (
          <TournamentApplyCardSkeleton key={index} />
        ))}
      </div>
      <Pagination
        totalPages={1}
        className="mt-5 flex w-full justify-center"
      />
    </div>
  );
};

export default TournamentTableSkeleton;

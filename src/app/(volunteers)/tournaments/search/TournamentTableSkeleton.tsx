import React from "react";
import TournamentApplyCardSkeleton from "./TournamentApplyCardSkeleton";

type Props = {};

const TournamentTableSkeleton = (props: Props) => {
  return (
    <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <TournamentApplyCardSkeleton />
      <TournamentApplyCardSkeleton />
      <TournamentApplyCardSkeleton />
      <TournamentApplyCardSkeleton />
      <TournamentApplyCardSkeleton />
      <TournamentApplyCardSkeleton />
    </div>
  );
};

export default TournamentTableSkeleton;

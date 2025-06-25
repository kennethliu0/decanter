import React from "react";
import TournamentCardSkeleton from "../(volunteers)/tournaments/search/TournamentCardSkeleton";

type Props = {};

const TournamentTableSkeleton = (props: Props) => {
  return (
    <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <TournamentCardSkeleton />
      <TournamentCardSkeleton />
      <TournamentCardSkeleton />
      <TournamentCardSkeleton />
      <TournamentCardSkeleton />
      <TournamentCardSkeleton />
    </div>
  );
};

export default TournamentTableSkeleton;

import React from "react";
import { TournamentApplyCard } from "./TournamentApplyCard";
import { getTournaments } from "@/app/dal/tournaments/actions";

type Props = {
  query?: string;
  filters: {
    location?: string[] | string;
    division?: ("b" | "c")[] | "b" | "c";
    startDateAfter?: Date;
    startDateBefore?: Date;
    applyDateAfter?: Date;
  };
  currentPage: number;
};

const TournamentTable = async (props: Props) => {
  const { data: tournaments = [], error } = await getTournaments();
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {tournaments.map((tournament) => (
        <TournamentApplyCard
          tournament={tournament}
          key={tournament.id}
        />
      ))}
    </div>
  );
};

export default TournamentTable;

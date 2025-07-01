import React from "react";
import { tournaments } from "../../../data";
import { TournamentApplyCard } from "./TournamentApplyCard";

type Props = {
  query?: string;
  location?: string[] | string;
  division?: ("b" | "c")[] | "b" | "c";
  startDateAfter?: Date;
  startDateBefore?: Date;
  applyDateAfter?: Date;
  currentPage: number;
};

const TournamentTable = (props: Props) => {
  return (
    <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {tournaments.map((tournament, index) => (
        <TournamentApplyCard
          tournament={tournament}
          key={index}
        />
      ))}
    </div>
  );
};

export default TournamentTable;

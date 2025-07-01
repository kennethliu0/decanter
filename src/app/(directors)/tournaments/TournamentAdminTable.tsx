import { tournaments } from "@/app/data";
import React from "react";
import { TournamentAdminCard } from "./TournamentAdminCard";

type Props = {
  upcoming: boolean;
};

const TournamentAdminTable = ({ upcoming }: Props) => {
  return (
    <div className="inline-grid sm:grid-cols-2 space-y-2 space-x-2">
      {tournaments.map((tournament, index) => (
        <TournamentAdminCard
          tournament={tournament}
          key={index}
          applicationCount={30}
        />
      ))}
    </div>
  );
};

export default TournamentAdminTable;

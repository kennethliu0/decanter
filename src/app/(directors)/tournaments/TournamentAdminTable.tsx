import { tournaments } from "@/app/data";
import React from "react";
import { TournamentAdminCard } from "./TournamentAdminCard";

type Props = {
  upcoming: boolean;
};

const TournamentAdminTable = ({ upcoming }: Props) => {
  return (
    <div className="inline-grid sm:grid-cols-2 gap-2">
      <TournamentAdminCard
        tournament={tournaments[0]}
        applicationCount={30}
      />
      <TournamentAdminCard
        tournament={tournaments[1]}
        applicationCount={50}
      />
    </div>
  );
};

export default TournamentAdminTable;

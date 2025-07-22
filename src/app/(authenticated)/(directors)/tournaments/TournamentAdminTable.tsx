import React from "react";
import { TournamentAdminCard } from "./TournamentAdminCard";

type Props = {
  upcoming: boolean;
};

const TournamentAdminTable = ({ upcoming }: Props) => {
  return <div className="inline-grid sm:grid-cols-2 gap-2"></div>;
};

export default TournamentAdminTable;

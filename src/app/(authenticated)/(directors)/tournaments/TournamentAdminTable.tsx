import React, { use } from "react";
import { TournamentAdminCard } from "./TournamentAdminCard";
import { getTournamentsManagedByUser } from "@/app/dal/tournaments/actions";

type Props = {};

const TournamentAdminTable = (props: Props) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0);
  const { data, error } = use(getTournamentsManagedByUser());
  if (error || !data) {
    return <div>Something went wrong</div>;
  }
  const tournamentDisplays = data.map(
    ({ startDate, endDate, applyDeadline, ...rest }) => ({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applyDeadline: new Date(applyDeadline),
      ...rest,
    }),
  );
  const upcomingTournaments = tournamentDisplays.filter(
    (t) => t.startDate >= today,
  );
  const pastTournaments = tournamentDisplays.filter((t) => t.startDate < today);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl">Upcoming Tournaments</h2>
      <div className="grid sm:grid-cols-2 gap-2">
        {upcomingTournaments.length > 0 ?
          upcomingTournaments.map((t) => (
            <TournamentAdminCard
              tournament={t}
              key={t.id}
            />
          ))
        : "No upcoming found"}
      </div>
      <h2 className="text-2xl">Past Tournaments</h2>
      <div className="grid sm:grid-cols-2 gap-2">
        {pastTournaments.length > 0 ?
          pastTournaments.map((t) => (
            <TournamentAdminCard
              tournament={t}
              key={t.id}
            />
          ))
        : "No past tournaments found"}
      </div>
    </div>
  );
};

export default TournamentAdminTable;

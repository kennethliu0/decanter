import TournamentAdminCardSkeleton from "./TournamentAdminCardSkeleton";

export default function TournamentAdminTableSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl">Upcoming Tournaments</h2>
      <div className="flex flex-wrap gap-2">
        <TournamentAdminCardSkeleton />
        <TournamentAdminCardSkeleton />
      </div>
      <h2 className="text-2xl">Past Tournaments</h2>
      <div className="flex flex-wrap gap-2">
        <TournamentAdminCardSkeleton />
        <TournamentAdminCardSkeleton />
      </div>
    </div>
  );
}

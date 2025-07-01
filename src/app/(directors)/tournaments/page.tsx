import { tournaments } from "@/app/data";
import { TournamentAdminCard } from "./TournamentAdminCard";
import TournamentAdminTable from "./TournamentAdminTable";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Tournament Director Dashboard</h1>
      <h2 className="text-2xl">Upcoming Tournaments</h2>
      <TournamentAdminTable upcoming={true} />
      <h2 className="text-2xl">Past Tournaments</h2>
      <TournamentAdminTable upcoming={false} />
    </main>
  );
}

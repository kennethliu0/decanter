import Link from "next/link";
import TournamentEdit from "../TournamentEdit";
export default function Home() {
  return (
    <main className="p-4 max-w-4xl w-full mx-auto space-y-4 bg-background border rounded-xl shadow-lg">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Tournament</h1>
        <Link href="/tournaments">
          <span className="hover:underline text-muted-foreground">
            Back to all tournaments
          </span>
        </Link>
      </div>
      <TournamentEdit />
    </main>
  );
}

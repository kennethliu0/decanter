import Link from "next/link";
import { Suspense } from "react";
import TournamentEdit from "../TournamentEdit";
import TournamentEditSkeleton from "../TournamentEditSkeleton";
export default function Home() {
  return (
    <main className="px-4 max-w-4xl w-full mx-auto space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Tournament</h1>
        <Link href="/tournaments/manage">
          <span className="hover:underline text-muted-foreground">
            Back to all tournaments
          </span>
        </Link>
      </div>
      <Suspense fallback={<TournamentEditSkeleton />}>
        <TournamentEdit />
      </Suspense>
    </main>
  );
}

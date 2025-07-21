import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import TournamentEdit from "../TournamentEdit";
import TournamentEditSkeleton from "../TournamentEditSkeleton";
import DataTableSkeleton from "../VolunteerTableSkeleton";
import {
  getTournamentApplicationsSummary,
  getTournamentManagement,
} from "@/app/dal/tournaments/actions";
import AsyncTable from "../AsyncVolunteerTable";
export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournamentPromise = getTournamentManagement(slug);
  const applicationsPromise = getTournamentApplicationsSummary(slug);

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
        <TournamentEdit tournamentPromise={tournamentPromise} />
      </Suspense>

      <Separator />
      <h2 className="text-2xl">View Applications</h2>
      <Button>Export Applications</Button>
      <Suspense fallback={<DataTableSkeleton />}>
        <AsyncTable applicationsPromise={applicationsPromise} />
      </Suspense>
    </main>
  );
}

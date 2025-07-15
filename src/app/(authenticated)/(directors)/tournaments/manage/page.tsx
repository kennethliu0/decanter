import { tournaments, volunteers } from "@/app/data";
import TournamentEdit from "./TournamentEdit";
import { Separator } from "@/components/ui/separator";
import VolunteerApplicationEdit from "./VolunteerApplicationEdit";
import Link from "next/link";
import { DataTable } from "./DataTable";
import { columns } from "./VolunteerColumns";
import DataTableSkeleton from "./DataTableSkeleton";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import TournamentEditSkeleton from "./TournamentEditSkeleton";

export default function Home() {
  return (
    <main className="px-4 max-w-4xl mx-auto space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Tournament</h1>
        <Link href="/tournaments/manage">
          <span className="hover:underline text-muted-foreground">
            Back to all tournaments
          </span>
        </Link>
      </div>
      <Suspense fallback={<TournamentEditSkeleton />}>
        <TournamentEdit tournament={tournaments[3]} />
      </Suspense>

      <Separator />
      <h2 className="text-2xl">View Applications</h2>
      <Button>Export Applications</Button>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTable
          data={volunteers}
          columns={columns}
        />
      </Suspense>
    </main>
  );
}

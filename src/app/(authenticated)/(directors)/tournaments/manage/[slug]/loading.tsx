import Link from "next/link";
import TournamentEditSkeleton from "../TournamentEditSkeleton";
import { Separator } from "@/components/ui/separator";
import SkeletonTable from "../VolunteerTableSkeleton";

function LoadingPage() {
  return (
    <main className="px-4 max-w-4xl w-full mx-auto space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Tournament</h1>
        <Link href="/tournaments">
          <span className="hover:underline text-muted-foreground">
            Back to all tournaments
          </span>
        </Link>
      </div>
      <TournamentEditSkeleton />
      <Separator />
      <h2 className="text-2xl">View Applications</h2>
      <SkeletonTable />
    </main>
  );
}

export default LoadingPage;

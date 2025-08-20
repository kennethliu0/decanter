import Link from "next/link";
import TournamentEditSkeleton from "../TournamentEditSkeleton";
import { Separator } from "@/components/shadcn/separator";
import SkeletonTable from "../VolunteerTableSkeleton";
import InviteManagementSkeleton from "../InviteManagementSkeleton";
import { Label } from "@/components/shadcn/label";
import { Skeleton } from "@/components/shadcn/skeleton";

function LoadingPage() {
  return (
    <main className="p-4 max-w-4xl w-full mx-auto space-y-4 bg-background border rounded-xl shadow-lg">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Tournament</h1>
        <Link href="/dashboard">
          <span className="hover:underline text-muted-foreground">
            Back to dashboard
          </span>
        </Link>
      </div>
      <TournamentEditSkeleton />
      <Separator />
      <h2 className="text-2xl">View Applications</h2>
      <Label className="mb-2">Application Link </Label>
      <div className="flex w-full max-w-md items-center space-x-2">
        <Skeleton className="grow h-9" />
        <Skeleton className="h-9 w-9" />
      </div>
      <Skeleton className="h-9 w-42" />
      <SkeletonTable />
      <Separator />
      <h2 className="text-2xl">Invite Others to Manage Tournament</h2>
      <InviteManagementSkeleton />
    </main>
  );
}

export default LoadingPage;

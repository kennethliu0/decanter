import { Skeleton } from "@/components/shadcn/skeleton";

export default function TournamentAdminCardSkeleton() {
  return (
    <div className="min-w-xs w-full max-w-md border p-3 rounded-lg bg-card space-y-1">
      <div className="flex gap-2">
        <Skeleton className="w-[60px] h-[60px]" />
        <Skeleton className="h-5 w-50" />
      </div>
      <div className="flex justify-between gap-1 items-end">
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
    </div>
  );
}
//

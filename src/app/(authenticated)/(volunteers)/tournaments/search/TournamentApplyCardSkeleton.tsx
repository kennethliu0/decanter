import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

const TournamentApplyCardSkeleton = (props: Props) => {
  return (
    <div className="min-w-[312px] max-w-[400px] w-full border p-4 rounded-lg bg-card space-y-1">
      <div className="flex gap-2">
        <Skeleton className="w-[60px] h-[60px] rounded-sm" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-[22px] w-[100px]" />
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-4 w-[130px]" />
        </div>
        <div className="flex gap-1 items-center">
          <Skeleton className="w-[1.5em] h-[1.5em]" />
          <Skeleton className="w-16 h-8 rounded-md gap-1.5 px-3" />
        </div>
      </div>
    </div>
  );
};

export default TournamentApplyCardSkeleton;

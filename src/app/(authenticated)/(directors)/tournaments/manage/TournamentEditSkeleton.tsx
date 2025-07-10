import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TournamentEditSkeleton = () => {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-col sm:flex-row-reverse justify-between items-start">
        <div>
          <div className="mx-auto">Tournament Picture</div>
          <Skeleton className="w-32 h-32 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="name-skeleton">Name</Label>
            <Skeleton
              className="h-9 w-full rounded-md"
              id="name-skeleton"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-start">
            <div className="space-y-2">
              <Label htmlFor="location-skeleton">Location</Label>
              <Skeleton
                className="h-9 w-[200px] rounded-md"
                id="location-skeleton"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="division-skeleton">Division</Label>
              <div className="flex h-9 items-center gap-2">
                <Skeleton className="rounded-full h-4 w-4" />
                <Label>B</Label>
                <Skeleton className="rounded-full h-4 w-4" />
                <Label>C</Label>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-start">
            <div className="space-y-2">
              <Label htmlFor="start-date-skeleton">Tournament Start Date</Label>
              <Skeleton
                className="w-[280px] h-9 rounded-md"
                id="start-date-skeleton"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date-skeleton">Tournament End Date</Label>
              <Skeleton
                className="w-[280px] h-9 rounded-md"
                id="end-date-skeleton"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apply-date-skeleton">
              Volunteer Application Due Date
            </Label>
            <Skeleton
              className="w-[280px] h-9 rounded-md"
              id="apply-date-skeleton"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentEditSkeleton;

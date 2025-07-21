import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TournamentEditSkeleton = () => {
  return (
    <div className="space-y-4 text-sm w-full">
      <div className="flex flex-col sm:flex-row-reverse gap-y-2 gap-x-4 justify-between items-start">
        <div>
          <div className="mx-auto">Tournament Picture</div>
          <Skeleton className="w-32 h-32 rounded-lg" />
        </div>
        <div className="space-y-2 grow max-w-lg">
          <Label htmlFor="name-skeleton">Name</Label>
          <Skeleton
            className="h-9 w-full rounded-md"
            id="name-skeleton"
          />
          <Label htmlFor="website-skeleton">Website URL</Label>
          <Skeleton
            className="h-9 w-full rounded-md"
            id="website-skeleton"
          />
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="space-y-2">
              <Label htmlFor="location-skeleton">Location</Label>
              <Skeleton
                className="h-9 w-[200px] rounded-md"
                id="location-skeleton"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="division-skeleton">Division</Label>
              <Skeleton
                className="h-9 w-[58.033px] rounded-md"
                id="division-skeleton"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="space-y-2">
              <Label htmlFor="start-date-skeleton">Tournament Start Date</Label>
              <Skeleton
                className="w-[200px] h-9 rounded-md"
                id="start-date-skeleton"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date-skeleton">Tournament End Date</Label>
              <Skeleton
                className="w-[200px] h-9 rounded-md"
                id="end-date-skeleton"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="space-y-2">
              <Label htmlFor="apply-date-skeleton">
                Volunteer Application Due Date
              </Label>
              <Skeleton
                className="w-[200px] h-9 rounded-md"
                id="apply-date-skeleton"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-skeleton">Time</Label>
              <Skeleton
                className="w-25 h-9 rounded-md"
                id="time-skeleton"
              />
            </div>
          </div>
          <Skeleton className="h-[62px]" />
          <Skeleton className="h-[62px]" />
        </div>
      </div>
      <h2 className="text-xl">Edit Volunteer Application</h2>
      <div className="text-sm">
        <p>Volunteers already provide the following fields:</p>
        <ul>
          <li>- Name</li>
          <li>- Contact e-mail</li>
          <li>- School and graduation year</li>
          <li>- Notable achievements</li>
          <li>- Past volunteer experience</li>
          <li>- First four event preferences</li>
        </ul>
        <br />
        <p>
          Do not include information that would go in your onboarding form such
          as T-Shirt size. Use this form for additional info that you need to
          process an application (think ability to travel for in-person
          tournaments, whether they are competing in the Division C tournament
          while applying for Division B, etc).
        </p>
        <br />
        <h3 className="text-xl">Fields</h3>
      </div>
    </div>
  );
};

export default TournamentEditSkeleton;

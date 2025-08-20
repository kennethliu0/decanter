import { Label } from "@/components/shadcn/label";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function LoadingProfile() {
  return (
    <main className="max-w-2xl w-full mx-auto space-y-4 p-4 bg-background border rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold">Edit Volunteer Profile</h1>
      <div className="space-y-2">
        <Label>Name</Label>
        <Skeleton className="h-9" />
        <Label>Education</Label>
        <Skeleton className="h-9" />
        <Label>Bio</Label>
        <Skeleton className="h-21" />
        <Label>Experience</Label>
        <Skeleton className="h-21" />
        <Label>Division B Events</Label>
        <Skeleton className="h-36" />
        <Label>Division C Events</Label>
        <Skeleton className="h-36" />
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-[67px]" />
          <Skeleton className="h-9 w-[76px]" />
        </div>
      </div>
    </main>
  );
}

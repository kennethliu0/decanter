import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProfile() {
  return (
    <main className="max-w-2xl w-full mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Edit Volunteer Profile</h1>
      <div className="space-y-2">
        <Label>Name</Label>
        <Skeleton className="h-9" />
        <Label>Education</Label>
        <Skeleton className="h-9" />
        <Label>Bio</Label>
        <Skeleton className="h-30" />
        <Label>Experience</Label>
        <Skeleton className="h-30" />
        <Label>Division B Events</Label>
        <Skeleton className="h-36" />
        <Label>Division C Events</Label>
        <Skeleton className="h-36" />
      </div>
    </main>
  );
}

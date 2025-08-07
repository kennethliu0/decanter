import { Label } from "@/components/shadcn/label";
import { Skeleton } from "@/components/shadcn/skeleton";

type Props = {};

const InviteManagementSkeleton = (props: Props) => {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="space-y-1">
          <p>Currently added users:</p>
          <Skeleton className="h-5 w-60" />
          <Skeleton className="h-5 w-60" />
        </div>
      </div>
      <Label className="text-sm font-medium">Admin Access Link</Label>
      <div className="flex w-full max-w-md items-center space-x-2">
        <Skeleton className="grow h-9" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
};

export default InviteManagementSkeleton;

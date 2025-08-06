import { Skeleton } from "@/components/shadcn/skeleton";

const Loading = () => {
  return (
    <main>
      <div className="max-w-2xl w-full mx-auto space-y-2 px-4">
        <div className="flex justify-between">
          <div className="space-y-1 grow">
            <Skeleton className="h-5 max-w-30" />
            <Skeleton className="h-7 w-xs" />
            <Skeleton className="h-5 w-60" />
            <Skeleton className="h-5 w-2xs" />
          </div>
          <Skeleton className="h-32 w-32 hidden sm:block" />
        </div>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-36" />
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </main>
  );
};

export default Loading;

import MobileTournamentFilters from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentFiltersMobile";
import { Pagination } from "@/components/ui/pagination";
import Search from "@/components/ui/Search";
import TournamentFilters from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentFilters";
import TournamentTable from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentTable";
import TournamentTableSkeleton from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentTableSkeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    query?: string;
    page?: number;
    location?: string[] | string;
    division?: ("B" | "C")[] | "B" | "C";
    startDateAfterISO?: string;
    startDateBeforeISO?: string;
    applyDateAfterISO?: string;
    sort?: string;
  }>;
};

const clearTime = (date: Date) => {
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const MAX_DATE = new Date(8640000000000000);

const retrieveDate = (
  searchParams: any,
  param: string,
  fallback: Date,
): Date => {
  return searchParams[param] ?
      clearTime(new Date(searchParams[param]))
    : fallback;
};

const Page = async (props: Props) => {
  const today = clearTime(new Date());

  const searchParams = await props.searchParams;
  const startDateAfter = retrieveDate(searchParams, "startDateAfter", today);
  const startDateBefore = retrieveDate(
    searchParams,
    "startDateBefore",
    MAX_DATE,
  );
  const applyDateAfter = retrieveDate(
    searchParams,
    "applyDeadlineAfter",
    today,
  );
  const sort = searchParams?.sort;
  return (
    <main className="flex p-4 gap-4 justify-center grow">
      {/* for desktop layouts */}
      <TournamentFilters
        type="multiple"
        className="min-w-[280px] shrink-0 hidden md:block"
      />
      <div className="max-w-5xl w-full shrink flex flex-col gap-2">
        <div className="flex">
          {/* For mobile layouts*/}
          <MobileTournamentFilters />
          <Search
            className="grow m-auto"
            placeholder="Search tournaments..."
          />
        </div>
        {startDateAfter
          && startDateBefore
          && startDateAfter > startDateBefore && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Invalid filters</AlertTitle>
              <AlertDescription>
                "Start Date After" field cannot be a date greater than "Start
                Date Before"
              </AlertDescription>
            </Alert>
          )}
        <Suspense fallback={<TournamentTableSkeleton />}>
          <TournamentTable
            query={searchParams?.query}
            filters={{
              location: searchParams?.location,
              division: searchParams?.division,
              startDateAfter,
              startDateBefore,
              applyDeadlineAfter: applyDateAfter,
            }}
            currentPage={searchParams?.page || 1}
            sort={sort}
          />
        </Suspense>
      </div>
    </main>
  );
};

export default Page;

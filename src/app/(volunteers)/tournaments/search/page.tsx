import MobileTournamentFilters from "@/app/(volunteers)/tournaments/search/TournamentFiltersMobile";
import { Pagination } from "@/components/ui/pagination";
import Search from "@/components/ui/Search";
import TournamentFilters from "@/app/(volunteers)/tournaments/search/TournamentFilters";
import TournamentSortSelect from "@/app/(volunteers)/tournaments/search/TournamentSortSelect";
import TournamentTable from "@/app/(volunteers)/tournaments/search/TournamentTable";
import TournamentTableSkeleton from "@/app/(volunteers)/tournaments/search/TournamentTableSkeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
// import Table from "@/app/ui/invoices/table";
// import { CreateInvoice } from "@/app/ui/invoices/buttons";
// import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

type Props = {
  searchParams?: Promise<{
    query?: string;
    page?: number;
    location?: string[] | string;
    division?: ("b" | "c")[] | "b" | "c";
    startDateAfterISO?: string;
    startDateBeforeISO?: string;
    applyDateAfterISO?: string;
  }>;
};

const Page = async (props: Props) => {
  const clearTime = (date: Date) => {
    date.setHours(0, 0, 0, 0);
    return date;
  };
  const today = clearTime(new Date());
  const retrieveDate = (searchParams: any, param: string, fallback?: Date) => {
    return (
      searchParams ?
        searchParams[param] ?
          clearTime(new Date(searchParams[param]))
        : fallback
      : fallback
    );
  };

  const searchParams = await props.searchParams;
  const query = searchParams?.query;
  const currentPage = searchParams?.page || 1;
  const location = searchParams?.location;
  const division = searchParams?.division;
  const startDateAfter = retrieveDate(searchParams, "startDateAfterISO", today);
  const startDateBefore = retrieveDate(searchParams, "startDateBeforeISO");
  const applyDateAfter = retrieveDate(searchParams, "applyDateAfterISO", today);
  return (
    <div className="flex p-4 gap-4 justify-center">
      {/* for desktop layouts */}
      <TournamentFilters
        type="multiple"
        className="min-w-[280px] shrink-0 hidden md:block"
      />
      <div className="max-w-5xl shrink flex flex-col gap-2">
        <div className="flex">
          {/* For mobile layouts*/}
          <MobileTournamentFilters />
          <Search
            className="grow m-auto"
            placeholder="Search tournaments..."
          />
        </div>
        <div className="grid columns-3 items-center">
          <div className="col-[2] justify-self-center">6 tournaments</div>
          <div className="col-[3] justify-self-end">
            <TournamentSortSelect />
          </div>
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
            query={query}
            location={location}
            division={division}
            startDateAfter={startDateAfter}
            startDateBefore={startDateBefore}
            currentPage={currentPage}
          />
        </Suspense>
        <Pagination
          totalPages={8}
          className="mt-5 flex w-full justify-center"
        />
      </div>
    </div>
  );
};

export default Page;

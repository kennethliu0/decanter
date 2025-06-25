import MobileTournamentFilters from "@/app/components/MobileTournamentFilters";
import Pagination from "@/app/components/Pagination";
import Search from "@/app/components/Search";
import TournamentFilters from "@/app/components/TournamentFilters";
import TournamentSortSelect from "@/app/components/TournamentSortSelect";
// import Table from "@/app/ui/invoices/table";
// import { CreateInvoice } from "@/app/ui/invoices/buttons";
// import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

type Props = {
  searchParams?: Promise<{
    query?: string;
    location: string;
    division?: "B" | "C";
  }>;
};
const Page = async (props: Props) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className="flex p-4 gap-4 justify-center">
      {/* for desktop layouts */}
      <TournamentFilters
        type="multiple"
        className="w-xs hidden sm:block"
      />
      <div className="w-5xl flex flex-col">
        <div className="flex">
          {/* For mobile layouts*/}
          <MobileTournamentFilters />
          <Search
            className="grow-1 m-auto"
            placeholder="Search tournaments..."
          />
        </div>
        <div className="grid columns-3 py-4 items-center">
          <div className="col-[2] justify-self-center">5 tournaments</div>
          <div className="col-[3] justify-self-end">
            <TournamentSortSelect />
          </div>
        </div>
        {/*  <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> */}
        <Pagination
          totalPages={8}
          className="mt-5 flex w-full justify-center"
        />
      </div>
    </div>
  );
};

export default Page;

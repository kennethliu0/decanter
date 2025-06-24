import Pagination from "@/app/components/Pagination";
import Search from "@/app/components/Search";
import TournamentFilters from "@/app/components/TournamentFilters";
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
      <TournamentFilters
        type="multiple"
        className="w-xs"
      />
      <div className="w-5xl">
        <Search placeholder="Search tournaments..." />
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

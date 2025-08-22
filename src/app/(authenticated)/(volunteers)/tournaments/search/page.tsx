import MobileTournamentFilters from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentFiltersMobile";
import Search from "@/components/custom/Search";
import TournamentFilters from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentFilters";
import { Suspense } from "react";
import TournamentTableSkeleton from "./TournamentTableSkeleton";
import TournamentTableServer from "./TournamentTableServer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournament Search",
  description: "Search for tournaments to apply to.",
};
type Props = {};
const Page = (props: Props) => {
  return (
    <main className="grow flex p-4 gap-4 justify-center">
      {/* for desktop layouts */}
      <TournamentFilters
        type="multiple"
        className="bg-card w-xs shrink-0 hidden md:block px-6 py-2 self-start rounded-xl border shadow-sm"
      />
      <div className="max-w-5xl w-full shrink flex flex-col gap-2 self-stretch">
        <div className="flex">
          {/* For mobile layouts*/}
          <MobileTournamentFilters />
          <Search
            className="bg-card dark:bg-card shadow-sm"
            placeholder="Search tournaments..."
          />
        </div>
        <Suspense fallback={<TournamentTableSkeleton />}>
          <TournamentTableServer />
        </Suspense>
      </div>
    </main>
  );
};

export default Page;

import MobileTournamentFilters from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentFiltersMobile";
import Search from "@/components/custom/Search";
import TournamentFilters from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentFilters";
import { Suspense } from "react";
import TournamentTableSkeleton from "./TournamentTableSkeleton";
import TournamentTableServer from "./TournamentTableServer";
type Props = {};
const Page = (props: Props) => {
  return (
    <main className="grow flex p-4 gap-4 justify-center">
      {/* for desktop layouts */}
      <TournamentFilters
        type="multiple"
        className="max-w-2xs w-full shrink-0 hidden md:block"
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
        <Suspense fallback={<TournamentTableSkeleton />}>
          <TournamentTableServer />
        </Suspense>
      </div>
    </main>
  );
};

export default Page;

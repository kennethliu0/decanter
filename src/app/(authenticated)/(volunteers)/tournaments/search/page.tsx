import MobileTournamentFilters from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentFiltersMobile";
import Search from "@/components/ui/Search";
import TournamentFilters from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentFilters";
import TournamentTable from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentTable";
import { getTournaments } from "@/dal/tournament-application";
import { redirect } from "next/navigation";
import { CONTACT_EMAIL } from "@/lib/config";
import { ERROR_CODES } from "@/lib/errors";
type Props = {};
const Page = async (props: Props) => {
  const { data = [], error } = await getTournaments();
  if (error) {
    if (error.code === ERROR_CODES.AUTH_ERROR) {
      redirect("/login");
    } else {
      return (
        <main className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-muted/30 text-center space-y-2">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">
            Tournaments could not be retrieved. Please try again. If the issue
            persists, clear your browser cache or contact us at {CONTACT_EMAIL}.
          </p>
        </main>
      );
    }
  }

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
        <TournamentTable tournaments={data} />
      </div>
    </main>
  );
};

export default Page;

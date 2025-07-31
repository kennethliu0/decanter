import { getTournaments } from "@/dal/tournament-application";
import { CONTACT_EMAIL } from "@/lib/config";
import { ERROR_CODES } from "@/lib/errors";
import { redirect } from "next/navigation";
import TournamentTable from "./TournamentTable";

type Props = {};

const TournamentTableServer = async (props: Props) => {
  const { data = [], error } = await getTournaments();
  if (error) {
    if (error.code === ERROR_CODES.AUTH_ERROR) {
      redirect("/login");
    } else {
      return (
        <main className="w-full max-w-2xl mx-auto rounded-xl p-4 text-center space-y-2">
          <h2 className="text-xl font-semibold text-destructive">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">
            Tournaments could not be retrieved. Please try again. If the issue
            persists, clear your browser cache or contact us at {CONTACT_EMAIL}.
          </p>
        </main>
      );
    }
  }
  return <TournamentTable tournaments={data} />;
};

export default TournamentTableServer;

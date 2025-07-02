import { tournaments } from "@/app/data";
import TournamentEdit from "./TournamentEdit";
import { Separator } from "@/components/ui/separator";
import VolunteerApplicationEdit from "./VolunteerApplicationEdit";

export default function Home() {
  return (
    <main className="px-4 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Manage Tournament</h1>
      <TournamentEdit tournament={tournaments[3]} />
      <Separator className="my-4" />
      <VolunteerApplicationEdit />
      <Separator className="my-4" />
      <div>
        <h2 className="text-2xl">View Applications</h2>
      </div>
    </main>
  );
}

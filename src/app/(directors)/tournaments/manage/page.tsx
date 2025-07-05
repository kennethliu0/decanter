import { tournaments, volunteers } from "@/app/data";
import TournamentEdit from "./TournamentEdit";
import { Separator } from "@/components/ui/separator";
import VolunteerApplicationEdit from "./VolunteerApplicationEdit";
import Link from "next/link";
import { DataTable } from "./DataTable";
import { columns } from "./VolunteerColumns";

export default function Home() {
  return (
    <main className="px-4 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Tournament</h1>
        <Link href="/tournaments/manage">
          <span className="hover:underline text-muted-foreground">
            Back to all tournaments
          </span>
        </Link>
      </div>
      <TournamentEdit tournament={tournaments[3]} />
      <Separator className="my-4" />
      <h2 className="text-2xl">Edit Volunteer Application</h2>
      <VolunteerApplicationEdit
        fields={[
          {
            prompt:
              "I understand that I will be responsible for supervising and grading the test after the invitational period has completed. ",
            type: "input",
            id: "0",
          },
        ]}
      />
      <Separator className="my-4" />
      <h2 className="text-2xl">View Applications</h2>
      <DataTable
        data={volunteers}
        columns={columns}
      />
    </main>
  );
}

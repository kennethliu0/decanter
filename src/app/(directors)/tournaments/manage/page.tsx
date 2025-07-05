import { tournaments, volunteers } from "@/app/data";
import TournamentEdit from "./TournamentEdit";
import { Separator } from "@/components/ui/separator";
import VolunteerApplicationEdit from "./VolunteerApplicationEdit";
import Link from "next/link";
import { DataTable } from "./DataTable";
import { columns } from "./VolunteerColumns";
import DataTableSkeleton from "./DataTableSkeleton";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="px-4 max-w-4xl mx-auto space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Tournament</h1>
        <Link href="/tournaments/manage">
          <span className="hover:underline text-muted-foreground">
            Back to all tournaments
          </span>
        </Link>
      </div>
      <TournamentEdit tournament={tournaments[3]} />
      <Separator />
      <h2 className="text-2xl">Edit Volunteer Application</h2>
      <div className="text-sm">
        <p>Volunteers already provide the following fields:</p>
        <ul>
          <li>- Name</li>
          <li>- Contact e-mail</li>
          <li>- School and graduation year</li>
          <li>- Notable achievements</li>
          <li>- Past volunteer experience</li>
          <li>- First four event preferences</li>
        </ul>
        <p>
          Do not include information that would go in your onboarding form such
          as T-Shirt size. Use this form for additional info that you need to
          process an application (think ability to travel for in-person
          tournaments, whether they are competing in the Division C tournament
          while applying for Division B, etc).
        </p>
        <h3 className="text-xl py-2">Fields</h3>
      </div>
      <Suspense
        fallback={
          <div className="w-full pb-2">
            <LoaderCircle className="mx-auto animate-spin" />
          </div>
        }
      >
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
      </Suspense>

      <Separator />
      <h2 className="text-2xl">View Applications</h2>
      <Button>Export Applications</Button>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTable
          data={volunteers}
          columns={columns}
        />
      </Suspense>
    </main>
  );
}

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import TournamentEdit from "../TournamentEdit";
import ApplicationsDownloadButton from "../ApplicationsDownloadButton";
import { ERROR_CODES } from "@/lib/errors";
import { notFound, redirect } from "next/navigation";
import { DataTable } from "../DataTable";
import { columns } from "../VolunteerColumns";
import {
  getApplicationsCSV,
  getInviteManagement,
  getTournamentManagement,
} from "@/dal/tournament-management";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/config";
import InviteManagement from "../InviteManagement";
export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const applicationsPromise = getApplicationsCSV(slug);

  const inviteLinkPromise = getInviteManagement(slug);

  const { data, error } = await getTournamentManagement(slug);
  if (error) {
    switch (error.code) {
      case ERROR_CODES.UNAUTHORIZED:
        redirect("/login");
      case ERROR_CODES.NOT_FOUND:
        notFound();
      case ERROR_CODES.FORBIDDEN:
        redirect("/tournaments");
      default:
        return (
          <main className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-muted/30 text-center space-y-2">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground">
              Your tournament could not be retrieved. Please try again. If the
              issue persists, clear your browser cache or contact us at{" "}
              {CONTACT_EMAIL}.
            </p>
          </main>
        );
    }
  }
  if (!data?.tournament || !data?.applications) {
    notFound();
  }
  const { tournament, applications } = data;

  return (
    <main className="px-4 max-w-4xl w-full mx-auto space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Tournament</h1>
        <Link href="/tournaments">
          <span className="hover:underline text-muted-foreground">
            Back to all tournaments
          </span>
        </Link>
      </div>
      <TournamentEdit tournament={tournament} />
      <Separator />
      <h2 className="text-2xl">View Applications</h2>
      <Suspense fallback={<Button>Loading Applications</Button>}>
        <ApplicationsDownloadButton applicationsPromise={applicationsPromise} />
      </Suspense>
      <DataTable
        data={applications}
        columns={columns}
      />
      <Separator />
      <h2 className="text-2xl">Invite Others to Manage Tournament</h2>
      <InviteManagement invitePromise={inviteLinkPromise} />
    </main>
  );
}

import { Separator } from "@/components/shadcn/separator";
import Link from "next/link";
import TournamentEdit from "../TournamentEdit";
import ApplicationsDownloadButton from "../ApplicationsDownloadButton";
import { ERROR_CODES } from "@/lib/errors";
import { notFound, redirect } from "next/navigation";
import { DataTable } from "../DataTable";
import { columns } from "../VolunteerColumns";
import {
  getApplicationsCSV,
  getTournamentManagement,
} from "@/dal/tournament-management";
import { getInviteManagement } from "@/dal/tournament-invites";
import { Suspense } from "react";
import { Button } from "@/components/shadcn/button";
import { CONTACT_EMAIL } from "@/lib/config";
import InviteManagement from "../InviteManagement";
import { CopyableLink } from "@/components/custom/copyable-link";
import { Metadata } from "next";
import { fetchTournamentSummary } from "@/dal/tournament-management-queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (typeof slug !== "string") {
    return {
      title: "Edit Tournament",
      description:
        "Edit the details of a tournament, change application fields, or view volunteer applications",
    };
  }
  const res = await fetchTournamentSummary(slug);
  const tournament = res.data;
  if (
    res.error
    || !tournament?.name
    || !tournament?.division
    || !tournament?.image_url
  ) {
    return {
      title: "Edit Tournament",
      description:
        "Edit the details of a tournament, change application fields, or view volunteer applications",
    };
  }
  return {
    title: `Edit ${tournament.name} (${tournament.division})`,
    description: `Edit the details ${tournament.name} (Division ${tournament.division}).`,
    openGraph: {
      images: [
        {
          url: tournament.image_url,
          width: 128,
          height: 128,
          alt: tournament.name,
        },
      ],
    },
  };
}

export default async function Home({ params }: Props) {
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
          <main className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-background text-center space-y-2">
            <h2 className="text-xl font-semibold text-destructive">
              Something went wrong
            </h2>
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
    <main className="p-4 max-w-4xl w-full mx-auto space-y-4 bg-background border rounded-xl shadow-lg">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Tournament</h1>
        <Link href="/dashboard">
          <span className="hover:underline text-muted-foreground">
            Back to dashboard
          </span>
        </Link>
      </div>
      <TournamentEdit tournament={tournament} />
      <Separator />
      <h2 className="text-2xl">View Applications</h2>
      <CopyableLink
        link={`${process.env.NEXT_PUBLIC_SITE_URL!}/tournaments/apply/${slug}`}
        label="Application Link"
      />
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

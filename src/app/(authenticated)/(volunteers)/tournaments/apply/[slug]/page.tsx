import ApplyForm from "./ApplyForm";
import ErrorComponent from "@/components/ui/ErrorComponent";
import { ERROR_CODES } from "@/lib/errors";
import { CONTACT_EMAIL } from "@/lib/config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getSavedTournamentApplication,
  getTournamentApplicationInfo,
} from "@/dal/tournament-application";
import { getEventPreferences } from "@/dal/profile";

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [applicationInfo, savedApplication, eventPreferences] =
    await Promise.all([
      getTournamentApplicationInfo(slug),
      getSavedTournamentApplication(slug),
      getEventPreferences(),
    ]);

  if (applicationInfo.error || !applicationInfo.data?.application) {
    return (
      <main className="grow">
        <ErrorComponent
          error={
            applicationInfo.error || {
              message: "Error retrieving application",
              code: ERROR_CODES.SERVER_ERROR,
            }
          }
          link={{ href: "/tournaments/search", label: "Back to Search" }}
        />
      </main>
    );
  }
  if (
    eventPreferences.error?.code === ERROR_CODES.VOLUNTEER_PROFILE_NOT_FOUND
  ) {
    return (
      <main className="grow">
        <ErrorComponent
          error={eventPreferences.error}
          link={{ href: "/profile", label: "Create Volunteer Profile" }}
        />
      </main>
    );
  }

  if (savedApplication.error?.code === ERROR_CODES.ALREADY_SUBMITTED) {
    return (
      <main className="grow">
        <div className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-muted/30 text-center space-y-2">
          <h2 className="text-xl font-semibold">
            Application Already Submitted
          </h2>
          <p className="text-muted-foreground">
            You’ve already submitted an application for this tournament. If you
            think this is a mistake, contact us at {CONTACT_EMAIL}.
          </p>
          <Link href="/tournaments/search">
            <Button variant="secondary">Back to Search</Button>
          </Link>
        </div>
      </main>
    );
  }
  const toast =
    savedApplication.data?.application ? ["application", "success"]
    : savedApplication.error ? ["application", "error"]
    : eventPreferences.data ? ["preferences", "success"]
    : ["preferences", "error"];

  return (
    <main className="grow">
      <ApplyForm
        application={applicationInfo?.data?.application}
        preferences={eventPreferences?.data}
        savedApplication={savedApplication?.data?.application}
        toastProperty={toast[0]}
        toastStatus={toast[1]}
      />
    </main>
  );
}

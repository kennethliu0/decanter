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
      <main>
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
      <main>
        <ErrorComponent
          error={eventPreferences.error}
          link={{ href: "/profile", label: "Create Volunteer Profile" }}
        />
      </main>
    );
  }

  const toast =
    savedApplication.data?.application ? ["application", "success"]
    : savedApplication.error ? ["application", "error"]
    : eventPreferences.data ? ["preferences", "success"]
    : ["preferences", "error"];

  return (
    <main>
      <ApplyForm
        application={applicationInfo?.data?.application}
        preferences={eventPreferences?.data}
        savedApplication={savedApplication?.data?.application}
        submitted={savedApplication?.data?.submitted ?? false}
        toastProperty={toast[0]}
        toastStatus={toast[1]}
      />
    </main>
  );
}

import ApplyForm from "./ApplyForm";
import ErrorComponent from "./ErrorComponent";
import { ERROR_CODES } from "@/lib/errors";
import {
  getSavedTournamentApplication,
  getTournamentApplicationInfo,
} from "@/dal/tournament-application";
import { getEventPreferences } from "@/dal/profile";
import { fetchTournamentSummary } from "@/dal/tournament-management-queries";
import { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (typeof slug !== "string") {
    return {
      title: "Apply to Tournament",
      description: "Apply to volunteer for a tournament.",
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
      title: "Apply to Tournament",
      description: "Apply to volunteer for a tournament.",
    };
  }
  return {
    title: `Apply to ${tournament.name} (${tournament.division})`,
    description: `Apply to volunteer for ${tournament.name} (Division ${tournament.division}).`,
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

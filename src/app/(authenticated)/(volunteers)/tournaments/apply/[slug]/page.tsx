import { getTournamentApplicationInfo } from "@/app/dal/tournaments/actions";
import ApplyForm from "./ApplyForm";
import { getEventPreferences } from "@/app/dal/volunteer-profiles/actions";

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const applicationPromise = getTournamentApplicationInfo(slug);
  const preferencesPromise = getEventPreferences();

  return (
    <main className="grow">
      <ApplyForm
        applicationPromise={applicationPromise}
        preferencesPromise={preferencesPromise}
      />
    </main>
  );
}

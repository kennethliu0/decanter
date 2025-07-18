import { getTournamentApplicationInfo } from "@/app/dal/tournaments/actions";
import ApplyForm from "./ApplyForm";

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const applicationPromise = getTournamentApplicationInfo(slug);

  return (
    <main className="grow">
      <ApplyForm applicationPromise={applicationPromise} />
    </main>
  );
}

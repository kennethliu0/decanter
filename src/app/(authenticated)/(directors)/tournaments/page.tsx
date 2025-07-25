import Link from "next/link";
import TournamentAdminTable from "./TournamentAdminTable";
import { getTournamentsManagedByUser } from "@/app/dal/tournaments/actions";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="grow max-w-4xl w-full  mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Tournament Director Dashboard</h1>
      <TournamentAdminTable />
      <Link href="/tournaments/manage/new">
        <Button>Create New Tournaments</Button>
      </Link>
    </main>
  );
}

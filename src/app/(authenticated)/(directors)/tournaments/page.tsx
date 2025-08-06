import Link from "next/link";
import TournamentAdminTable from "./TournamentAdminTable";
import { Button } from "@/components/shadcn/button";
import { Suspense } from "react";
import TournamentAdminTableSkeleton from "./TournamentAdminTableSkeleton";

export default function Home() {
  return (
    <main className="max-w-4xl w-full mx-auto space-y-8 px-4">
      <h1 className="text-3xl font-bold">Tournament Director Dashboard</h1>
      <Suspense fallback={<TournamentAdminTableSkeleton />}>
        <TournamentAdminTable />
      </Suspense>
      <Link href="/tournaments/manage/new">
        <Button>Create New Tournaments</Button>
      </Link>
    </main>
  );
}

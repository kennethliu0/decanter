import { Suspense } from "react";
import TournamentAdminTableSkeleton from "../(directors)/tournaments/TournamentAdminTableSkeleton";
import TournamentAdminTable from "../(directors)/tournaments/TournamentAdminTable";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import TournamentsSummary from "./TournamentsSummary";

type Props = {};

const page = (props: Props) => {
  return (
    <main className="max-w-4xl w-full mx-auto space-y-8 px-4">
      <h1 className="text-3xl font-bold">Welcome to Decanter!</h1>
      <Suspense>
        <TournamentsSummary />
      </Suspense>
      <Suspense fallback={<TournamentAdminTableSkeleton />}>
        <TournamentAdminTable />
      </Suspense>
      <Button asChild>
        <Link href="/tournaments/manage/new">Create New Tournaments</Link>
      </Button>
    </main>
  );
};

export default page;

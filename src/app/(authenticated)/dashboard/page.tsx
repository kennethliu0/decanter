import { Suspense } from "react";
import TournamentAdminTableSkeleton from "./TournamentAdminTableSkeleton";
import TournamentAdminTable from "./TournamentAdminTable";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import TournamentsSummary from "./TournamentsSummary";
import { Metadata } from "next";

type Props = {};

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to Decanter!",
};

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

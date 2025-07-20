import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="grow">
      <div className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-muted/30 text-center space-y-2">
        <h2 className="text-xl font-semibold">Application Submitted</h2>
        <p className="text-muted-foreground">
          Your application has been successfully submitted. You will hear back
          from tournament directors directly if you are selected to volunteer
          for this tournament.
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Link href="/tournaments/search">
            <Button variant="secondary">Back to Search</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

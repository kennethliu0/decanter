import { Button } from "@/components/shadcn/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application Submitted",
  description: "Your application has been successfully submitted.",
};

export default function Page() {
  return (
    <main className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-muted/30 text-center space-y-2">
      <h2 className="text-xl font-semibold">Application Submitted</h2>
      <p className="text-muted-foreground">
        Your application has been successfully submitted. You will hear back
        from tournament directors directly if you are selected to volunteer for
        this tournament.
      </p>
      <Button
        variant="secondary"
        asChild
      >
        <Link href="/tournaments/search">Back to Search</Link>
      </Button>
    </main>
  );
}

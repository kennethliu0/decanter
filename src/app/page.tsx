import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full grow flex flex-col items-center">
        <div className="w-full max-w-2xl p-4 flex-col gap-8 items-start">
          <div>
            <h1 className="text-4xl">Decanter</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

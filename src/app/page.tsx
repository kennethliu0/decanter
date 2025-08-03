import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full grow flex flex-col items-center">
        <div className="flex flex-col items-center justify-between w-full px-4 py-10 bg-[radial-gradient(circle_at_50%_50%,var(--muted),transparent_30%)]">
          <div className="relative order-first ">
            <img src='/hero_header.svg' alt = "logo" className="w-full"/>
          </div>
        </div>
        <div className="relative px-20 py-3">
          <h1 className="text-center text-6xl text-primary font-bold break-words">Seamless Volunteering</h1>
          <p className="text-center text-1xl py-2 break-words">An open source platform connecting Science Olympiad tournaments to volunteers nationwide.</p>
        </div>
        <div className="w-full flex gap-4 place-content-center-safe">
            <Link href="/signup">
              <Button size="lg">Sign Up Today</Button>
            </Link>
          </div>
      </main>
    </>
  );
}

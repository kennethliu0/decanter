import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="absolute opacity-15 min-w-screen min-h-full bg-[url(/background_pattern.svg)]"></div>
      <Header />
      <main className="w-full grow flex flex-col items-center p-5 ">
        <div className="relative flex flex-col items-center w-full bg-[radial-gradient(circle_at_50%_50%,var(--muted),transparent_35%)]">
          <div className="">
            <img src='/hero_banner.svg' alt = "logo" className="relative dark:invert-95"/> 
          </div>
        </div>
        <div className="relative">
            <h1 className="text-center xl:text-7xl text-4xl md:text-5xl text-primary font-bold break-words">Seamless Volunteering</h1>
            <p className="text-center text-1xl py-2 break-words">An open source platform connecting Science Olympiad tournaments to volunteers nationwide.</p>
        </div>
        <div className="w-full flex gap-4 place-content-center-safe">
            <Link href="/login">
              <Button size="sm" className="text-bold">Sign Up Today</Button>
            </Link>
        </div>
      </main>
    </>
  );
}

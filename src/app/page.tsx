import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full grow flex flex-col items-center p-5 ">
        <div className="absolute opacity-25 min-w-screen min-h-screen bg-[url(/background_pattern.svg)]"></div>
        <div className="relative flex flex-col items-center w-full py-12 bg-[radial-gradient(circle_at_50%_50%,var(--muted),transparent_40%)]">
          <div className="absolute top-1/2 left-1/2 max-w-64 w-[16%] aspect-square bg-primary transform -translate-x-1/2 -translate-y-1/2 blur rounded-4xl"></div> 
          <div className="">
            <img src='/hero_banner.svg' alt = "logo" className="relative"/> 
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

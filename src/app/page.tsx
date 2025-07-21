import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";
import { getProfile } from "@/app/dal/volunteer-profiles/actions";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full grow flex flex-col items-center">
        <div className="w-full">

          <div className="px-20 py-3 ">
            <h1 className="text-4xl font-bold text-center break-words py-2">Join the Perfect Tournament.</h1>
            <p className="text-1xl text-center break-words">An open source tool for volunteers to seamlessly find and one-click apply to tournaments.</p>
          </div>
          <div className="w-full flex gap-4 place-content-center-safe">
            <Link href="/signup">
              <Button>Sign Up Today</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

import { Button } from "@/components/shadcn/button";
import Header from "@/components/custom/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main
        className="w-full grow flex flex-col items-center justify-center px-5"
        style={{
          backgroundImage: `
    linear-gradient(to right, var(--muted) 1px, transparent 1px),
    linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
  `,
          backgroundSize: "20px 20px",
          WebkitMaskImage: `
    linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)
  `,
          maskImage: `
    linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)
  `,
        }}
      >
        <div className="relative flex flex-col items-center w-full">
          <div className="">
            <img
              src="/hero_banner.svg"
              draggable="false"
              alt="logo"
              className="relative dark:invert-95 size-50 xs:size-112"
              style={{
                userSelect: "none",
              }}
            />
          </div>
        </div>
        <div className="relative">
          <h1 className="text-center xl:text-7xl text-4xl md:text-5xl text-primary font-bold break-words">
            Seamless Volunteering
          </h1>
          <p className="text-center text-1xl py-2 break-words">
            An open source platform connecting Science Olympiad tournaments to
            volunteers nationwide.
          </p>
        </div>
        <div className="w-full flex gap-4 place-content-center-safe">
          <Button
            size="sm"
            className="font-semibold"
            asChild
          >
            <Link href="/login">Sign Up Today</Link>
          </Button>
        </div>
      </main>
    </>
  );
}

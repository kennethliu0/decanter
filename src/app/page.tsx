import { Button } from "@/components/shadcn/button";
import Header from "@/components/custom/Header";
import Link from "next/link";
import { Card } from "@/components/shadcn/card";
import { Clock, Search, Target, Users } from "lucide-react";

const cards = [
  {
    title: "Tournament Search",
    description: "Find and filter tournaments near you and apply to volunteer.",
    icon: Search,
  },
  {
    title: "Volunteer Profile",
    description:
      "Only enter your profile info once, regardless of how many tournaments you apply to.",
    icon: Users,
  },
  {
    title: "Quick Application Setup",
    description:
      "Quickly set up your application for each tournament and get back to director tasks.",
    icon: Clock,
  },
  {
    title: "Applications Export",
    description:
      "Easily export to CSV (compatible with Google Sheets and Excel) to share with tournament directors.",
    icon: Target,
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full max-w-6xl mx-auto grow px-5">
        <section className="flex flex-col lg:flex-row-reverse items-center justify-center pt-20 pb-10 lg:pb-20">
          <img
            src="/hero_banner.svg"
            draggable="false"
            alt="logo"
            className="dark:invert-95 size-64 sm:size-120 select-none"
          />
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
            <h1 className="text-4xl lg:text-5xl xl:text-8xl text-primary font-bold">
              Seamless Volunteering
            </h1>
            <p className="text-lg py-2 max-w-120 text-muted-foreground">
              Discover the free platform connecting Science Olympiad tournaments
              to volunteers nationwide.
            </p>
            <Button
              className="font-bold text-accent text-lg"
              asChild
            >
              <Link href="/login">Join Today</Link>
            </Button>
          </div>
        </section>
        <section className="flex flex-col items-stretch xs:flex-row xs:justify-stretch gap-2">
          {cards.map((card) => (
            <Card
              key={card.title}
              className="p-4 flex-1"
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <card.icon className="h-6 w-6" />
                  <h2 className="text-lg font-bold">{card.title}</h2>
                </div>
                <p className="text-sm">{card.description}</p>
              </div>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
}

import { jay } from "@/app/data";
import { ProfileCard } from "./ProfileCard";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto">
      <div className="px-4 flex justify-start items-center gap-2">
        <h1 className="text-3xl font-bold">Volunteer Profile</h1>
        <Link href="/profile/edit">
          <Button variant="ghost">
            <Pencil />
          </Button>
        </Link>
      </div>
      <ProfileCard user={jay} />
    </main>
  );
}

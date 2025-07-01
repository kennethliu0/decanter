import { jay } from "@/app/data";
import { ProfileCard } from "./ProfileCard";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto">
      <div className="flex justify-start items-center gap-2">
        <h1 className="pl-2 text-3xl">Volunteer Profile</h1>
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

import { ProfileCard } from "./ProfileCard";
import { jay } from "@/app/data";

export default function Home() {
  return (
    <div className="h-full">
      <ProfileCard user={jay}></ProfileCard>
    </div>
  );
}

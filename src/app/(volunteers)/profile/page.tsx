import { jay } from "@/app/data";
import { ProfileCard } from "./ProfileCard";

export default function Home() {
  return (
    <div>
      <ProfileCard user={jay} />
    </div>
  );
}

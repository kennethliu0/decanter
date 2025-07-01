import { jay } from "@/app/data";
import ProfileCardEdit from "./ProfileCardEdit";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="pl-2 text-3xl">Edit Profile</h1>
      <ProfileCardEdit user={jay} />
    </main>
  );
}

import { jay } from "@/app/data";
import ProfileCardEdit from "./ProfileCardEdit";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="px-4 text-3xl font-bold">Edit Volunteer Profile</h1>
      <ProfileCardEdit user={jay} />
    </main>
  );
}

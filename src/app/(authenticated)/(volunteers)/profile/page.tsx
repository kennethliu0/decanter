import ProfileCardEdit from "./ProfileCardEdit";
import { getProfile } from "@/app/dal/volunteer-profiles/actions";

export default function Home() {
  const profilePromise = getProfile();
  return (
    <main className="max-w-2xl w-full mx-auto grow space-y-4">
      <h1 className="px-4 text-3xl font-bold">Edit Volunteer Profile</h1>
      <ProfileCardEdit profilePromise={profilePromise} />
    </main>
  );
}

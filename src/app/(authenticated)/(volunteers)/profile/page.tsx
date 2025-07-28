import { getProfile } from "@/dal/profile";
import ProfileCardEdit from "./ProfileCardEdit";
import { ERROR_CODES } from "@/lib/errors";
import { redirect } from "next/navigation";
import { CONTACT_EMAIL } from "@/lib/config";

export default async function Home() {
  const { data, error } = await getProfile();
  if (error) {
    if (error.code === ERROR_CODES.UNAUTHORIZED) {
      redirect("/login");
    } else {
      return (
        <main className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-muted/30 text-center space-y-2">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">
            Your profile could not be retrieved. Please try again. If the issue
            persists, clear your browser cache or contact us at {CONTACT_EMAIL}.
          </p>
        </main>
      );
    }
  }

  return (
    <main className="max-w-2xl w-full mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Edit Volunteer Profile</h1>
      <ProfileCardEdit profile={data?.profile} />
    </main>
  );
}

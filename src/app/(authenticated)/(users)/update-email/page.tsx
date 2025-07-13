import { Suspense } from "react";
import SettingsForm from "./UpdateEmail";
import { getEmail } from "@/utils/auth";
import SettingsFormSkeleton from "./UpdateEmailSkeleton";

export default function SettingsPage() {
  const data = getEmail();
  return (
    <main className="w-full grow flex flex-col items-center">
      <Suspense fallback={<SettingsFormSkeleton />}>
        <SettingsForm settings={data} />
      </Suspense>
    </main>
  );
}

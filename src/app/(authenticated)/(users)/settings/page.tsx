import { Suspense } from "react";
import SettingsForm from "./SettingsForm";
import { getSettings } from "@/utils/auth";
import SettingsFormSkeleton from "./SettingsFormSkeleton";

export default function SettingsPage() {
  const data = getSettings();
  return (
    <main className="w-full grow flex flex-col items-center">
      <Suspense fallback={<SettingsFormSkeleton />}>
        <SettingsForm settings={data} />
      </Suspense>
    </main>
  );
}

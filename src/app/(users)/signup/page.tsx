import Link from "next/link";
import { FlaskConical } from "lucide-react";
import SignupForm from "./SignupForm";

export default function LoginPage() {
  return (
    <main className="w-full grow flex flex-col items-center">
      <div className="w-72 flex flex-col gap-4 text-center">
        <div className="mx-auto">
          <FlaskConical />
        </div>
        <h1 className="text-xl">Create a Decanter Account</h1>
        <SignupForm />
      </div>
    </main>
  );
}

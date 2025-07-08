import Link from "next/link";
import { FlaskConical } from "lucide-react";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="w-full grow flex flex-col items-center">
      <SignupForm />
    </main>
  );
}

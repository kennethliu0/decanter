import Link from "next/link";
import { FlaskConical } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="w-full grow flex flex-col items-center">
      <LoginForm />
    </main>
  );
}

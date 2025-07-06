import { Input } from "@/components/ui/input";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { Label } from "@/components/ui/label";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="w-full grow flex flex-col items-center">
      <div className="w-72 flex flex-col gap-4 text-center">
        <div className="mx-auto">
          <FlaskConical />
        </div>
        <h1 className="text-xl">Log In to Decanter</h1>
        <LoginForm />
        <div>
          New user?{" "}
          <Link href="/signup">
            <span className="text-blue-500">Create account</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

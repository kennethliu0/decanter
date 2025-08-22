import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/shadcn/card";
import GoogleSignInButton from "../GoogleSignInButton";
import DecanterIcon from "@/components/custom/DecanterIcon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In to Decanter",
  description: "Sign in with Google to continue to Decanter",
};
export default function LoginPage() {
  return (
    <main className="flex flex-col items-center px-4">
      <Card className="w-full max-w-xs mt-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Decanter</CardTitle>
          <CardDescription>Sign in with Google to continue</CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <DecanterIcon className="h-16 w-16" />
        </CardContent>

        <CardFooter>
          <GoogleSignInButton />
        </CardFooter>
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Use an email you are comfortable sharing.
      </p>
    </main>
  );
}

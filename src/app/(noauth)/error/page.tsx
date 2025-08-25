import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error",
};

export default function ErrorPage() {
  return <p className="text-center">Sorry, something went wrong</p>;
}

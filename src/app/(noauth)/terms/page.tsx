import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function Page() {
  return (
    <main className="w-full grow flex flex-col max-w-4xl mx-auto rounded-xl border p-4 bg-background">
      <h2 className="text-xl font-semibold sr-only">Terms of Service</h2>
      <iframe
        src="https://docs.google.com/document/d/e/2PACX-1vST1T25mUf3FYgjZMA2bsDpqwy8SgQF7zbwOLbK-YbAjzrAo4ebOBgGhrOpG2NZaQ/pub?embedded=true"
        className="grow w-full h-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="clipboard-write"
      ></iframe>
    </main>
  );
}

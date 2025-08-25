import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function Page() {
  return (
    <main className="w-full grow flex flex-col max-w-4xl mx-auto rounded-xl border p-4 bg-background">
      <h2 className="text-xl font-semibold sr-only">Privacy Policy</h2>
      <iframe
        src="https://docs.google.com/document/d/e/2PACX-1vQtKJzADc_BILsSQbrXLgOEaCAHKWFWSn_iAsruovx0ZOmwNK1jN39sH7nfuC-GCwGYhN0fkQg_DZYv/pub?embedded=true"
        className="grow w-full h-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="clipboard-write"
      ></iframe>
    </main>
  );
}

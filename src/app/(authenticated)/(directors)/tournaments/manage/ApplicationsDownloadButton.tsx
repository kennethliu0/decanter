"use client";
import { Button } from "@/components/shadcn/button";
import { Result } from "@/lib/definitions";
import { Download } from "lucide-react";
import { useParams } from "next/navigation";
import { use } from "react";

type Props = {
  applicationsPromise: Promise<Result<string>>;
};

const ApplicationsDownloadButton = (props: Props) => {
  const params = useParams();
  const { slug } = params;
  const { data, error } = use(props.applicationsPromise);
  if (error || !data) {
    return (
      <p className="text-sm text-destructive">Loading applications failed</p>
    );
  }

  const handleExport = () => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Button
      onClick={handleExport}
      aria-label="Export applications as CSV file"
    >
      <Download
        aria-hidden="true"
        focusable="false"
      />
      Export Applications
    </Button>
  );
};

export default ApplicationsDownloadButton;

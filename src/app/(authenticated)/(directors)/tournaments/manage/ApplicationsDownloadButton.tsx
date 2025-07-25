"use client";
import { generateApplicationsCSV } from "@/app/dal/tournaments/actions";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  slug: string;
};

const ApplicationsDownloadButton = (props: Props) => {
  const handleExport = async () => {
    const { data, error } = await generateApplicationsCSV(props.slug);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data) {
      toast.error("CSV couldn't be generated");
      return;
    }
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.slug}.csv`;
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

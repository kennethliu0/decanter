"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CopyableLinkProps {
  link: string;
  label?: string;
  className?: string;
}

export function CopyableLink({ link, label, className }: CopyableLinkProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast("Link copied", {
        description: "The link has been copied to your clipboard.",
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Could not copy the link to clipboard.",
      });
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex w-full max-w-md items-center space-x-2">
        <Input
          value={link}
          readOnly
          className="font-mono text-sm text-ellipsis"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          className="flex-shrink-0 bg-transparent"
        >
          {copied ?
            <CheckIcon className="h-4 w-4 text-green-500" />
          : <CopyIcon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

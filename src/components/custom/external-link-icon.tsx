"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";

interface ExternalLinkIconProps {
  href: string;
  label?: string;
  className?: string;
}

export function ExternalLinkIcon({
  href,
  label = "external link",
  className = "",
}: ExternalLinkIconProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const handleConfirm = () => {
    window.open(href, "_blank", "noopener,noreferrer");
    setShowDialog(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className={`h-auto w-auto p-1 ${className}`}
        aria-label={label}
      >
        <ExternalLink className="size-[24px]" />
      </Button>

      <AlertDialog
        open={showDialog}
        onOpenChange={setShowDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Navigate to External Site?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to leave this site and navigate to:
              <br />
              <span className="font-medium text-foreground mt-2 block break-all">
                {href}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

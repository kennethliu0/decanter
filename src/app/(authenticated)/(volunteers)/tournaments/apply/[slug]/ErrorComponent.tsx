import { AppError } from "@/lib/errors";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/shadcn/button";

type Props = {
  error: AppError;
  link: {
    href: string;
    label: string;
  };
};

const ErrorComponent = ({ error, link }: Props) => {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-muted/30 text-center space-y-2">
      <h2 className="text-xl font-semibold text-destructive">
        Application Error
      </h2>
      <p className="text-muted-foreground">
        {error.message
          || "We were unable to process your application at this time. Please try again later or contact support if the problem persists."}
      </p>
      {error.code && (
        <p className="text-xs text-muted-foreground/70">
          Error Code: {error.code}
        </p>
      )}
      <Link href={link.href}>
        <Button variant="secondary">{link.label}</Button>
      </Link>
    </div>
  );
};

export default ErrorComponent;

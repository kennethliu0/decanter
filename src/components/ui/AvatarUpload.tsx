"use client";

import React, { ChangeEvent, useState } from "react";
import { UploadIcon, TrashIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import clsx from "clsx";
import { toast } from "sonner";
import DecanterIcon from "./DecanterIcon";

type AvatarUploadProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  error?: boolean;
};

export default function AvatarUpload({
  value,
  onChange,
  error,
}: AvatarUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("/dal/tournament-icons", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          onChange(data.url);
        } else {
          alert(
            "Upload failed. Upload an image file that is less than 256 KB, or try again later.",
          );
        }
      } finally {
        setLoading(false);
        toast.success("Image upload successful");
      }
    }
  };

  const handleAvatarDelete = () => {
    onChange(null);
  };

  return (
    <div
      className={cn("relative w-32 h-32 overflow-hidden rounded-lg", {
        "border-2 border-destructive": error,
      })}
    >
      {value ?
        <Avatar className={clsx("w-32 h-32 object-cover rounded-lg")}>
          <AvatarImage
            src={value}
            alt="User Avatar"
          />
          <AvatarFallback className="rounded-lg">
            <DecanterIcon />
          </AvatarFallback>
        </Avatar>
      : <div
          className={cn(
            "absolute inset-0 bg-muted/50 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground",
            { "text-destructive": error },
          )}
        >
          <UploadIcon className="w-8 h-8" />
        </div>
      }

      <label
        htmlFor="avatar-upload"
        className={cn("absolute inset-0 cursor-pointer group", {
          "pointer-events-none": loading,
        })}
      >
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleAvatarUpload}
          disabled={loading}
        />
        {loading && (
          <div className="absolute inset-0 bg-muted/70 flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {value && !loading && (
          <div className="absolute inset-0 bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault();
                handleAvatarDelete();
              }}
            >
              <TrashIcon className="w-6 h-6 text-muted-foreground" />
            </Button>
          </div>
        )}
      </label>
    </div>
  );
}

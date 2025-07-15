import React, { ChangeEvent } from "react";
import { UploadIcon, TrashIcon, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import clsx from "clsx";

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
  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/tournament-icons", {
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
            <FlaskConical />
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
        className="absolute inset-0 cursor-pointer group"
      >
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleAvatarUpload}
        />
        {value && (
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

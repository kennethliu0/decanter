"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon, TrashIcon } from "lucide-react";

type Props = {
  originalImage?: string;
};
export default function Component(props: Props) {
  const [avatarImage, setAvatarImage] = useState<string | null>(
    props.originalImage ?? null,
  );
  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarImage(imageUrl);
    }
  };
  const handleAvatarDelete = () => {
    setAvatarImage(null);
  };
  return (
    <div className="relative w-32 h-32 rounded-full overflow-hidden">
      {avatarImage ?
        <img
          src={avatarImage}
          alt="User Avatar"
          width={128}
          height={128}
          className="w-full h-full object-cover"
          style={{ aspectRatio: "128/128", objectFit: "cover" }}
        />
      : <div className="absolute inset-0 bg-muted/50 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-200">
          <UploadIcon className="w-8 h-8 text-muted-foreground" />
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
        {avatarImage && (
          <div className="absolute inset-0 bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleAvatarDelete}
            >
              <TrashIcon className="w-6 h-6 text-muted-foreground" />
            </Button>
          </div>
        )}
      </label>
    </div>
  );
}

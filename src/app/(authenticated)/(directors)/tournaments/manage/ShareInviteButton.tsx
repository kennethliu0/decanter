"use client";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";

type Props = {
  inviteLink: string;
};

const ShareInviteButton = (props: Props) => {
  if (!props.inviteLink) {
    return <Button variant="destructive">Error Occurred</Button>;
  }
  const handleCopy = async () => {
    try {
      navigator.clipboard.writeText(props.inviteLink);
      toast.success("Invite link copied!");
    } catch (err) {
      toast.error("Failed to copy invite link");
    }
  };

  return (
    <div className="flex gap-1 items-center border rounded-md px-2 bg-accent w-fit max-w-full">
      <p className="shrink text-nowrap overflow-hidden text-ellipsis ">
        {props.inviteLink}
      </p>
      <Button
        variant="ghost"
        onClick={handleCopy}
      >
        <Clipboard />
      </Button>
    </div>
  );
};

export default ShareInviteButton;

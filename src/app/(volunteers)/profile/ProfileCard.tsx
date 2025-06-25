import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FlaskConical } from "lucide-react";
import React from "react";

type Props = {
  user: UserInfo;
};

const ProfileCard = (props: Props) => {
  const card = "border p-4 m-1 rounded-lg bg-zinc-900";
  return (
    <div className="max-h-[600px] max-w-[800px] grid grid-cols-1 xs:grid-cols-2 mx-auto">
      <div className={`flex gap-3 col-1 ${card}`}>
        <Avatar className="w-[60px] h-[60px] rounded-sm">
          <AvatarImage
            className="rounded-sm"
            src={props.user.imageUrl}
            alt={props.user.name}
          />
          <AvatarFallback className="rounded-sm">
            <FlaskConical />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1>{props.user.name}</h1>
          <p>{props.user.email}</p>
        </div>
      </div>
      <div className={`col-1 ${card}`}>
        <h4>General Experience</h4>
        <p>{props.user.generalExperience}</p>
      </div>
      <div className={`col-1 row-3 xs:col-2 xs:row-1 ${card}`}>
        <h4>Volunteer Experience</h4>
        <p>{props.user.volunteerExperience}</p>
      </div>
    </div>
  );
};

type UserInfo = {
  name: string;
  email: string;
  generalExperience: string;
  volunteerExperience: string;
  imageUrl: string;
};

export { ProfileCard };
export type { UserInfo };

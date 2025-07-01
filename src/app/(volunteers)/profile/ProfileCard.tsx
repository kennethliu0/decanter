import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import React from "react";

type Props = {
  user: UserInfo;
};

const ProfileCard = (props: Props) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("");
  };
  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4 sm:mx-auto ">
        <Avatar className="w-32 h-32 rounded-full">
          <AvatarImage
            className="rounded-full"
            src={props.user.imageUrl}
            alt={props.user.name}
          />
          <AvatarFallback>
            <span className="text-6xl leading-[53.3px] mb-[6.7px] ">
              {getInitials(props.user.name)}
            </span>
          </AvatarFallback>
        </Avatar>
        <div className="grow p-2 space-y-2">
          <h1 className="text-4xl">{props.user.name}</h1>
          <p>{props.user.education}</p>
        </div>
      </div>
      <Label
        htmlFor="bio"
        className="text-muted-foreground"
      >
        Bio
      </Label>
      <p className="px-2 -mt-2">{props.user.bio}</p>
      <Label
        htmlFor="experience"
        className="text-muted-foreground"
      >
        Experience
      </Label>
      <p className="px-2 -mt-2">{props.user.experience}</p>
      <Label
        htmlFor="divB"
        className="text-muted-foreground"
      >
        Division B Preferences
      </Label>
      <ol className="px-2 space-y-2 -mt-2">
        {props.user.eventsB.map(
          (event, index) =>
            event && <li key={index}>{`${index + 1}. ${event}`}</li>,
        )}
      </ol>
      <Label
        htmlFor="divC"
        className="text-muted-foreground"
      >
        Division C Preferences
      </Label>
      <ol className="px-2 space-y-2 -mt-2">
        {props.user.eventsC.map(
          (event, index) =>
            event && <li key={index}>{`${index + 1}. ${event}`}</li>,
        )}
      </ol>
    </div>
  );
};

type UserInfo = {
  name: string;
  email: string;
  education: string;
  bio: string;
  experience: string;
  imageUrl: string;
  eventsB: string[];
  eventsC: string[];
};

export { ProfileCard };
export type { UserInfo };

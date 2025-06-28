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
    <div className="p-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-lg">
      <div className="w-[360px] space-y-2">
        <div className="flex gap-4">
          <Avatar className="w-32 h-32 mx-auto rounded-full">
            <AvatarImage
              className="mx-auto rounded-full"
              src={props.user.imageUrl} // Your image source
              alt={props.user.name}
            />
            <AvatarFallback>
              <span className="text-6xl leading-[53.3px] mb-[6.7px] ">
                {getInitials(props.user.name)}
              </span>
            </AvatarFallback>
          </Avatar>
          <div className="p-2">
            <h1 className="text-4xl pb-2">{props.user.name}</h1>
            <p>{props.user.email}</p>
            <p>{props.user.education}</p>
          </div>
        </div>

        <DisplayField
          id="bio"
          label="Bio"
          value={props.user.bio}
        />
        <DisplayField
          id="experience"
          label="Experience"
          value={props.user.experience}
        />
      </div>
      <div className="w-[360px]">
        <Label
          htmlFor="divB"
          className="text-muted-foreground mb-2"
        >
          Division B Preferences
        </Label>
        <div className="border py-2 px-3 rounded-md bg-background shadow-xs dark:bg-input/30 dark:border-input">
          <ol className="space-y-1">
            {props.user.events.B.map((event, index) => (
              <li key={index}>{`${index + 1}. ${event}`}</li>
            ))}
          </ol>
        </div>
        <Label
          htmlFor="divC"
          className="text-muted-foreground my-2"
        >
          Division C Preferences
        </Label>
        <div className="border py-2 px-3 rounded-md bg-background shadow-xs dark:bg-input/30 dark:border-input">
          <ol className="space-y-1">
            {props.user.events.C.map((event, index) => (
              <li key={index}>{`${index + 1}. ${event}`}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const DisplayField = (props: { id: string; label?: string; value: string }) => {
  return (
    <div className="space-y-2">
      {props.label && (
        <Label
          htmlFor={props.id}
          className="text-muted-foreground"
        >
          {props.label}
        </Label>
      )}
      <div
        id={props.id}
        className={`selection:bg-primary selection:text-primary-foreground 
  dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border 
  bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none`}
      >
        {props.value}
      </div>
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
  events: {
    B: string[];
    C: string[];
  };
};

export { ProfileCard };
export type { UserInfo };

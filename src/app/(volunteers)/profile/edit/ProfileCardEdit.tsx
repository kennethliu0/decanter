import AvatarUpload from "@/components/ui/AvatarUpload";
import { Label } from "@/components/ui/label";
import React from "react";
import { UserInfo } from "../ProfileCard";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import EventSelectionDropdown from "../../EventSelectionDropdown";
import { Button } from "@/components/ui/button";

type Props = {
  user: UserInfo;
};

const ProfileCardEdit = (props: Props) => {
  return (
    <div className="p-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-lg">
      <div className="w-[360px] space-y-2">
        <div className="flex gap-4">
          <AvatarUpload originalImage={props.user.imageUrl} />
          <div className="space-y-2">
            {/* <h1 className="text-4xl pb-2">{props.user.name}</h1> */}
            <Input
              placeholder="Name"
              defaultValue={props.user.name}
            />
            <Input
              placeholder="Email"
              defaultValue={props.user.email}
            />
            <Input
              placeholder="School and grad year"
              defaultValue={props.user.education}
            />
          </div>
        </div>
        <Textarea
          placeholder="Bio"
          defaultValue={props.user.bio}
          className="min-h-30"
        />
        <Textarea
          placeholder="Experience"
          defaultValue={props.user.experience}
          className="min-h-30"
        />
        <></>
      </div>
      <div className="w-[360px] space-y-2">
        <Label
          htmlFor="divB"
          className="text-muted-foreground"
        >
          Division B Preferences
        </Label>
        <div id="divB">
          <EventSelectionDropdown
            rank={0}
            division="B"
            style="group"
          />
          <EventSelectionDropdown
            rank={1}
            division="B"
            style="group"
          />{" "}
          <EventSelectionDropdown
            rank={2}
            division="B"
            style="group"
          />{" "}
          <EventSelectionDropdown
            rank={3}
            division="B"
            style="group"
          />
        </div>
        <Label
          htmlFor="divC"
          className="text-muted-foreground"
        >
          Division C Preferences
        </Label>
        <div id="divC">
          <EventSelectionDropdown
            rank={0}
            division="C"
            style="group"
          />
          <EventSelectionDropdown
            rank={1}
            division="C"
            style="group"
          />{" "}
          <EventSelectionDropdown
            rank={2}
            division="C"
            style="group"
          />{" "}
          <EventSelectionDropdown
            rank={3}
            division="C"
            style="group"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardEdit;

"use client";
import React, { useState } from "react";
import EventSelectionDropdown from "./EventSelectionDropdown";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  division: "B" | "C";
};

const VolunteerEventRankingDialog = (props: Props) => {
  const [eventSelections, setEventSelections] = useState(["", "", "", ""]);

  const handleUpdateEventSelection = (event: string, rank: number) => {
    const newSelections = [...eventSelections];
    newSelections[rank] = event;
    setEventSelections(newSelections);
  };

  const handleSubmitSelections = () => {
    // to be updated
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button size="sm">Apply</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm Event Preferences</DialogTitle>
            <DialogDescription>
              Update the events that you would like to volunteer for.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 w-full">
            <EventSelectionDropdown
              division={props.division}
              rank={0}
              updateSelection={handleUpdateEventSelection}
            />
            <EventSelectionDropdown
              division={props.division}
              rank={1}
              updateSelection={handleUpdateEventSelection}
            />
            <EventSelectionDropdown
              division={props.division}
              rank={2}
              updateSelection={handleUpdateEventSelection}
            />
            <EventSelectionDropdown
              division={props.division}
              rank={3}
              updateSelection={handleUpdateEventSelection}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleSubmitSelections}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default VolunteerEventRankingDialog;

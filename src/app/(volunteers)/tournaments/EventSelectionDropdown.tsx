"use client";
import React, { useState } from "react";
import { events } from "@/app/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  rank: number;
  division: "B" | "C";
  updateSelection: (event: string, rank: number) => void;
};

const EventSelectionDropdown = (props: Props) => {
  const [selectedEvent, setSelectedEvent] = useState("");

  let textRank =
    props.rank === 0 ? "First Selection"
    : props.rank === 1 ? "Second Selection"
    : props.rank === 2 ? "Third Selection"
    : props.rank === 3 ? "Fourth Selection"
    : "";

  const handleUpdateEventSelection = (event: string) => {
    setSelectedEvent(event);
    props.updateSelection(event, props.rank);
  };

  return (
    <Select onValueChange={(value) => handleUpdateEventSelection(value)}>
      <SelectTrigger>
        <SelectValue placeholder={textRank} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={" "}>None</SelectItem>
          <SelectLabel>Division {props.division} events</SelectLabel>
          {events[props.division].map((event, index) => (
            <SelectItem
              value={event}
              key={index}
            >
              {event}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default EventSelectionDropdown;

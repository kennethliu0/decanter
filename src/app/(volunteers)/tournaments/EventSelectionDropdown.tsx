"use client";
import { Box, Button, DropdownMenu, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import { events } from "@/app/data.js";

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
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Label>
          {textRank}
          {props.rank === 0 && <Text color="red">*</Text>}
        </DropdownMenu.Label>
        <DropdownMenu.Trigger>
          <Button>
            {selectedEvent ? selectedEvent : "None"}
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => handleUpdateEventSelection("")}>
            None
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          {events[props.division].map((event, index) => (
            <DropdownMenu.Item
              key={index}
              onClick={() => handleUpdateEventSelection(event)}
            >
              {event}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
};

export default EventSelectionDropdown;

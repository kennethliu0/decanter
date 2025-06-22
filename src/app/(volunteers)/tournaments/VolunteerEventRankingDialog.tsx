"use client";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import React, { useState } from "react";
import EventSelectionDropdown from "./EventSelectionDropdown";

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
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size="1">Apply</Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Confirm Event Preferences</Dialog.Title>
        <Dialog.Description
          size="2"
          mb="4"
        >
          Update the events that you would like to volunteer for.
        </Dialog.Description>
        <Flex
          maxWidth="400px"
          direction="column"
          gap="3"
        >
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
        </Flex>
        <Flex
          gap="3"
          mt="4"
          justify="end"
        >
          <Dialog.Close>
            <Button
              variant="soft"
              color="gray"
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleSubmitSelections}>Submit</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default VolunteerEventRankingDialog;

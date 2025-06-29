"use client";
import React, { useState } from "react";
import { events } from "@/app/data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import clsx from "clsx";

type Props = {
  rank: number;
  Label?: string;
  division: "B" | "C";
  style?: "group" | "single";
  updateSelection?: (event: string, rank: number) => void;
};

const EventSelectionDropdown = (props: Props) => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  let textRank = [
    "First Selection",
    "Second Selection",
    "Third Selection",
    "Fourth Selection",
  ];

  const borderRadius =
    props.style === "group" ?
      props.rank === 0 ? "rounded-b-none"
      : props.rank === 3 ? "rounded-t-none"
      : "rounded-none"
    : "";

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx("justify-between w-full", borderRadius)}
        >
          {value || `${textRank[props.rank]}...`}
          <ChevronsUpDown className="opacity-50 z-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput
            placeholder={`${textRank[props.rank]}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No events found.</CommandEmpty>
            <CommandGroup>
              {events[props.division].map((event: string) => (
                <CommandItem
                  key={event}
                  value={event}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {event}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === event ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EventSelectionDropdown;

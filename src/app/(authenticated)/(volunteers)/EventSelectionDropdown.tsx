"use client";
import { useState } from "react";
import { EVENTS } from "@/lib/config";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { Button } from "@/components/shadcn/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/shadcn/command";
import clsx from "clsx";

type Props = {
  rank: number;
  Label?: string;
  division: "B" | "C";
  style?: "group" | "single";
  value: string;
  onChange: (value: string) => void;
};

const EventSelectionDropdown = (props: Props) => {
  const [open, setOpen] = useState(false);

  const textRank = [
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
          {props.value || `${textRank[props.rank]}...`}
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
              {EVENTS[props.division].map((event: string) => (
                <CommandItem
                  key={event}
                  value={event}
                  onSelect={(currentValue) => {
                    props.onChange(
                      currentValue === props.value ? "" : currentValue,
                    );
                    setOpen(false);
                  }}
                >
                  {event}
                  <Check
                    className={clsx("ml-auto", {
                      "opacity-0": props.value !== event,
                    })}
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

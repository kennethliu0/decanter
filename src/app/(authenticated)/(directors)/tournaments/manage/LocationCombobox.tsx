"use client";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { US_STATES } from "@/lib/config";
import clsx from "clsx";
import { useState } from "react";

type Props = {
  onChange: (value: string | null) => void;
  value: string;
  error?: boolean;
};

const LocationCombobox = ({ onChange, value, error }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx("w-[200px] justify-between", {
            "!border-destructive": error,
            "text-muted-foreground": !value,
          })}
        >
          {value.length > 0 ? value : "Select location..."}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search states..." />
          <CommandList>
            <CommandEmpty>No state found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="Online"
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "Online" ? "opacity-100" : "opacity-0",
                  )}
                />
                Online
              </CommandItem>
              {US_STATES.map((state, index) => (
                <CommandItem
                  key={index}
                  value={state}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === state ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {state}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationCombobox;

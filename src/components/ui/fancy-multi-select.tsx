"use client";

import { MapPin, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useCallback, useRef, useState } from "react";
import clsx from "clsx";

type Props = {
  options: string[];
  placeholder: string;
  selected: string[];
  setSelected: (selected: string[]) => void;
};

/*
This file is adapted from mxkaske
Source: https://github.com/mxkaske/mxkaske.dev
License: MIT
*/

export function FancyMultiSelect({
  options,
  placeholder,
  selected,
  setSelected,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback(
    (option: string) => {
      setSelected(selected.filter((s) => s !== option));
    },
    [selected],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...selected];
            newSelected.pop();
            setSelected(newSelected);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [selected],
  );

  const selectables = options.filter((value) => !selected.includes(value));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div
        className={`group rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground 
            dark:bg-input/30 dark:border-input dark:hover:bg-input/50 px-3 py-2 text-sm`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {selected.map((value, index) => {
            return (
              <Badge
                key={index}
                variant="secondary"
              >
                {value}
                <button
                  className="ml-1 rounded-full outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(value);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(value)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {selected.length === 0 && (
            <MapPin
              className="text-muted-foreground"
              size={16}
            />
          )}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className={clsx(
              "h-[18px] text-sm flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground",
              {},
            )}
          />
        </div>
      </div>
      <CommandList>
        {open && selectables.length > 0 && (
          <div className="mt-2 w-full max-h-[292px] rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in overflow-auto">
            <CommandGroup>
              {selectables.map((value, index) => {
                return (
                  <CommandItem
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={(value) => {
                      setInputValue("");
                      setSelected([...selected, value]);
                    }}
                    className="cursor-pointer"
                  >
                    {value}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        )}
      </CommandList>
    </Command>
  );
}

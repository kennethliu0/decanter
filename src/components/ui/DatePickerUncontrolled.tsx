"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { format } from "date-fns";
import clsx from "clsx";
import {
  calendarEndDate,
  calendarStartDate,
  seasonEndDate,
  seasonStartDate,
} from "@/app/data";

type Props = {
  value: Date;
  onChange: (value: Date | undefined) => void;
  error?: boolean;
  disableOutOfSeason?: boolean;
  disablePast?: boolean;
  small?: boolean;
};

const DatePickerUncontrolled = ({
  value,
  onChange,
  error,
  disableOutOfSeason,
  disablePast,
  small,
}: Props) => {
  const today = new Date();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!value}
            className={clsx(
              "data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
              {
                "!border-destructive": error,
                "w-[200px]": small,
                "w-[280px]": !small,
              },
            )}
          >
            <CalendarIcon />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            {...(disableOutOfSeason && {
              disabled: (date) =>
                date < (disablePast ? today : seasonStartDate)
                || date > seasonEndDate,
            })}
            startMonth={calendarStartDate}
            endMonth={calendarEndDate}
            onSelect={(e) => {
              onChange(e);
              setOpen(false);
            }}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerUncontrolled;

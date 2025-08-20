"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Button } from "../shadcn/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../shadcn/calendar";
import { format } from "date-fns";
import clsx from "clsx";
import {
  CALENDAR_END_DATE,
  CALENDAR_START_DATE,
  SEASON_END_DATE,
  SEASON_START_DATE,
} from "@/lib/config";

type Props = {
  value: Date | null;
  onChange: (...event: any[]) => void;
  placeholder?: Date;
  error?: boolean;
  disableOutOfSeason?: boolean;
  disablePast?: boolean;
  small?: boolean;
  grayed?: boolean;
} & Pick<React.ComponentPropsWithoutRef<typeof Button>, "className" | "id">;

const DatePicker = ({
  value,
  onChange,
  error,
  disableOutOfSeason,
  disablePast,
  grayed,
  placeholder,
  className,
  ...buttonProps
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
              className,
              {
                "!border-destructive": error,
                "text-muted-foreground": !value || grayed,
              },
            )}
            {...buttonProps}
          >
            <CalendarIcon />
            {value ?
              format(value, "PPP")
            : placeholder ?
              format(placeholder, "PPP")
            : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ?? placeholder ?? undefined}
            defaultMonth={value ?? placeholder ?? undefined}
            {...(disableOutOfSeason && {
              disabled: (date) =>
                date < (disablePast ? today : SEASON_START_DATE)
                || date > SEASON_END_DATE,
            })}
            startMonth={CALENDAR_START_DATE}
            endMonth={CALENDAR_END_DATE}
            onSelect={(e) => {
              onChange(e ?? null);
              setOpen(false);
            }}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;

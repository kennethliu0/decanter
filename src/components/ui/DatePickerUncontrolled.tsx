import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { format, parse } from "date-fns";
import clsx from "clsx";
import {
  calendarEndDate,
  calendarStartDate,
  seasonEndDate,
  seasonStartDate,
} from "@/app/data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disableOutOfSeason?: boolean;
  disablePast?: boolean;
};

const DatePickerUncontrolled = ({
  value,
  onChange,
  error,
  disableOutOfSeason,
  disablePast,
}: Props) => {
  const today = new Date();
  return (
    <div className="flex flex-col gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!value}
            className={clsx(
              "data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal",
              { "border-red-400": error },
            )}
          >
            <CalendarIcon />
            {value ?
              format(parse(value, "yyyy-MM-dd", today), "PPP")
            : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={parse(value, "yyyy-MM-dd", today)}
            defaultMonth={parse(value, "yyyy-MM-dd", today)}
            {...(disableOutOfSeason && {
              disabled: (date) =>
                date < (disablePast ? today : seasonStartDate)
                || date > seasonEndDate,
            })}
            startMonth={calendarStartDate}
            endMonth={calendarEndDate}
            onSelect={(e) => onChange(e ? format(e, "yyyy-MM-dd") : "")}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerUncontrolled;

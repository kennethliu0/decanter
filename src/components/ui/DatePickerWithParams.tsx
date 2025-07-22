"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@radix-ui/react-label";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  CALENDAR_END_DATE,
  CALENDAR_START_DATE,
  SEASON_END_DATE,
  SEASON_START_DATE,
} from "@/lib/config";

type Props = {
  label: string;
  param: string;
  buttonId: string;
  defaultDate?: Date;
  disableOutOfSeason?: boolean;
  disablePast?: boolean;
};

const DatePicker = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [date, setDate] = React.useState<Date | undefined>(() => {
    const value = searchParams.get(props.param);
    return value ? parse(value, "yyyy-MM-dd", new Date()) : props.defaultDate;
  });
  const today = new Date();
  const handleSetDate = (date: Date | undefined) => {
    const params = new URLSearchParams(searchParams);
    setDate(date);
    if (date) {
      params.set(props.param, format(date, "yyyy-MM-dd"));
    } else {
      params.delete(props.param);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      {props.label && (
        <Label
          htmlFor={props.buttonId}
          className="px-1 text-muted-foreground"
        >
          {props.label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={props.buttonId}
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            {...(props.disableOutOfSeason && {
              disabled: (date) =>
                date < (props.disablePast ? today : SEASON_START_DATE)
                || date > SEASON_END_DATE,
            })}
            startMonth={CALENDAR_START_DATE}
            endMonth={CALENDAR_END_DATE}
            onSelect={(e) => handleSetDate(e)}
            required={false}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DatePicker };

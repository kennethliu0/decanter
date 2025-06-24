"use client";

import * as React from "react";
import { format } from "date-fns";
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

type Props = {
  label: string;
  param: string;
  buttonId: string | undefined;
};

const DatePicker = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [date, setDate] = React.useState<Date | undefined>(() => {
    const value = searchParams.get(props.param);
    return value ? new Date(value) : undefined;
  });

  const handleSetDate = (date: Date | undefined) => {
    const params = new URLSearchParams(searchParams);
    setDate(date);
    if (date) {
      params.set(props.param, date.toISOString());
    } else {
      params.delete(props.param);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3">
      {props.label !== "none" && (
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
            onSelect={(e) => handleSetDate(e)}
            required={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DatePicker };

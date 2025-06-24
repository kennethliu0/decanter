"use client";

import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usStates } from "../data";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/datepicker";

type AccordionWrapperProps = React.ComponentProps<typeof Accordion>;

const TournamentFilters = ({ ...props }: AccordionWrapperProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleCheckedChange = (property: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (params.getAll(property)?.includes(value)) {
      params.delete(property, value);
    } else {
      params.append(property, value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Accordion {...props}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Division</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <AccordionOption
            id="division-b"
            text="Division B (Middle School)"
            onCheckedChange={() => handleCheckedChange("division", "b")}
            defaultChecked={searchParams.getAll("division").includes("b")}
          />
          <AccordionOption
            id="division-c"
            text="Division C (High School)"
            onCheckedChange={() => handleCheckedChange("division", "c")}
            defaultChecked={searchParams.getAll("division").includes("c")}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Date</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <DatePicker
            label="Start Date After"
            param="startDateAfter"
            buttonId="start-date-after-button"
          />
          <DatePicker
            label="Start Date Before"
            param="startDatebefore"
            buttonId="start-date-before-button"
          />
          <DatePicker
            label="Application Deadline After"
            param="applyDateAfter"
            buttonId="apply-date-after-button"
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Location</AccordionTrigger>
        <AccordionContent className="columns-2">
          <AccordionOption
            id="online"
            text="Online"
            onCheckedChange={() => handleCheckedChange("location", "Online")}
            defaultChecked={searchParams.getAll("location").includes("Online")}
          />
          {usStates.map((state, index) => (
            <AccordionOption
              key={index}
              id={state}
              text={state}
              onCheckedChange={() => handleCheckedChange("location", state)}
              defaultChecked={searchParams.getAll("location").includes(state)}
              className="mt-4"
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const AccordionOption = (
  props: {
    text: string;
  } & React.ComponentProps<typeof Checkbox>,
) => {
  const { text, property, id, className, ...otherProps } = props;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Checkbox
        id={id}
        {...otherProps}
      />
      <Label htmlFor={id}>{text}</Label>
    </div>
  );
};

export default TournamentFilters;

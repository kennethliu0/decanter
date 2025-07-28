"use client";

import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { US_STATES } from "@/lib/config";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/DatePickerWithParams";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type AccordionWrapperProps = React.ComponentProps<typeof Accordion>;

const TournamentFilters = ({ ...props }: AccordionWrapperProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [sortValue, selectedDivisions, selectedLocations, showApplied] =
    useMemo(
      () => [
        searchParams.get("sort") ?? "startDate",
        searchParams.getAll("division"),
        searchParams.getAll("location"),
        searchParams.get("showApplied") ?? "false",
      ],
      [searchParams],
    );
  const today = useMemo(() => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }, []);

  const handleCheckedChange = (
    property: string,
    value: string,
    checked: boolean | "indeterminate",
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    const currentValues = new Set(params.getAll(property));
    if (checked === true) {
      currentValues.add(value);
    } else {
      currentValues.delete(value);
    }
    params.delete(property); // remove all
    currentValues.forEach((val) => params.append(property, val));

    replace(`${pathname}?${params.toString()}`);
  };

  const getCheckboxHandler = (category: string, value: string) => {
    return (checked: boolean | "indeterminate") =>
      handleCheckedChange(category, value, checked);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("sort", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Accordion {...props}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Sort & Filter</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <RadioGroup
            value={sortValue}
            onValueChange={handleSortChange}
            className="gap-4"
          >
            <div className="flex gap-3">
              <RadioGroupItem
                value="startDate"
                id="startDate"
              />
              <Label htmlFor="startDate">Tournament Start Date</Label>
            </div>
            <div className="flex gap-3">
              <RadioGroupItem
                value="applyDeadline"
                id="applyDeadline"
              />
              <Label htmlFor="applyDeadline">Application Deadline</Label>
            </div>
          </RadioGroup>
          <AccordionOption
            id="show-applied"
            text="Show Applied Tournaments"
            onCheckedChange={getCheckboxHandler("showApplied", "true")}
            checked={showApplied === "true"}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Division</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <AccordionOption
            id="division-b"
            text="Division B (Middle School)"
            onCheckedChange={getCheckboxHandler("division", "B")}
            checked={selectedDivisions.includes("B")}
          />
          <AccordionOption
            id="division-c"
            text="Division C (High School)"
            onCheckedChange={getCheckboxHandler("division", "C")}
            checked={selectedDivisions.includes("C")}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Date</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <DatePicker
            label="Start Date After"
            param="startDateAfter"
            buttonId="start-date-after-button"
            defaultDate={today}
          />
          <DatePicker
            label="Start Date Before"
            param="startDateBefore"
            buttonId="start-date-before-button"
          />
          <DatePicker
            label="Application Deadline After"
            param="applyDeadlineAfter"
            buttonId="apply-date-after-button"
            defaultDate={today}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Location</AccordionTrigger>
        <AccordionContent className="columns-2 xs:columns-3 sm:columns-2 space-y-4">
          {["Online", ...US_STATES].map((state, index) => (
            <AccordionOption
              key={index}
              id={state}
              text={state}
              onCheckedChange={getCheckboxHandler("location", state)}
              checked={selectedLocations.includes(state)}
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
  const { text, id, className, ...otherProps } = props;
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

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
import { usePathname, useSearchParams } from "next/navigation";
import { SEASON_END_DATE, US_STATES } from "@/lib/config";
import { cn, safeParseDate } from "@/lib/utils";
import DatePicker from "@/components/ui/DatePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

type AccordionWrapperProps = React.ComponentProps<typeof Accordion>;

const TournamentFilters = ({ ...props }: AccordionWrapperProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    sortValue,
    selectedDivisions,
    selectedLocations,
    showApplied,
    startDateAfter,
    startDateBefore,
    applyDeadlineAfter,
  ] = useMemo(
    () => [
      searchParams.get("sort") ?? "startDate",
      searchParams.getAll("division"),
      searchParams.getAll("location"),
      searchParams.get("showApplied") ?? "false",
      safeParseDate(searchParams.get("startDateAfter")),
      safeParseDate(searchParams.get("startDateBefore")),
      safeParseDate(searchParams.get("applyDeadlineAfter")),
    ],
    [searchParams],
  );

  const numSortFiltersEdited = useMemo(() => {
    let count = 0;
    if (showApplied !== "false") {
      count++;
    }
    if (sortValue !== "startDate") {
      count++;
    }
    return count;
  }, [showApplied, sortValue]);

  const numDateFiltersEdited = useMemo(() => {
    let count = 0;
    if (startDateAfter) {
      count++;
    }
    if (startDateBefore) {
      count++;
    }
    if (applyDeadlineAfter) {
      count++;
    }
    return count;
  }, [startDateAfter, startDateBefore, applyDeadlineAfter]);

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
    // using replaceState instead of router.replace prevents a server-component re-render that would refetch data from the database
    window.history.replaceState(
      { ...params },
      "",
      `${pathname}?${params.toString()}`,
    );
  };

  const getCheckboxHandler = (category: string, value: string) => {
    return (checked: boolean | "indeterminate") =>
      handleCheckedChange(category, value, checked);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("sort", value);
    window.history.replaceState(
      { ...params },
      "",
      `${pathname}?${params.toString()}`,
    );
  };

  const handleDateChange = (param: string) => {
    return (date: Date | null) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (date) {
        params.set(param, date.toISOString().split("T")[0]);
      } else {
        params.delete(param);
      }
      window.history.replaceState(
        { ...params },
        "",
        `${pathname}?${params.toString()}`,
      );
    };
  };

  const handleClearParams = (paramList: string[]) => {
    return () => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      for (const param of paramList) {
        params.delete(param);
      }
      window.history.replaceState(
        { ...params },
        "",
        `${pathname}?${params.toString()}`,
      );
    };
  };

  return (
    <Accordion {...props}>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Sort & Filter{" "}
          {numSortFiltersEdited > 0 && `(${numSortFiltersEdited})`}
        </AccordionTrigger>
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
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={handleClearParams(["sort", "showApplied"])}
            disabled={numSortFiltersEdited === 0}
          >
            Clear
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          Division{" "}
          {selectedDivisions.length > 0 && `(${selectedDivisions.length})`}
        </AccordionTrigger>
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
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={handleClearParams(["division"])}
            disabled={selectedDivisions.length === 0}
          >
            Clear
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          Date {numDateFiltersEdited > 0 && `(${numDateFiltersEdited})`}
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <Label htmlFor="start-date-after">Start Date After</Label>
          <DatePicker
            id="start-date-after"
            value={startDateAfter}
            onChange={handleDateChange("startDateAfter")}
            placeholder={today}
          />
          <Label htmlFor="start-date-before">Start Date Before</Label>
          <DatePicker
            id="start-date-before"
            value={startDateBefore}
            onChange={handleDateChange("startDateBefore")}
            placeholder={SEASON_END_DATE}
          />
          <Label htmlFor="start-date-after">Apply Deadline After</Label>
          <DatePicker
            id="apply-deadline-after"
            value={applyDeadlineAfter}
            onChange={handleDateChange("applyDeadlineAfter")}
            placeholder={today}
          />
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={handleClearParams([
              "startDateAfter",
              "startDateBefore",
              "applyDeadlineAfter",
            ])}
            disabled={numDateFiltersEdited === 0}
          >
            Clear
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>
          Location{" "}
          {selectedLocations.length > 0 && `(${selectedLocations.length})`}
        </AccordionTrigger>
        <AccordionContent>
          <Button
            variant="link"
            className="p-0 h-auto mb-4"
            onClick={handleClearParams(["location"])}
            disabled={selectedLocations.length === 0}
          >
            Clear
          </Button>
          <div className="columns-2 xs:columns-3 sm:columns-2 space-y-4">
            {["Online", ...US_STATES].map((state, index) => (
              <AccordionOption
                key={index}
                id={state}
                text={state}
                onCheckedChange={getCheckboxHandler("location", state)}
                checked={selectedLocations.includes(state)}
              />
            ))}
          </div>
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

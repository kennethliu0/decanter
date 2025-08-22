"use client";

import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/shadcn/accordion";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SEASON_END_DATE, US_STATES } from "@/lib/config";
import { safeParseDate } from "@/lib/utils";
import DatePicker from "@/components/custom/DatePicker";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { Button } from "@/components/shadcn/button";
import { FancyMultiSelect } from "@/components/custom/fancy-multi-select";

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
    selectedStatus,
    startDateAfter,
    startDateBefore,
    applyDeadlineAfter,
  ] = useMemo(
    () => [
      searchParams.get("sort") ?? "startDate",
      searchParams.getAll("division"),
      searchParams.getAll("location"),
      searchParams.getAll("status"),
      safeParseDate(searchParams.get("startDateAfter")),
      safeParseDate(searchParams.get("startDateBefore")),
      safeParseDate(searchParams.get("applyDeadlineAfter")),
    ],
    [searchParams],
  );

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

  const handleLocationChange = (locations: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.delete("location");
    locations.forEach((l) => params.append("location", l));
    window.history.replaceState(
      { ...params },
      "",
      `${pathname}?${params.toString()}`,
    );
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
        <AccordionTrigger>Sort</AccordionTrigger>
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
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          Status {selectedStatus.length > 0 && `(${selectedStatus.length})`}
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <AccordionOption
            id="not-started"
            text="Not Started"
            onCheckedChange={getCheckboxHandler("status", "notstarted")}
            checked={selectedStatus.includes("notstarted")}
          />
          <AccordionOption
            id="saved"
            text="Saved"
            onCheckedChange={getCheckboxHandler("status", "saved")}
            checked={selectedStatus.includes("saved")}
          />
          <AccordionOption
            id="applied"
            text="Applied"
            onCheckedChange={getCheckboxHandler("status", "applied")}
            checked={selectedStatus.includes("applied")}
          />
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={handleClearParams(["status"])}
            disabled={selectedStatus.length === 0}
          >
            Clear
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
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
      <AccordionItem value="item-4">
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
            className="w-full max-w-2xs"
          />
          <Label htmlFor="start-date-before">Start Date Before</Label>
          <DatePicker
            id="start-date-before"
            value={startDateBefore}
            onChange={handleDateChange("startDateBefore")}
            placeholder={SEASON_END_DATE}
            className="w-full max-w-2xs"
          />
          <Label htmlFor="start-date-after">Apply Deadline After</Label>
          <DatePicker
            id="apply-deadline-after"
            value={applyDeadlineAfter}
            onChange={handleDateChange("applyDeadlineAfter")}
            placeholder={today}
            className="w-full max-w-2xs"
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
      <AccordionItem value="item-5">
        <AccordionTrigger>
          Location{" "}
          {selectedLocations.length > 0 && `(${selectedLocations.length})`}
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FancyMultiSelect
            options={["Online", ...US_STATES]}
            placeholder="Select Location..."
            selected={selectedLocations}
            setSelected={handleLocationChange}
          />
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={handleClearParams(["location"])}
            disabled={selectedLocations.length === 0}
          >
            Clear
          </Button>
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
  return (
    <div className="flex items-center gap-3">
      <Checkbox {...props} />
      <Label htmlFor={props.id}>{props.text}</Label>
    </div>
  );
};

export default TournamentFilters;

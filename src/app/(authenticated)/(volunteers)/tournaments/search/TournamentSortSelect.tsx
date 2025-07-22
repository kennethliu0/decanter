"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
type Props = {};

const TournamentSortSelect = (props: Props) => {
  const sortOptions = [
    { label: "Tournament Start Date", param: "startDate" },
    { label: "Application Due Date", param: "applyDeadline" },
  ];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      onValueChange={handleSelect}
      defaultValue={searchParams.get("sort")?.toString()}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={sortOptions[0].label} />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option, index) => (
          <SelectItem
            value={option.param}
            key={index}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TournamentSortSelect;

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FilterIcon } from "lucide-react";
import React from "react";
import TournamentFilters from "./TournamentFilters";

type Props = {};

const MobileTournamentFilters = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="sm:hidden"
          variant="ghost"
        >
          <FilterIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full"
      >
        <SheetHeader>
          <SheetTitle>Tournament Filters</SheetTitle>
          <SheetDescription>
            Set or clear filters while searching for tournaments
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          <TournamentFilters
            type="multiple"
            className="w-full h-full px-4"
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileTournamentFilters;

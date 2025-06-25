import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
          className="md:hidden"
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
        <TournamentFilters
          type="multiple"
          className="w-full px-4 flex-1 overflow-y-auto "
        />
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              variant="outline"
            >
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileTournamentFilters;

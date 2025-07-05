"use client";

import React, { ComponentProps } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import VolunteerField from "./VolunteerField";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

type Props = {
  id: string;
} & Omit<ComponentProps<typeof VolunteerField>, "ref">;

const SortableItem = ({ id, ...props }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 touch-none"
    >
      <Button
        {...attributes}
        {...listeners}
        variant="ghost"
      >
        <GripVertical />
      </Button>
      <VolunteerField {...props} />
    </div>
  );
};
export default SortableItem;

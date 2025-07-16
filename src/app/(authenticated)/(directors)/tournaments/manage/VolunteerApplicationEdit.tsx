"use client";

import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import VolunteerField from "./VolunteerField";
import { v4 as uuidv4 } from "uuid";

type InputType = "short" | "long";
type Field = { prompt: string; type: InputType; id: string };
type Props = {
  value: Field[];
  onChange: (value: Field[] | null) => void;
};

const VolunteerApplicationEdit = ({ value, onChange }: Props) => {
  const [activeField, setActiveField] = useState<Field | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveField(value.find((field) => field.id === active.id) || null);
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((field) => field.id === active.id);
      const newIndex = value.findIndex((field) => field.id === over.id);

      onChange(arrayMove(value, oldIndex, newIndex));
    }
  }

  return (
    <div className="text-sm">
      <ul className="px-2 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[]}
          id="unique-dnd-context-id"
        >
          <SortableContext
            items={value.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            {value.map((field, index) => (
              <SortableItem
                key={field.id}
                id={field.id}
                prompt={field.prompt}
                type={field.type}
                onPromptChange={(e: string) => {
                  const updated = [...value];
                  updated[index].prompt = e;
                  onChange(updated);
                }}
                onTypeChange={(e: InputType) => {
                  const updated = [...value];
                  updated[index].type = e;
                  onChange(updated);
                }}
                onDelete={() => {
                  onChange(value.filter((_, i) => i !== index));
                }}
              ></SortableItem>
            ))}
          </SortableContext>
          <DragOverlay>
            {activeField && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <GripVertical />
                </Button>
                <VolunteerField
                  prompt={activeField.prompt}
                  type={activeField.type}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </ul>
      <div className="flex justify-between gap-2 p-2">
        <Button
          variant="outline"
          onClick={() => {
            let newFields = [
              ...value,
              {
                prompt: "",
                type: "short" as InputType,
                id: uuidv4(),
              },
            ];
            onChange(newFields);
          }}
        >
          <Plus />
          Add Field
        </Button>
      </div>
    </div>
  );
};

export default VolunteerApplicationEdit;

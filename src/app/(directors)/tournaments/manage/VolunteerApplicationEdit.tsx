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
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import VolunteerField from "./VolunteerField";

type InputType = "input" | "textarea";
type Field = { prompt: string; type: InputType; id: string };
type Props = {
  fields: Field[];
};
const deepEquals = (arr1: Field[], arr2: Field[]) => {
  if (arr1 === arr2) {
    return true;
  }

  if (arr1.length != arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].prompt !== arr2[i].prompt || arr1[i].type !== arr2[i].type)
      return false;
  }
  return true;
};

const VolunteerApplicationEdit = (props: Props) => {
  const [initialFields, setInitialFields] = useState(props.fields);
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [fields, setFields] = useState(props.fields);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveField(fields.find((field) => field.id === active.id) || null);
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFields((fields) => {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);

        return arrayMove(fields, oldIndex, newIndex);
      });
    }
  }
  return (
    <div className="text-sm">
      <h2 className="text-2xl pb-2">Edit Volunteer Application</h2>
      <p>Volunteers already provide the following fields:</p>
      <ul>
        <li>- Name</li>
        <li>- Contact e-mail</li>
        <li>- School and graduation year</li>
        <li>- Notable achievements</li>
        <li>- Past volunteer experience</li>
        <li>- First four event preferences</li>
      </ul>
      <p>
        Do not include information that would go in your onboarding form such as
        T-Shirt size. Use this form for additional info that you need to process
        an application (think ability to travel for in-person tournaments,
        whether they are competing in the Division C tournament while applying
        for Division B, etc).
      </p>
      <h3 className="text-xl py-2">Fields</h3>
      <ul className="p-2 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[]}
          id="unique-dnd-context-id"
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <SortableItem
                key={field.id}
                id={field.id}
                prompt={field.prompt}
                type={field.type}
                onPromptChange={(value: string) => {
                  const updated = [...fields];
                  updated[index].prompt = value;
                  setFields(updated);
                }}
                onTypeChange={(value: InputType) => {
                  const updated = [...fields];
                  updated[index].type = value;
                  setFields(updated);
                }}
                onDelete={() => {
                  setFields(fields.filter((_, i) => i !== index));
                }}
              ></SortableItem>
            ))}
          </SortableContext>
          <DragOverlay>
            {activeField ?
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <GripVertical />
                </Button>
                <VolunteerField
                  prompt={activeField.prompt}
                  type={activeField.type}
                />
              </div>
            : null}
          </DragOverlay>
        </DndContext>
      </ul>
      <div className="flex justify-between gap-2 p-2">
        <Button
          variant="outline"
          onClick={() => {
            let newFields = [
              ...fields,
              {
                prompt: "",
                type: "input" as InputType,
                id: String(fields.length),
              },
            ];
            setFields(newFields);
          }}
        >
          <Plus />
          Add Field
        </Button>
        {!deepEquals(fields, initialFields) && (
          <div className="flex gap-2 items-center">
            <p className="text-muted-foreground">Unsaved Changes</p>
            <Button
              variant="outline"
              onClick={() =>
                setFields(
                  initialFields.map((field, index) => ({
                    ...field,
                    id: String(index),
                  })),
                )
              }
            >
              Discard
            </Button>
            <Button
              onClick={() => {
                // remove empty fields
                setFields(fields.filter((field) => field.prompt));
                // call server function
                console.log(fields);
                setInitialFields(
                  fields.map((field) => {
                    return {
                      prompt: field.prompt,
                      type: field.type,
                      id: field.id,
                    };
                  }),
                );
              }}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerApplicationEdit;

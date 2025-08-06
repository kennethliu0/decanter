import { forwardRef } from "react";
import { Textarea } from "@/components/shadcn/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
import { TrashIcon } from "lucide-react";
import clsx from "clsx";

type InputType = "short" | "long";

interface VolunteerFieldProps {
  prompt: string;
  type: InputType;
  onPromptChange?: (value: string) => void;
  onTypeChange?: (value: InputType) => void;
  onDelete?: () => void;
}

const VolunteerField = forwardRef<HTMLLIElement, VolunteerFieldProps>(
  ({ prompt, type, onPromptChange, onTypeChange, onDelete }, ref) => {
    return (
      <li
        ref={ref}
        className="max-w-128 grow space-y-2 border-accent border py-2 px-4 rounded-md bg-background"
      >
        <Textarea
          value={prompt}
          onChange={(e) =>
            onPromptChange ? onPromptChange(e.target.value) : null
          }
          placeholder="Prompt text"
          className={clsx("h-9", {
            "border-destructive": !prompt,
          })}
        />
        <div className="flex gap-2 justify-between items-center">
          <RadioGroup
            defaultValue={type}
            onValueChange={(value) =>
              onTypeChange ? onTypeChange(value as InputType) : null
            }
            onClick={(e) => {
              e.stopPropagation;
            }}
          >
            <div className="flex gap-2 items-center">
              <RadioGroupItem
                value="long"
                id="long"
              />
              <Label htmlFor="long">Long Response</Label>
              <RadioGroupItem
                value="short"
                id="short"
              />
              <Label htmlFor="short">Short Response</Label>
            </div>
          </RadioGroup>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
            onClick={onDelete}
          >
            <TrashIcon />
          </Button>
        </div>
      </li>
    );
  },
);

export default VolunteerField;

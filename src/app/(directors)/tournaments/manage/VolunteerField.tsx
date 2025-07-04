import { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TrashIcon } from "lucide-react";

type InputType = "input" | "textarea";

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
        className="grow space-y-2 border-accent border p-2 rounded-md bg-background"
      >
        <Textarea
          value={prompt}
          onChange={(e) =>
            onPromptChange ? onPromptChange(e.target.value) : null
          }
          placeholder="Prompt text"
          className="max-w-128 h-32 sm:h-9"
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
                value="textarea"
                id="textarea"
              />
              <Label htmlFor="textarea">Long Response</Label>
              <RadioGroupItem
                value="input"
                id="input"
              />
              <Label htmlFor="input">Short Response</Label>
            </div>
          </RadioGroup>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-red-400"
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

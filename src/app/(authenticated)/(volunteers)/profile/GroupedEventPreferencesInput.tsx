import EventSelectionDropdown from "../EventSelectionDropdown";

type Props = {
  value: string[] | null;
  division: "B" | "C";
  onChange: (value: string[] | null) => void;
  error?: boolean;
};

const GroupedEventPreferencesInput = ({
  value,
  division,
  onChange,
  error,
}: Props) => {
  const onSelectionChange = (selection: string, rank: number) => {
    let newArray = value ? [...value] : ["", "", "", ""];
    newArray[rank] = selection;
    onChange(newArray);
  };

  return (
    <div>
      <EventSelectionDropdown
        rank={0}
        division={division}
        style="group"
        value={value ? value[0] : ""}
        onChange={(value) => onSelectionChange(value, 0)}
      />
      <EventSelectionDropdown
        rank={1}
        division={division}
        style="group"
        value={value ? value[1] : ""}
        onChange={(value) => onSelectionChange(value, 1)}
      />{" "}
      <EventSelectionDropdown
        rank={2}
        division={division}
        style="group"
        value={value ? value[2] : ""}
        onChange={(value) => onSelectionChange(value, 2)}
      />{" "}
      <EventSelectionDropdown
        rank={3}
        division={division}
        style="group"
        value={value ? value[3] : ""}
        onChange={(value) => onSelectionChange(value, 3)}
      />
    </div>
  );
};

export default GroupedEventPreferencesInput;

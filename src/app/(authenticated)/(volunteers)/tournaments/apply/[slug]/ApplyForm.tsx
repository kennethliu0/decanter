"use client";

import { upsertTournamentApplication } from "@/app/dal/tournaments/actions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  InsertTournamentApplicationSchema,
  Result,
  TournamentApplicationInfoSchema,
} from "@/lib/definitions";
import { format } from "date-fns";
import { FlaskConical } from "lucide-react";
import React, {
  startTransition,
  use,
  useActionState,
  useEffect,
  useState,
} from "react";
import z from "zod/v4";
import { InsertTournamentApplicationSchema as FormSchema } from "@/lib/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GroupedEventPreferencesInput from "../../../profile/GroupedEventPreferencesInput";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ERROR_CODES, AppError } from "@/lib/errors";
import { contactEmail } from "@/app/data";
import Link from "next/link";

type Props = {
  applicationPromise: Promise<{
    data?: z.infer<typeof TournamentApplicationInfoSchema>;
    error?: Error;
  }>;
  preferencesPromise: Promise<{
    data?: { preferencesB: string[]; preferencesC: string[] };
    error?: Error;
  }>;
  savedApplicationPromise: Promise<
    Result<{
      application: z.infer<typeof InsertTournamentApplicationSchema>;
    }>
  >;
};

const ApplyForm = (props: Props) => {
  const [submitMode, setSubmitMode] = useState<"save" | "submit">("submit");
  const [hasToastedSuccess, setHasToastedSuccess] = React.useState(false);
  const [hasToastedError, setHasToastedError] = React.useState(false);

  const { data, error } = use(props.applicationPromise);
  if (error || !data) {
    return <div>{error?.message || "An unknown error occurred"}</div>;
  }

  const { id, ...tournament } = data;

  const { data: preferencesData, error: preferencesError } = use(
    props.preferencesPromise,
  );
  if (preferencesError || !preferencesData) {
    return (
      <div>{preferencesError?.message || "An unknown error occurred"}</div>
    );
  }
  const profilePreferences =
    preferencesData[`preferences${tournament.division}`];

  const { data: savedData, error: savedError } = use(
    props.savedApplicationPromise,
  );
  if (savedError) {
    if (savedError.code === ERROR_CODES.ALREADY_SUBMITTED) {
      return (
        <SubmittedApplicationNotice
          tournamentName={`${tournament.name} (Division ${tournament.division})`}
        />
      );
    }
  }
  const validatedSave =
    savedData?.application ?
      InsertTournamentApplicationSchema.safeParse(savedData.application)
    : null;

  const savedApplication = validatedSave?.success ? validatedSave.data : null;

  const [state, action, pending] = useActionState(
    upsertTournamentApplication,
    undefined,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mode: "save",
      tournamentId: id,
      preferences: savedApplication?.preferences
        || profilePreferences || ["", "", "", ""],
      responses:
        savedApplication?.responses
        || tournament.applicationFields.map(({ id }) => ({
          fieldId: id,
          response: "",
        })),
    },
  });
  const onSubmit = (
    values: z.infer<typeof FormSchema>,
    mode: "save" | "submit",
  ) => {
    startTransition(() => {
      action({
        mode,
        tournamentId: id,
        preferences: values.preferences,
        responses: values.responses,
      });
    });
  };

  useEffect(() => {
    if (state?.success) {
      toast.success("Application successfully submitted/saved");
    } else if (state?.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (savedApplication && !hasToastedSuccess) {
      console.log(toast.success("Successfully loaded saved application."));
      setHasToastedSuccess(true);
    } else if ((savedError || !validatedSave?.success) && !hasToastedError) {
      toast.error("Could not retrieve saved application.");
      setHasToastedError(true);
    }
  }, [
    savedError,
    savedApplication,
    validatedSave,
    hasToastedSuccess,
    hasToastedError,
  ]);

  return (
    <div className="max-w-2xl w-full mx-auto space-y-2 px-4">
      <div className="flex justify-between">
        <div>
          <p>Apply For</p>
          <h1 className="text-2xl">{`${tournament.name} (Division ${tournament.division})`}</h1>
          <p>
            {new Date(tournament.startDate).toLocaleDateString()} -{" "}
            {new Date(tournament.endDate).toLocaleDateString()} |{" "}
            {tournament.location}
          </p>
          <p>
            Apply before{" "}
            {`${format(new Date(tournament.applyDeadline), "Pp")} ${format(new Date(tournament.applyDeadline), "O")}`}
          </p>
        </div>
        <Avatar className="size-32 hidden xs:block">
          <AvatarImage
            src={tournament.imageUrl}
            alt={`${tournament.name} tournament icon`}
          />
          <AvatarFallback>
            <FlaskConical />
          </AvatarFallback>
        </Avatar>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values, submitMode))}
          className="space-y-2"
        >
          <FormField
            name="preferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Preferences</FormLabel>
                <FormControl>
                  <GroupedEventPreferencesInput
                    division={tournament.division}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {state?.errors?.preferences && (
                  <p className="text-sm text-destructive">
                    {state.errors.preferences}
                  </p>
                )}
                <FormDescription>
                  {/* Not yet implemented */}
                  Pulled from your volunteer profile
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name="responses"
            render={({ field }) => (
              <FormItem>
                {tournament.applicationFields.map(({ type, prompt }, index) => (
                  <FormItem key={index}>
                    <FormLabel>{prompt}</FormLabel>
                    <FormControl>
                      {type === "long" ?
                        <Textarea
                          className="resize-none"
                          placeholder="Long response"
                          value={field.value[index].response}
                          onChange={(e) => {
                            let newFields = [...field.value];
                            newFields[index].response = e.target.value;
                            field.onChange(newFields);
                          }}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      : <Input
                          placeholder="Short response"
                          value={field.value[index].response}
                          onChange={(e) => {
                            let newFields = [...field.value];
                            newFields[index].response = e.target.value;
                            field.onChange(newFields);
                          }}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      }
                    </FormControl>
                  </FormItem>
                ))}
                <FormMessage />
                {state?.errors?.responses && (
                  <p className="text-sm text-destructive">
                    {state.errors.responses}
                  </p>
                )}
                <FormDescription className="sr-only">
                  Other fields created by the tournament directors
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setSubmitMode("save")}
            >
              Save for later
            </Button>
            <Button
              type="submit"
              disabled={pending}
              onClick={() => setSubmitMode("submit")}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const SubmittedApplicationNotice = ({
  tournamentName,
}: {
  tournamentName: string;
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-muted/30 text-center space-y-2">
      <h2 className="text-xl font-semibold">Application Already Submitted</h2>
      <p className="text-muted-foreground">
        You’ve already submitted an application for{" "}
        <strong>{tournamentName}</strong>. If you think this is a mistake,
        contact us at {contactEmail}.
      </p>
      <div className="flex justify-center gap-2 mt-4">
        <Link href="/tournaments/search">
          <Button variant="secondary">Back to Search</Button>
        </Link>
      </div>
    </div>
  );
};

export default ApplyForm;

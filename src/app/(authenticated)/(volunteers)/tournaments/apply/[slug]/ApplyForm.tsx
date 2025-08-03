"use client";

import { upsertTournamentApplicationAction } from "@/app/actions/tournaments";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  InsertTournamentApplicationSchema,
  TournamentApplicationInfoSchema,
} from "@/lib/definitions";
import { format } from "date-fns";
import { startTransition, useActionState, useEffect, useState } from "react";
import { infer as zodInfer } from "zod/v4";
import { InsertTournamentApplicationSchema as FormSchema } from "@/lib/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GroupedEventPreferencesInput from "../../../profile/GroupedEventPreferencesInput";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import LoadingButton from "@/components/ui/LoadingButton";
import { useRouter } from "next/navigation";
import DecanterIcon from "@/components/ui/DecanterIcon";

type Props = {
  application: zodInfer<typeof TournamentApplicationInfoSchema>;
  preferences:
    | {
        preferencesB: string[];
        preferencesC: string[];
      }
    | undefined;
  savedApplication:
    | zodInfer<typeof InsertTournamentApplicationSchema>
    | undefined;
  submitted: boolean;
  toastProperty: string;
  toastStatus: string;
};

const ApplyForm = (props: Props) => {
  const router = useRouter();
  const [submitMode, setSubmitMode] = useState<"save" | "submit">("submit");

  const { id, ...tournament } = props.application;
  const profilePreferences =
    props.preferences?.[`preferences${tournament.division}`];

  const savedApplication = props.savedApplication;

  const [state, action, pending] = useActionState(
    upsertTournamentApplicationAction,
    undefined,
  );

  const form = useForm<zodInfer<typeof FormSchema>>({
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
    values: zodInfer<typeof FormSchema>,
    mode: "save" | "submit",
  ) => {
    form.reset(values);
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
      if (submitMode === "save") {
        toast.success("Application successfully saved");
      } else if (submitMode === "submit") {
        router.push("/tournaments/apply/confirmation");
      }
    } else if (state?.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (props.toastStatus === "success") {
      toast.success(`Successfully loaded saved ${props.toastProperty}.`);
    } else if (props.toastStatus === "error") {
      toast.error(`Could not retrieve saved ${props.toastProperty}`);
    }
  }, [props.toastProperty, props.toastStatus]);

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
            <DecanterIcon />
          </AvatarFallback>
        </Avatar>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values, submitMode))}
          autoComplete="off"
        >
          <fieldset
            disabled={props.submitted}
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
                </FormItem>
              )}
            />
            {tournament.applicationFields.map(({ type, prompt, id }, index) => (
              <FormField
                key={id}
                name={`responses.${index}.response`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{prompt}</FormLabel>
                    <FormControl>
                      {type === "long" ?
                        <Textarea
                          className="resize-none"
                          placeholder="Long response"
                          {...field}
                        />
                      : <Input
                          placeholder="Short response"
                          {...field}
                        />
                      }
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {props.submitted ?
              <p className="text-muted-foreground text-sm text-end">
                You have already submitted this application
              </p>
            : <div className="flex justify-end gap-2">
                <LoadingButton
                  type="submit"
                  variant="outline"
                  pending={pending && submitMode === "save"}
                  onClick={() => setSubmitMode("save")}
                >
                  Save Draft
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  pending={pending && submitMode === "submit"}
                  onClick={() => setSubmitMode("submit")}
                >
                  Submit
                </LoadingButton>
              </div>
            }
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default ApplyForm;

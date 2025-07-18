"use client";

import { insertTournamentApplication } from "@/app/dal/tournaments/actions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TournamentApplicationInfoSchema } from "@/lib/definitions";
import { format } from "date-fns";
import { FlaskConical } from "lucide-react";
import React, { startTransition, use, useActionState, useEffect } from "react";
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

type Props = {
  applicationPromise: Promise<{
    data?: z.infer<typeof TournamentApplicationInfoSchema>;
    error?: Error;
  }>;
};

const ApplyForm = (props: Props) => {
  const { data, error } = use(props.applicationPromise);
  if (error || !data) {
    return <div>{error?.message || "An unknown error occurred"}</div>;
  }

  const { id, ...tournament } = data;

  const [state, action, pending] = useActionState(
    insertTournamentApplication,
    undefined,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tournamentId: id,
      preferences: ["", "", "", ""],
      responses: tournament.applicationFields.map(({ id }) => ({
        fieldId: id,
        response: "",
      })),
    },
  });
  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    startTransition(() => {
      action({
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
          onSubmit={form.handleSubmit(onSubmit)}
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
            >
              Save for later
            </Button>
            <Button
              type="submit"
              disabled={pending}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplyForm;

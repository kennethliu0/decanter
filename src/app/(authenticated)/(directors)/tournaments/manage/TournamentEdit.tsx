"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { startTransition, use, useActionState } from "react";
import LocationCombobox from "./LocationCombobox";
import { Button } from "@/components/ui/button";
import z from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AvatarUpload from "@/components/ui/AvatarUpload";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "@/components/ui/form";
import DatePickerUncontrolled from "@/components/ui/DatePickerUncontrolled";
import {
  EditTournamentSchemaServer as ServerSchema,
  EditTournamentSchemaClient as FormSchema,
} from "@/lib/definitions";
import VolunteerApplicationEdit from "./VolunteerApplicationEdit";
import { upsertTournament } from "@/app/dal/tournaments/actions";
import { parse, format } from "date-fns";

type Props = {
  tournamentPromise?: Promise<z.infer<typeof ServerSchema> | { error: string }>;
};

const TournamentEdit = (props: Props) => {
  const promisedTournament =
    props.tournamentPromise ? use(props.tournamentPromise) : undefined;
  if (promisedTournament && "error" in promisedTournament) {
    return <div>{promisedTournament.error}</div>;
  }
  const {
    startDate: startDateString,
    endDate: endDateString,
    applyDeadline: applyDeadlineString,
    applicationFields,
    id,
    ...tournament
  } = promisedTournament || {
    imageUrl: "",
    websiteUrl: "",
    name: "",
    location: "",
    division: undefined,
    closedEarly: false,
    applicationFields: [],
    startDate: "",
    endDate: "",
    applyDeadline: "",
  };
  const applyDeadlineDate =
    applyDeadlineString ? new Date(applyDeadlineString) : undefined;

  const [state, action, pending] = useActionState(upsertTournament, undefined);
  const today = new Date();
  const defaultValues = React.useMemo(
    () => ({
      startDate:
        startDateString ?
          parse(startDateString, "yyyy-MM-dd", today)
        : undefined,
      endDate:
        endDateString ? parse(endDateString, "yyyy-MM-dd", today) : undefined,
      applyDeadlineDate,
      applyDeadlineTime:
        applyDeadlineDate ?
          `${applyDeadlineDate.getHours()}:${applyDeadlineDate.getMinutes()}`
        : "23:59",
      ...tournament,
      applicationFields,
    }),
    [
      startDateString,
      endDateString,
      applyDeadlineDate,
      tournament,
      applicationFields,
    ],
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });
  function onSubmit(values: z.infer<typeof FormSchema>) {
    const {
      applyDeadlineDate: applyDeadline,
      applyDeadlineTime,
      startDate,
      endDate,
      ...formValues
    } = values;
    const [hours, minutes] = applyDeadlineTime.split(":").map(Number);
    applyDeadline.setHours(hours, minutes, 59, 999);
    form.reset(values);
    console.log(startDate, endDate, applyDeadlineDate, applyDeadlineTime);
    startTransition(() => {
      action({
        id,
        applyDeadline: applyDeadline.toISOString(),
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        ...formValues,
      });
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 w-full">
          <div className="flex flex-col sm:flex-row-reverse gap-y-2 gap-x-4 justify-between items-start">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="mx-auto">
                    <FormLabel>Tournament Picture</FormLabel>
                  </div>
                  <FormControl>
                    <AvatarUpload
                      {...field}
                      error={Boolean(fieldState.error)}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="sr-only">
                    Upload a new image
                  </FormDescription>
                  {state?.errors?.imageUrl && (
                    <p className="text-sm text-destructive">
                      {state.errors.imageUrl}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {state?.errors?.name && (
                      <p className="text-sm text-destructive">
                        {state.errors.name}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://scilympiad.org/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {state?.errors?.websiteUrl && (
                      <p className="text-sm text-destructive">
                        {state.errors.websiteUrl}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <LocationCombobox {...field} />
                      </FormControl>
                      <FormMessage />
                      {state?.errors?.location && (
                        <p className="text-sm text-destructive">
                          {state.errors.location}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex h-9 items-center"
                          >
                            <FormItem className="flex gap-2">
                              <FormControl>
                                <RadioGroupItem value="B" />
                              </FormControl>
                              <FormLabel className="font-normal">B</FormLabel>
                            </FormItem>
                            <FormItem className="flex gap-2">
                              <FormControl>
                                <RadioGroupItem value="C" />
                              </FormControl>
                              <FormLabel className="font-normal">C</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        {state?.errors?.division && (
                          <p className="text-sm text-destructive">
                            {state.errors.division}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-start">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Tournament Start Date</FormLabel>
                      <FormControl>
                        <DatePickerUncontrolled
                          value={field.value}
                          onChange={field.onChange}
                          error={Boolean(fieldState.error)}
                          disablePast
                          disableOutOfSeason
                          small
                        />
                      </FormControl>
                      <FormMessage />
                      {state?.errors?.startDate && (
                        <p className="text-sm text-destructive">
                          {state.errors.startDate}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Tournament End Date</FormLabel>
                      <FormControl>
                        <DatePickerUncontrolled
                          value={field.value}
                          onChange={field.onChange}
                          disablePast
                          disableOutOfSeason
                          error={Boolean(fieldState.error)}
                          small
                        />
                      </FormControl>
                      <FormMessage />
                      {state?.errors?.endDate && (
                        <p className="text-sm text-destructive">
                          {state.errors.endDate}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-4 items-start">
                <FormField
                  control={form.control}
                  name="applyDeadlineDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Volunteer Application Due Date</FormLabel>
                      <FormControl>
                        <DatePickerUncontrolled
                          value={field.value}
                          onChange={field.onChange}
                          disablePast
                          disableOutOfSeason
                          small
                          error={Boolean(fieldState.error)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applyDeadlineTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          step="60"
                          {...field}
                          className="text-sm bg-background appearance-none py-2 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="sr-only">
                        Volunteer Application Deadline Time
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="closedEarly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Close application - manual override</FormLabel>
                      <div className="h-9 flex items-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                      {state?.errors?.closedEarly && (
                        <p className="text-sm text-destructive">
                          {state.errors.closedEarly}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {state?.errors?.applyDeadline && (
                <p className="text-sm text-destructive">
                  {state.errors.applyDeadline}
                </p>
              )}
            </div>
          </div>
          <h2 className="text-xl">Edit Volunteer Application</h2>
          <div className="text-sm">
            <p>Volunteers already provide the following fields:</p>
            <ul>
              <li>- Name</li>
              <li>- Contact e-mail</li>
              <li>- School and graduation year</li>
              <li>- Notable achievements</li>
              <li>- Past volunteer experience</li>
              <li>- First four event preferences</li>
            </ul>
            <br />
            <p>
              Do not include information that would go in your onboarding form
              such as T-Shirt size. Use this form for additional info that you
              need to process an application (think ability to travel for
              in-person tournaments, whether they are competing in the Division
              C tournament while applying for Division B, etc).
            </p>
            <br />
            <h3 className="text-xl">Fields</h3>
          </div>
          <FormField
            control={form.control}
            name="applicationFields"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">
                  Edit Volunteer Application Fields
                </FormLabel>
                <FormMessage />
                {state?.errors?.applicationFields && (
                  <p className="text-sm text-destructive">
                    {state.errors.applicationFields}
                  </p>
                )}
                <VolunteerApplicationEdit {...field} />
              </FormItem>
            )}
          />

          {form.formState.isDirty && (
            <div className="flex items-center gap-2 sticky bottom-4 justify-end bg-card/80 p-2 border-2 rounded-md">
              <p className="text-sm">Unsaved Changes </p>
              <Button
                variant="outline"
                type="reset"
                onClick={() => {
                  form.reset();
                }}
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={pending}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default TournamentEdit;

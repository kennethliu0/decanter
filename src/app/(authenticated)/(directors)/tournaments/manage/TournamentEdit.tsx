"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import LocationCombobox from "./LocationCombobox";
import { Button } from "@/components/ui/button";
import * as z from "zod/v4";
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
import { EditTournamentSchemaClient as FormSchema } from "@/lib/definitions";
import VolunteerApplicationEdit from "./VolunteerApplicationEdit";

type Props = { tournament: z.infer<typeof FormSchema> };

const today = new Date();

const TournamentEdit = (props: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...props.tournament,
    },
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
    console.log({
      applyDeadline: applyDeadline.toISOString(),
      startDate: startDate.toISOString().substring(0, 10),
      endDate: endDate.toISOString().substring(0, 10),
      ...formValues,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row-reverse justify-between items-start">
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
                    <FormDescription className="sr-only">Name</FormDescription>
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2 items-start">
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
                      <FormDescription className="sr-only">
                        Location
                      </FormDescription>
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
                        <FormDescription className="sr-only">
                          Division
                        </FormDescription>
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
                          {...field}
                          error={Boolean(fieldState.error)}
                          disablePast
                          disableOutOfSeason
                          small
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="sr-only">
                        Tournament Start Date
                      </FormDescription>
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
                          {...field}
                          disablePast
                          disableOutOfSeason
                          error={Boolean(fieldState.error)}
                          small
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="sr-only">
                        Tournament End Date
                      </FormDescription>
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
                          {...field}
                          disablePast
                          disableOutOfSeason
                          small
                          error={Boolean(fieldState.error)}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="sr-only">
                        Volunteer Application Due Date
                      </FormDescription>
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
                      <FormLabel>Manually close application early</FormLabel>
                      <div className="h-9 flex items-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
            <p>
              Do not include information that would go in your onboarding form
              such as T-Shirt size. Use this form for additional info that you
              need to process an application (think ability to travel for
              in-person tournaments, whether they are competing in the Division
              C tournament while applying for Division B, etc).
            </p>
            <h3 className="text-xl pt-2">Fields</h3>
          </div>
          <FormField
            control={form.control}
            name="applicationFields"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="sr-only">
                  Edit Volunteer Application Fields
                </FormLabel>
                <FormMessage />
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
              <Button type="submit">Save</Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default TournamentEdit;

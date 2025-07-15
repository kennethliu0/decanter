"use client";

import { TournamentInfo } from "@/app/(authenticated)/(volunteers)/tournaments/search/TournamentApplyCard";
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

type Props = { tournament: TournamentInfo };

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
      id: "stuff",
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
          {form.formState.isDirty && (
            <div className="flex justify-end items-center gap-2">
              <p className="text-muted-foreground text-sm">Unsaved Changes </p>

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

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
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
import GroupedEventPreferencesInput from "./GroupedEventPreferencesInput";
import { VolunteerProfileSchema as FormSchema } from "@/lib/definitions";

type Props = {
  user: z.infer<typeof FormSchema>;
};

const ProfileCardEdit = (props: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      education: props.user.education,
      bio: props.user.bio,
      experience: props.user.experience,
      eventsB: props.user.eventsB,
      eventsC: props.user.eventsC,
    },
  });
  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4 flex flex-col max-w-2xl mx-auto justify-center gap-4">
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <Input
                    placeholder="School and graduation year"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription className="sr-only">
                  School and graduation year
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-30"
                    placeholder="Any relevant achievements"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription className="sr-only">
                  Any relevant achievements
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-30"
                    placeholder="Past volunteering experience, including events and roles"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription className="sr-only">
                  Past volunteering experience, including events and roles
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventsB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division B Events</FormLabel>
                <FormControl>
                  <GroupedEventPreferencesInput
                    division="B"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventsC"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division C Events</FormLabel>
                <FormControl>
                  <GroupedEventPreferencesInput
                    division="C"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="reset"
              onClick={() => {
                form.reset();
              }}
            >
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileCardEdit;

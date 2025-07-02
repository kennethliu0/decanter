"use client";

import AvatarUpload from "@/components/ui/AvatarUpload";
import React from "react";
import { UserInfo } from "../ProfileCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { events } from "@/app/data";
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

type Props = {
  user: UserInfo;
};

const noEmptyGaps = (arr: string[]) => {
  let foundEmpty = false;
  for (const val of arr) {
    if (val === "") {
      foundEmpty = true;
    } else if (foundEmpty) {
      return false;
    }
  }
  return true;
};

const formSchema = z.object({
  imageUrl: z.url(),
  name: z.string().min(1, "Name cannot be empty"),
  education: z.string().min(1, "Education cannot be empty"),
  bio: z.string().min(1, "Bio cannot be empty"),
  experience: z.string().min(1, "Experience cannot be empty"),
  eventsB: z
    .array(z.string().refine((val) => val === "" || events.B.includes(val)))
    .length(4)
    .refine(noEmptyGaps, {
      message: "Empty slots must come after all selected events",
    }),
  eventsC: z
    .array(z.string().refine((val) => val === "" || events.C.includes(val)))
    .length(4)
    .refine(noEmptyGaps, {
      message: "Empty slots must come after all selected events",
    }),
});

const ProfileCardEdit = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: props.user.imageUrl,
      name: props.user.name,
      education: props.user.education,
      bio: props.user.bio,
      experience: props.user.experience,
      eventsB: props.user.eventsB,
      eventsC: props.user.eventsC,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4 flex flex-col max-w-2xl mx-auto justify-center gap-4">
          <div className="flex gap-4 flex-wrap">
            <div className="m-auto">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="mx-auto">
                      <FormLabel>Profile Picture</FormLabel>
                    </div>
                    <FormControl>
                      <AvatarUpload
                        {...field}
                        error={Boolean(fieldState.error)}
                        circle
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="sr-only">
                      Upload a new image
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2 grow">
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
            </div>
          </div>
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

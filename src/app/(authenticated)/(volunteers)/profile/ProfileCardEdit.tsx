"use client";

import React, { startTransition, use, useActionState, useEffect } from "react";
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
import { upsertProfile } from "@/utils/volunteer_profile";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

type Props = {
  profilePromise: Promise<z.infer<typeof FormSchema> | undefined>;
};

const ProfileCardEdit = (props: Props) => {
  const [state, action, pending] = useActionState(upsertProfile, undefined);

  const profile = props.profilePromise ? use(props.profilePromise) : undefined;
  const defaultValues = {
    name: profile?.name ?? "",
    education: profile?.education ?? "",
    bio: profile?.bio ?? "",
    experience: profile?.experience ?? "",
    preferencesB: profile?.preferencesB ?? ["", "", "", ""],
    preferencesC: profile?.preferencesC ?? ["", "", "", ""],
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });
  function onSubmit(values: z.infer<typeof FormSchema>) {
    startTransition(() => {
      action(values);
      form.reset(values);
    });
  }
  useEffect(() => {
    if (state?.success === true) {
      toast.success("Profile successfully updated!");
    } else if (state?.success === false) {
      toast.error("Something went wrong");
    }
  }, [state]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4 flex flex-col max-w-2xl min-w-xs mx-auto justify-center gap-4">
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
              </FormItem>
            )}
          />
          {state?.errors?.name && (
            <p className="text-red-400">{state.errors.name}</p>
          )}
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
          />{" "}
          {state?.errors?.education && (
            <p className="text-red-400">{state.errors.education}</p>
          )}
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
          {state?.errors?.bio && (
            <p className="text-red-400">{state.errors.bio}</p>
          )}
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
          {state?.errors?.experience && (
            <p className="text-red-400">{state.errors.experience}</p>
          )}
          <FormField
            control={form.control}
            name="preferencesB"
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
          {state?.errors?.preferencesB && (
            <p className="text-red-400">{state.errors.preferencesB}</p>
          )}
          <FormField
            control={form.control}
            name="preferencesC"
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
          {state?.errors?.preferencesC && (
            <p className="text-red-400">{state.errors.preferencesC}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="reset"
              onClick={() => {
                form.reset(defaultValues);
              }}
              disabled={!form.formState.isDirty}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || pending}
            >
              {pending ?
                <LoaderCircle className="mx-auto animate-spin" />
              : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileCardEdit;

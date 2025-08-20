"use client";

import { startTransition, useActionState, useEffect } from "react";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Button } from "@/components/shadcn/button";
import { useForm } from "react-hook-form";
import { infer as zodInfer } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import GroupedEventPreferencesInput from "./GroupedEventPreferencesInput";
import { VolunteerProfileSchema as FormSchema } from "@/lib/definitions";
import { upsertProfileAction } from "@/app/actions/volunteer-profiles";
import { toast } from "sonner";
import LoadingButton from "@/components/custom/LoadingButton";
type Props = {
  profile: zodInfer<typeof FormSchema> | undefined;
};

const ProfileCardEdit = ({ profile }: Props) => {
  const [state, action, pending] = useActionState(
    upsertProfileAction,
    undefined,
  );
  const defaultValues = {
    name: profile?.name ?? "",
    education: profile?.education ?? "",
    bio: profile?.bio ?? "",
    experience: profile?.experience ?? "",
    preferencesB: profile?.preferencesB ?? ["", "", "", ""],
    preferencesC: profile?.preferencesC ?? ["", "", "", ""],
  };
  const form = useForm<zodInfer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });
  function onSubmit(values: zodInfer<typeof FormSchema>) {
    startTransition(() => {
      action(values);
    });
  }
  useEffect(() => {
    if (state?.success === true) {
      toast.success("Profile successfully updated!");
      form.reset(form.getValues());
    } else if (state?.success === false) {
      toast.error(state.message ?? "Something went wrong");
    }
  }, [state]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
              </FormItem>
            )}
          />
          {state?.errors?.name && (
            <p className="text-destructive">{state.errors.name}</p>
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
            <p className="text-destructive">{state.errors.education}</p>
          )}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-21"
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
            <p className="text-destructive">{state.errors.bio}</p>
          )}
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-21"
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
            <p className="text-destructive">{state.errors.experience}</p>
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
            <p className="text-destructive">{state.errors.preferencesB}</p>
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
            <p className="text-destructive">{state.errors.preferencesC}</p>
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
            <LoadingButton
              type="submit"
              disabled={!form.formState.isDirty}
              pending={pending}
              className="relative"
            >
              Submit
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileCardEdit;

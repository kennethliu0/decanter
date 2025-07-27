"use client";

import { startTransition, use, useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/form";
import GroupedEventPreferencesInput from "./GroupedEventPreferencesInput";
import {
  VolunteerProfileSchema as FormSchema,
  Result,
} from "@/lib/definitions";
import { upsertProfile } from "@/app/dal/volunteer-profiles/actions";
import { toast } from "sonner";
import LoadingButton from "@/components/ui/LoadingButton";
import { CONTACT_EMAIL } from "@/lib/config";

type Props = {
  profilePromise: Promise<Result<{ profile: zodInfer<typeof FormSchema> }>>;
};

const ProfileCardEdit = (props: Props) => {
  const [state, action, pending] = useActionState(upsertProfile, undefined);

  const { data, error } = use(props.profilePromise);
  if (error) {
    return <ProfileError />;
  }
  const profile = data?.profile || null;
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
        <div className="px-4 flex flex-col max-w-2xl min-w-xs mx-auto justify-center gap-4">
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

const ProfileError = () => {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border p-4 bg-muted/30 text-center space-y-2">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">
        Your profile could not be retrieved. Please try again. If the issue
        persists, clear your browser cache or contact us at {CONTACT_EMAIL}.
      </p>
    </div>
  );
};

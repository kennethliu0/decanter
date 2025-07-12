"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { startTransition, use, useActionState, useEffect } from "react";
import { z } from "zod/v4";
import { UpdateSettingsSchema as FormSchema } from "@/lib/definitions";
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
import { updateSettings } from "@/utils/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Props = {
  settings: Promise<{
    email: string;
  }>;
};

const SettingsForm = ({ settings }: Props) => {
  const user = use(settings);

  const [state, action, pending] = useActionState(updateSettings, undefined);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: user.email },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    startTransition(() => {
      action(values);
    });
  }

  useEffect(() => {
    if (state?.success) {
      toast.success("Updated successfully", {
        description:
          "If you changed your email, check both old and new addresses for confirmation.",
      });
    } else if (state?.success === false) {
      toast.error("Something went wrong");
    }
  }, [state]);

  return (
    <div className="space-y-4 w-full max-w-sm px-4">
      {!pending && state?.message && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>
            <p className="text-left">{state.message}</p>
          </AlertTitle>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Update email</CardTitle>
          <CardDescription>
            Confirmation links will be sent to old and new emails.
          </CardDescription>
          <CardAction>
            <Link href="/update-password">
              <Button variant="link">Update password</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="updatesettingsform"
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        formNoValidate
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              {state?.errors?.email && (
                <p className="text-red-400">{state.errors.email}</p>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            form="updatesettingsform"
            disabled={pending}
          >
            Update Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsForm;

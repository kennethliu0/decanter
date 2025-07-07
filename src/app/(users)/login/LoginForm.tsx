"use client";

import React, { startTransition, useActionState } from "react";
import * as z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { login } from "@/actions/auth";
import { LoginFormSchema as FormSchema } from "@/lib/definitions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const LoginForm = () => {
  const [state, action, pending] = useActionState(login, undefined);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof FormSchema>) {
    startTransition(() => {
      action(values);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-card rounded-md border space-y-4 p-4 text-start">
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {state?.errors?.email && <p>{state.errors.email}</p>}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {state?.errors?.password && <p>{state.errors.password}</p>}

          <Button
            disabled={pending}
            type="submit"
            className="w-full"
          >
            Log in
          </Button>
        </div>
        {state?.message && (
          <Alert
            variant="destructive"
            className="mt-4"
          >
            <AlertCircleIcon />
            <AlertTitle>
              <p className="text-left">{state.message}</p>
            </AlertTitle>
          </Alert>
        )}
      </form>
    </Form>
  );
};

export default LoginForm;

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
import { signup } from "@/utils/auth";
import { SignupFormSchema as FormSchema } from "@/lib/definitions";

const SignupForm = () => {
  const [state, action, pending] = useActionState(signup, undefined);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
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
                    formNoValidate
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
          {state?.errors?.name && <p>{state.errors.name}</p>}
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
          {state?.errors?.password && (
            <div>
              <p>Password requirements:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {state?.errors?.confirmPassword && (
            <p>{state.errors.confirmPassword}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={pending}
          >
            Create Account
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;

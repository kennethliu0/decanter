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
import { login } from "@/app/dal/auth/actions";
import {
  LoginFormSchema as FormSchema,
  isLoginMessageKey,
  LoginMessages,
} from "@/lib/definitions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";

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

  const searchParams = useSearchParams();
  const code = searchParams.get("message") ?? "";
  const message = isLoginMessageKey(code) ? LoginMessages[code] : null;

  return (
    <div className="space-y-4 w-full max-w-sm px-4">
      {state?.message && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>
            <p className="text-left">{state.message}</p>
          </AlertTitle>
        </Alert>
      )}
      {message && (
        <Alert variant={message.error ? "destructive" : "default"}>
          <AlertCircleIcon />
          <AlertTitle>{message.title}</AlertTitle>
          <AlertDescription>{message.description}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
          <CardAction>
            <Link href="/signup">
              <Button variant="link">Sign up </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="loginform"
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
                    <FormLabel>
                      <div className="flex justify-between grow">
                        <div>Password</div>
                        <div className="ml-auto">
                          <Link href="/reset">Forgot password?</Link>
                        </div>
                      </div>
                    </FormLabel>
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            disabled={pending}
            type="submit"
            className="w-full"
            form="loginform"
          >
            Log in
          </Button>
          <GoogleSignInButton />
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;

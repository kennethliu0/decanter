import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import React from "react";

type Props = {};

const SettingsFormSkeleton = (props: Props) => {
  return (
    <div className="w-full max-w-sm px-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Update name and email.</CardDescription>
          <CardAction>
            <Link href="/update-password">
              <Button variant="link">Update password</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium leading-none">Name</Label>
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium leading-none">Email</Label>
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled
          >
            Loading...
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsFormSkeleton;

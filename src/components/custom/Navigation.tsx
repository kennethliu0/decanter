"use client";

import { Button } from "@/components/shadcn/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/shadcn/navigation-menu";
import { Menu, XIcon } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Separator } from "../shadcn/separator";
import DecanterIcon from "./DecanterIcon";
import LogoutButton from "./LogoutButton";

type Props = {};

const Navigation = (props: Props) => {
  const links = [
    { label: "Tournament Search", path: "/tournaments/search" },
    { label: "Volunteer Profile", path: "/profile" },
  ];
  return (
    <header className="bg-background sticky top-0 z-50 w-full px-8 py-2">
      <div className="hidden sm:flex justify-between items-center">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="px-4"
              >
                <Link href="/dashboard">
                  <div className="flex gap-2 items-center">
                    <DecanterIcon className="text-primary" />
                    <span className="font-semibold">Dashboard</span>
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {links.map(({ label, path }, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild>
                  <Link href={path}>
                    <span className="font-semibold">{label}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem className="ml-auto">
              <NavigationMenuLink asChild>
                <LogoutButton />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="ml-auto sm:hidden grow-0"
            size="icon"
            variant="ghost"
          >
            <div className="flex gap-2 items-center">
              <Menu />
              Menu
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="px-8 py-2"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Mobile navigation links</SheetDescription>
          </SheetHeader>
          <SheetClose asChild>
            <Button
              size="icon"
              variant="ghost"
            >
              <div className="flex gap-2 items-center">
                <XIcon />
                Menu
                <span className="sr-only">Close</span>
              </div>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/dashboard">Dashboard</Link>
          </SheetClose>
          {links.map((link, index) => (
            <SheetClose
              asChild
              key={index}
            >
              <Link
                href={link.path}
                key={index}
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          <Separator />
          <SheetClose asChild>
            <button
              className="text-left cursor-pointer"
              onClick={logout}
            >
              Log out
            </button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Navigation;

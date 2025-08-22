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
  navigationMenuTriggerStyle,
} from "@/components/shadcn/navigation-menu";
import Link from "next/link";
import React from "react";
import DecanterIcon from "./DecanterIcon";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="bg-background sticky top-0 z-50 w-full px-2 sm:px-8 py-4 border-b mb-4">
      <div className="flex items-center justify-between">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="px-4"
              >
                <Link href="/">
                  <div className="flex gap-2 items-center">
                    <DecanterIcon className="text-primary" />
                    <span className="font-semibold">Decanter</span>
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} border border-input `}
              >
                <Link href={"/login"}>
                  <p className="font-semibold">Sign In</p>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;

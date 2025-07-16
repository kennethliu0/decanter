import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { FlaskConical, Menu, User, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { logout } from "@/app/dal/auth/actions";
import { Separator } from "./separator";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="bg-background sticky top-0 z-50 w-full px-2 sm:px-8 py-2">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost">
            <FlaskConical color="white" />
          </Button>
        </Link>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} border border-input sm:border-none `}
              >
                <Link href={"/login"}>
                  <p className="font-semibold">Sign In</p>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} hidden sm:block border border-input`}
              >
                <Link href={"/signup"}>
                  <p className="font-semibold">Sign Up</p>
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

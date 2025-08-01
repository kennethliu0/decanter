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
} from "@/components/ui/navigation-menu";
import { Menu, User, XIcon } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Separator } from "./separator";
import DecanterIcon from "./DecanterIcon";

type Props = {};

const Navigation = (props: Props) => {
  const links = [
    { label: "Manage Tournaments", path: "/tournaments" },
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
                <Link href="/">
                  <DecanterIcon className="text-primary" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {links.map(({ label, path }, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild>
                  <Link href={path}>
                    <p className="font-semibold">{label}</p>
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
                <button
                  onClick={logout}
                  className="font-semibold"
                >
                  Log Out
                </button>
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
          {links.map((link, index) => (
            <SheetClose
              asChild
              key={index}
            >
              <Link
                href={link.path}
                key={index}
              >
                <p>{link.label}</p>
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

"use client";
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
import { FlaskConical, Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type Props = {};

const Navigation = (props: Props) => {
  const links = [
    { label: "My Tournaments", path: "/" },
    { label: "Tournament Search", path: "/tournaments/search" },
    { label: "User Profile", path: "/profile" },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex w-full h-[80px] items-center p-5 gap-5 border-b">
      <div className="flex items-center gap-5 grow-1">
        <FlaskConical size={24} />
        <h1 className="text-3xl">Decanter</h1>
        <div className="hidden sm:flex items-center grow-1 gap-5">
          {links.map((link, index) => (
            <Link
              href={link.path}
              key={index}
            >
              <p>{link.label}</p>
            </Link>
          ))}
        </div>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="sm:hidden grow-0"
            size="icon"
            variant="ghost"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="p-6">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Mobile navigation links</SheetDescription>
          </SheetHeader>
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;

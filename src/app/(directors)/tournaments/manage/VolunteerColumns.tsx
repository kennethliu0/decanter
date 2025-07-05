"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Volunter = {
  id: string;
  name: string;
  email: string;
  education: string;
};

export const columns: ColumnDef<Volunter>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "education",
    header: "Education",
  },
];

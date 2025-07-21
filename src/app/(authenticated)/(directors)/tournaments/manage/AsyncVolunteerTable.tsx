"use client";
import { Result } from "@/lib/definitions";
import React, { use } from "react";
import { DataTable } from "./DataTable";
import { columns } from "./VolunteerColumns";

type Props = {
  applicationsPromise: Promise<
    Result<{
      applications: {
        id: string;
        name: string;
        email: string;
        education: string;
      }[];
    }>
  >;
};

const AsyncVolunteerTable = (props: Props) => {
  const { data, error } = use(props.applicationsPromise);

  if (error) {
    return (
      <div className="rounded-md border h-96 flex justify-center items-center">
        <div className="text-destructive">{error.message}</div>
      </div>
    );
  }

  return (
    <DataTable
      data={data?.applications ?? []}
      columns={columns}
    />
  );
};

export default AsyncVolunteerTable;

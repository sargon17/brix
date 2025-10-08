"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dateFormatter } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import CreateRequestForm from "./requests/create-request-form";
import DefaultTable from "@/components/organisms/default-table";

type VendorRow = Doc<"vendors">;

const columns: ColumnDef<VendorRow>[] = [
  {
    header: "Vendor",
    accessorKey: "name",
    cell: ({ row }) => {
      const categories = row.original.categories;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">
            {row.original.name}
          </span>
          <div className="text-muted-foreground text-xs">
            {categories?.length ? categories.join(" · ") : "—"}
          </div>
        </div>
      );
    },
  },
  {
    header: "VAT number",
    accessorKey: "vatNumber"
  },
  {
    header: "Contact",
    accessorKey: "primaryContact",
    cell: ({ row }) => {
      const contact = row.original.primaryContact;
      if (!contact?.name) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <div className="flex flex-col gap-0.5 text-sm">
          <span>{contact.name}</span>
          <span className="text-muted-foreground">
            {contact.email ?? contact.phone ?? "—"}
          </span>
        </div>
      );
    },
  },
  {
    header: "Headquarter",
    accessorFn: (val => `${val.headquarters?.city}, ${val.headquarters?.country}`)
  },
  {
    header: "Last updated",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const timestamp = row.original.updatedAt ?? row.original._creationTime;
      const date = new Date(timestamp);

      return (
        <time
          className="text-sm text-muted-foreground"
          dateTime={date.toISOString()}
        >
          {dateFormatter.format(date)}
        </time>
      );
    },
  },
];


export function VendorTable() {
  const data = useQuery(api.vendors.list);


  const tableData = useMemo<VendorRow[]>(
    () =>
      (data ?? []).map((row) => ({
        ...row,
        id: String(row._id),
      })),
    [data]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });


  return (
    <div className="space-y-4">
      <div
        className="max-w-xl"
      >
        <Label htmlFor="search">Search Vendor</Label>
        <Input
          id="search"
          placeholder="Vendor"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          } />
      </div>

      <DefaultTable<VendorRow, Doc<"vendors">>
        data={data}
        table={table}
        emptyStateView={
          <EmptyView
            name={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          />
        }
      />

    </div>
  );
}


function EmptyView({ name }: { name: string }) {
  return (
    <div className="h-full content-center ">
      <Empty >
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>Vendor {name} Not Found</EmptyTitle>
          <EmptyDescription>
            Can't find the vendor you're looking for? You can request it to be added to the catalog..
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex">
            <CreateRequestForm>
              <Button>Request a Vendor Onboarding</Button>
            </CreateRequestForm>
          </div>
        </EmptyContent>
      </Empty >
    </div>
  )
}

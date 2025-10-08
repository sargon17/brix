"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

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

const skeletonRows = Array.from({ length: 4 }, (_, index) => index);

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

  if (data === undefined) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-card/40 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-2">
          {skeletonRows.map((key) => (
            <Skeleton key={key} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

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

      {!table.getRowCount() ? (
        <EmptyTable name={table.getColumn("name")?.getFilterValue() as string} />
      ) : (
        <div className="rounded-lg border border-border bg-card/40">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="*:odd:bg-zinc-50 *:odd:hover:bg-zinc-100 *:odd:dark:bg-zinc-900 dark:*:odd:hover:bg-zinc-800">
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="text-left px-4 pb-4">
              Showing {tableData.length} {tableData.length === 1 ? "vendor" : "vendors"}
            </TableCaption>
          </Table>
        </div>
      )}
    </div>
  );
}


function EmptyTable({ name }: { name: string }) {
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

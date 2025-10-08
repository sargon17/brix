"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { CalendarClock, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateRequestForm from "../../_components/requests/create-request-form";
import { dateFormatter } from "@/lib/utils";

type VendorRequestRow = Doc<"vendor_requests">;

const columns: ColumnDef<VendorRequestRow>[] = [
  {
    header: "Vendor request",
    accessorKey: "name",
    cell: ({ row }) => {
      const request = row.original;
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-foreground">
            {request.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {request.justification
              ? request.justification
                .slice(0, 80)
                .concat(request.justification.length > 80 ? "..." : "")
              : "No justification provided"}
          </span>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span className="text-sm font-medium capitalize text-foreground">
          {status}
        </span>
      );
    },
  },
  {
    header: "Requested",
    accessorKey: "requestedAt",
    cell: ({ row }) => {
      const requestedAt = row.original.requestedAt;
      return (
        <div className="flex flex-col text-sm">
          <time
            className="text-muted-foreground"
            dateTime={new Date(requestedAt).toISOString()}
          >
            {dateFormatter.format(requestedAt)}
          </time>
        </div>
      );
    },
  },
  {
    header: "Project",
    accessorKey: "projectName",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.projectName ?? "—"}
      </span>
    ),
  },
];

const skeletonRows = Array.from({ length: 4 }, (_, index) => index);

export default function VendorRequestsTable() {
  const data = useQuery(api.vendorRequests.list);

  const tableData = useMemo<VendorRequestRow[]>(
    () =>
      (data ?? []).map((row) => ({
        ...row,
        id: String(row._id),
      })),
    [data],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
      <div className="max-w-xl">
        <Label htmlFor="search">Search Requests</Label>
        <Input
          id="search"
          placeholder="Vendor name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
      </div>

      {!table.getRowCount() ? (
        <EmptyTable
          name={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        />
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
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
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
            <TableCaption className="px-4 pb-4 text-left">
              Showing {tableData.length}{" "}
              {tableData.length === 1 ? "request" : "requests"}
            </TableCaption>
          </Table>
        </div>
      )}
    </div>
  );
}

function EmptyTable({ name }: { name: string }) {
  return (
    <div className="h-full content-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {name ? <ClipboardList /> : <CalendarClock />}
          </EmptyMedia>
          <EmptyTitle>
            {name ? `No requests for "${name}"` : "No vendor requests yet"}
          </EmptyTitle>
          <EmptyDescription>
            {name
              ? "Try adjusting your search or request a new vendor."
              : "Track onboarding progress by submitting a vendor request."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateRequestForm>
            <Button>Request a Vendor Onboarding</Button>
          </CreateRequestForm>
        </EmptyContent>
      </Empty>
    </div>
  );
}

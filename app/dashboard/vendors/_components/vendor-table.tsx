"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
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

type VendorRow = {
  id: string;
  name: string;
  vatNumber: string | null;
  industry: string | null;
  categories: string[];
  complianceStatus: "verified" | "pending" | "expired" | "unknown";
  lifespanStatus: "active" | "inactive" | "archived";
  sourcingChannel: "catalog" | "imported" | "manual";
  createdAt: number;
  updatedAt: number | null;
  primaryContact: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  requestCounts: {
    total: number;
    pending: number;
    approved: number;
  };
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

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
    header: "Compliance",
    accessorKey: "complianceStatus",
    cell: ({ getValue }) => {
      const status = getValue() as VendorRow["complianceStatus"];
      const labelMap: Record<VendorRow["complianceStatus"], string> = {
        verified: "Verified",
        pending: "Pending",
        expired: "Expired",
        unknown: "Unknown",
      };
      const colorMap: Record<VendorRow["complianceStatus"], string> = {
        verified: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
        pending: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
        expired: "bg-rose-500/10 text-rose-500 ring-rose-500/20",
        unknown: "bg-muted text-muted-foreground ring-muted/30",
      };

      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorMap[status]}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {labelMap[status]}
        </span>
      );
    },
  },
  {
    header: "Channel",
    accessorKey: "sourcingChannel",
    cell: ({ getValue }) => {
      const channel = getValue() as VendorRow["sourcingChannel"];
      const label =
        channel === "manual"
          ? "Manual"
          : channel === "imported"
            ? "Imported"
            : "Catalog";
      return <span className="text-sm text-muted-foreground">{label}</span>;
    },
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
    header: "Requests",
    accessorKey: "requestCounts",
    cell: ({ row }) => {
      const counts = row.original.requestCounts;
      if (!counts.total) {
        return <span className="text-muted-foreground">No linked requests</span>;
      }

      return (
        <div className="text-sm">
          <span className="font-medium">{counts.total}</span>{" "}
          <span className="text-muted-foreground">
            total
            {counts.pending ? ` • ${counts.pending} pending` : ""}
          </span>
        </div>
      );
    },
  },
  {
    header: "Last updated",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const timestamp = row.original.updatedAt ?? row.original.createdAt;
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
        id: String(row.id),
        complianceStatus:
          row.complianceStatus === "verified" ||
            row.complianceStatus === "pending" ||
            row.complianceStatus === "expired"
            ? row.complianceStatus
            : "unknown",
      })),
    [data]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
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

  if (!tableData.length) {
    return (<EmptyTable />)
  }

  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
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
        <TableBody>
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
        <TableCaption className="text-left">
          Showing {tableData.length} {tableData.length === 1 ? "vendor" : "vendors"} • synced from Convex
        </TableCaption>
      </Table>
    </div>
  );
}


function EmptyTable() {
  return (
    <div className="h-full content-center ">
      <Empty >
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>Vendor Not Found</EmptyTitle>
          <EmptyDescription>
            Can't find the vendor you're looking for? You can request it to be added to the catalog..
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex">
            <Button>Request a Vendor</Button>
          </div>
        </EmptyContent>
      </Empty >
    </div>
  )
}

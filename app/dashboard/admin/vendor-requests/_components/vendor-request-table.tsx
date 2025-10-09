"use client";

import { Label } from "@radix-ui/react-label";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { Building2, Check, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import DefaultTable from "@/components/organisms/default-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { cn, dateFormatter } from "@/lib/utils";

type VendorRequestRow = Doc<"vendor_requests">;
const STATUS_FILTERS = [
  "all",
  "pending",
  "reviewing",
  "approved",
  "rejected",
] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function VendorRequestsTable() {
  const data = useQuery(api.vendorRequests.listAll);
  const updateStatus = useMutation(api.vendorRequests.updateStatus);
  const [processingId, setProcessingId] =
    useState<Id<"vendor_requests"> | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  const handleDecision = useCallback(
    async (
      requestId: Id<"vendor_requests">,
      status: "approved" | "rejected",
    ) => {
      try {
        setProcessingId(requestId);
        await updateStatus({ requestId, status });
      } catch (error) {
        console.error("Failed to update vendor request status", error);
      } finally {
        setProcessingId(null);
      }
    },
    [updateStatus],
  );

  const columns = useMemo<ColumnDef<VendorRequestRow>[]>(
    () => [
      {
        header: "Vendor request",
        accessorKey: "name",
        cell: ({ row }) => {
          const request = row.original;
          return (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground capitalize">
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
          const indicatorClass = cn(
            "h-2 w-2 rounded-full",
            status === "approved" && "bg-emerald-500",
            status === "rejected" && "bg-destructive",
            status === "reviewing" && "bg-blue-500",
            status === "pending" && "bg-yellow-500",
          );

          return (
            <Badge variant="secondary">
              <span className={indicatorClass} aria-hidden="true" />
              <span className="capitalize">{status}</span>
            </Badge>
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
        header: "Actions",
        cell: ({ row }) => {
          const requestId = row.original._id;
          const isProcessing = processingId === requestId;
          const isResolved = row.original.status !== "pending";

          return (
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleDecision(requestId, "approved")}
                    disabled={isProcessing || isResolved}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Approve</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleDecision(requestId, "rejected")}
                    disabled={isProcessing || isResolved}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reject</TooltipContent>
              </Tooltip>

              <Button variant="outline" size="sm" disabled={isProcessing}>
                Edit
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDecision, processingId],
  );

  const tableData = useMemo<VendorRequestRow[]>(
    () =>
      (data ?? []).map((row) => ({
        ...row,
        id: String(row._id),
      })),
    [data],
  );

  const filteredTableData = useMemo(
    () =>
      tableData.filter((row) =>
        statusFilter === "all" ? true : row.status === statusFilter,
      ),
    [tableData, statusFilter],
  );

  const table = useReactTable({
    data: filteredTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

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

      <Tabs
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        className="space-y-4"
      >
        <TabsList className="ml-auto">
          {STATUS_FILTERS.map((filter) => (
            <TabsTrigger key={filter} value={filter}>
              {filter === "all"
                ? "All"
                : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={statusFilter} className="m-0 p-0">
          <DefaultTable<VendorRequestRow, Doc<"vendor_requests">>
            data={data}
            table={table}
            emptyStateView={
              <EmptyView
                name={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
              />
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyView({ name }: { name: string }) {
  return (
    <div className="h-full content-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>
            {name ? `No requests for "${name}"` : "No vendor requests yet"}
          </EmptyTitle>
          <EmptyDescription>
            {name
              ? "Try adjusting your search or request a new vendor."
              : "Your work here is done, go rest"}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
} from "@tanstack/react-table";

import type { Table as TableType } from "@tanstack/react-table";
import type { ReactNode } from "react";

interface DefaultTypeProps<T, R> {
  data?: R[]
  table: TableType<T>
  emptyStateView?: ReactNode
}

const skeletonRows = Array.from({ length: 4 }, (_, index) => index);
export default function DefaultTable<T, R>({ data, table, emptyStateView }: DefaultTypeProps<T, R>) {

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

  if (!table.getRowCount()) {
    return emptyStateView
  }


  return (
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
      </Table>
    </div>
  )
}

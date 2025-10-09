"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
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
} from "@/components/ui/empty";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    accessorKey: "vatNumber",
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
    accessorFn: (val) =>
      `${val.headquarters?.city}, ${val.headquarters?.country}`,
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
  const [selectedVendor, setSelectedVendor] = useState<VendorRow | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const tableData = useMemo<VendorRow[]>(
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

  const handleRowClick = (row: VendorRow) => {
    setSelectedVendor(row);
    setDetailsOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setDetailsOpen(nextOpen);
    if (!nextOpen) {
      setSelectedVendor(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-w-xl">
        <Label htmlFor="search">Search Vendor</Label>
        <Input
          id="search"
          placeholder="Vendor"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
      </div>

      <DefaultTable<VendorRow, Doc<"vendors">>
        data={data}
        table={table}
        onRowClick={(row) => handleRowClick(row.original)}
        emptyStateView={
          <EmptyView
            name={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          />
        }
      />

      <Dialog open={detailsOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="md:min-w-[560px]">
          {selectedVendor ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVendor.name}</DialogTitle>
                <DialogDescription>
                  Detailed information about this vendor.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6 pt-2">
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Company
                    </h3>
                    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">VAT number</dt>
                        <dd>{selectedVendor.vatNumber ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Industry</dt>
                        <dd>{selectedVendor.industry ?? "—"}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-muted-foreground">Categories</dt>
                        <dd>
                          {selectedVendor.categories?.length
                            ? selectedVendor.categories.join(" · ")
                            : "—"}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-muted-foreground">Website</dt>
                        <dd>
                          {selectedVendor.website ? (
                            <a
                              href={
                                selectedVendor.website.startsWith("http")
                                  ? selectedVendor.website
                                  : `https://${selectedVendor.website}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline"
                            >
                              {selectedVendor.website}
                            </a>
                          ) : (
                            "—"
                          )}
                        </dd>
                      </div>
                    </dl>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Headquarters
                    </h3>
                    <div className="rounded-md border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                      {selectedVendor.headquarters ? (
                        <>
                          <div>
                            {selectedVendor.headquarters.addressLine1 ?? "—"}
                          </div>
                          {selectedVendor.headquarters.addressLine2 ? (
                            <div>
                              {selectedVendor.headquarters.addressLine2}
                            </div>
                          ) : null}
                          <div>
                            {[
                              selectedVendor.headquarters.postalCode,
                              selectedVendor.headquarters.city,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          </div>
                          <div>
                            {[
                              selectedVendor.headquarters.region,
                              selectedVendor.headquarters.country,
                            ]
                              .filter(Boolean)
                              .join(", ") || "—"}
                          </div>
                        </>
                      ) : (
                        "—"
                      )}
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Primary contact
                    </h3>
                    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">Name</dt>
                        <dd>{selectedVendor.primaryContact?.name ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Role</dt>
                        <dd>{selectedVendor.primaryContact?.role ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>{selectedVendor.primaryContact?.email ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd>{selectedVendor.primaryContact?.phone ?? "—"}</dd>
                      </div>
                    </dl>
                  </section>
                </div>
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyView({ name }: { name: string }) {
  return (
    <div className="h-full content-center ">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>Vendor {name} Not Found</EmptyTitle>
          <EmptyDescription>
            Can't find the vendor you're looking for? You can request it to be
            added to the catalog..
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex">
            <CreateRequestForm>
              <Button>Request a Vendor Onboarding</Button>
            </CreateRequestForm>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

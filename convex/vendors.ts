import { query } from "./_generated/server";

const defaultComplianceStatus = "pending" as const;

export const list = query(async ({ db }) => {
  const vendors = await db.query("vendors").collect();
  const requests = await db.query("vendor_requests").collect();

  const requestMap = new Map<
    string,
    { total: number; pending: number; approved: number }
  >();

  for (const request of requests) {
    const vendorId = request.linkedVendorId;
    if (!vendorId) {
      continue;
    }

    const counts =
      requestMap.get(vendorId) ?? { total: 0, pending: 0, approved: 0 };

    counts.total += 1;
    if (request.status === "pending" || request.status === "reviewing") {
      counts.pending += 1;
    }
    if (request.status === "approved") {
      counts.approved += 1;
    }

    requestMap.set(vendorId, counts);
  }

  return []

  return vendors.map((vendor) => {
    const counts = requestMap.get(vendor._id) ?? {
      total: 0,
      pending: 0,
      approved: 0,
    };

    return {
      id: vendor._id,
      name: vendor.name,
      vatNumber: vendor.vatNumber ?? null,
      industry: vendor.industry ?? null,
      categories: vendor.categories ?? [],
      complianceStatus: vendor.complianceStatus ?? defaultComplianceStatus,
      lifespanStatus: vendor.lifespanStatus,
      sourcingChannel: vendor.sourcingChannel,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt ?? null,
      primaryContact: vendor.primaryContact ?? null,
      requestCounts: counts,
    };
  });
});

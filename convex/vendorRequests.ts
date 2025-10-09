import { v } from "convex/values";
import { normalizeObject } from "@/lib/utils";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

type HeadquartersInput = Doc<"vendor_requests">["headquarters"];
type ContactInput = Doc<"vendor_requests">["primaryContact"];

export const create = mutation({
  args: {
    name: v.string(),
    vatNumber: v.optional(v.string()),
    registrationId: v.optional(v.string()),
    website: v.optional(v.string()),
    headquarters: v.optional(
      v.object({
        addressLine1: v.optional(v.string()),
        addressLine2: v.optional(v.string()),
        city: v.optional(v.string()),
        region: v.optional(v.string()),
        postalCode: v.optional(v.string()),
        country: v.optional(v.string()),
      }),
    ),
    industry: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    yearFounded: v.optional(v.number()),
    primaryContact: v.optional(
      v.object({
        name: v.string(),
        role: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
      }),
    ),
    justification: v.string(),
    projectName: v.optional(v.string()),
    requestedById: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const { requestedById, ...request } = args;

    const fallbackUser = requestedById ? null : await db.query("users").first();

    const requester = requestedById ?? fallbackUser?._id;

    if (!requester) {
      throw new Error("Unable to resolve requester for vendor request.");
    }

    const cleanedHeadquarters = normalizeObject<HeadquartersInput | undefined>(
      request.headquarters,
    );
    const cleanedPrimary = normalizeObject<ContactInput | undefined>(
      request.primaryContact,
    );

    return await db.insert("vendor_requests", {
      ...request,
      headquarters: cleanedHeadquarters,
      primaryContact: cleanedPrimary,
      requestedBy: requester,
      requestedAt: Date.now(),
      status: "pending",
    });
  },
});

export const list = query(async ({ db }) => {
  const user = await db
    .query("users")
    .filter((q) => q.eq(q.field("role"), "buyer"))
    .first();

  const requests = await db
    .query("vendor_requests")
    .filter((q) => q.eq(q.field("requestedBy"), user?._id))
    .collect();

  return requests;
});

export const listPending = query(async ({ db }) => {
  const requests = await db
    .query("vendor_requests")
    .filter((q) => q.eq(q.field("status"), "pending"))
    .collect();

  return requests;
});

export const listAll = query(async ({ db }) => {
  const requests = await db.query("vendor_requests").collect();
  return requests;
});

export const updateStatus = mutation({
  args: {
    requestId: v.id("vendor_requests"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    decisionNotes: v.optional(v.string()),
  },
  handler: async ({ db }, { requestId, status, decisionNotes }) => {
    const request = await db.get(requestId);
    if (!request) {
      throw new Error("Vendor request not found.");
    }

    const reviewer =
      (await db
        .query("users")
        .filter((q) => q.eq(q.field("role"), "admin"))
        .first()) ?? null;

    if (!reviewer) {
      throw new Error("Unable to resolve reviewer for vendor request.");
    }

    const now = Date.now();
    const patch: Partial<Doc<"vendor_requests">> = {
      status,
      reviewedBy: reviewer._id,
      reviewedAt: now,
    };

    if (status === "approved") {
      let linkedVendorId = request.linkedVendorId;

      if (!linkedVendorId) {
        const newVendor: Omit<Doc<"vendors">, "_id" | "_creationTime"> = {
          name: request.name,
          vatNumber: request.vatNumber,
          registrationId: request.registrationId,
          website: request.website,
          headquarters: request.headquarters,
          industry: request.industry,
          categories: request.categories,
          yearFounded: request.yearFounded,
          primaryContact: request.primaryContact,
          secondaryContact: request.secondaryContact,
          notes: request.justification,
          createdBy: reviewer._id,
          updatedAt: now,
          updatedBy: reviewer._id,
        };

        linkedVendorId = await db.insert("vendors", newVendor);
      } else {
        await db.patch(linkedVendorId, {
          updatedAt: now,
          updatedBy: reviewer._id,
        });
      }

      patch.linkedVendorId = linkedVendorId;
    }

    if (decisionNotes !== undefined) {
      patch.decisionNotes = decisionNotes;
    }

    await db.patch(requestId, patch);
  },
});

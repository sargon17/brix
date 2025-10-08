import { normalizeObject } from "@/lib/utils";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


type HeadquartersInput = Doc<"vendor_requests">["headquarters"]
type ContactInput = Doc<"vendor_requests">["primaryContact"]

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
      })
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
      })
    ),
    justification: v.string(),
    projectName: v.optional(v.string()),
    requestedById: v.optional(v.id("users")),
  },
  handler: async ({ db }, args) => {
    const {
      requestedById,
      ...request
    } = args;

    const fallbackUser = requestedById
      ? null
      : await db.query("users").first();

    const requester =
      requestedById ??
      fallbackUser?._id;

    if (!requester) {
      throw new Error("Unable to resolve requester for vendor request.");
    }

    const cleanedHeadquarters = normalizeObject<HeadquartersInput | undefined>(
      request.headquarters
    );
    const cleanedPrimary = normalizeObject<ContactInput | undefined>(
      request.primaryContact
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

  const user = await db.query("users")
  .filter(q =>
    q.eq(q.field('role'), 'buyer')
  ).first()

  const requests = await db.query("vendor_requests")
  .filter(
    q => q.eq(q.field("requestedBy"), user?._id)
  )
  .collect();

  return requests;
});

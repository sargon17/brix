import { mutation } from "./_generated/server";
import { v } from "convex/values";

type HeadquartersInput = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
};

type ContactInput = {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
};

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
    secondaryContact: v.optional(
      v.object({
        name: v.optional(v.string()),
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

    const cleanedHeadquarters = normalizeObject<HeadquartersInput>(
      request.headquarters
    );
    const cleanedPrimary = normalizeObject<ContactInput>(
      request.primaryContact
    );
    const cleanedSecondary = normalizeObject<ContactInput>(
      request.secondaryContact
    );

    return await db.insert("vendor_requests", {
      ...request,
      headquarters: cleanedHeadquarters,
      primaryContact: cleanedPrimary,
      secondaryContact: cleanedSecondary,
      requestedBy: requester,
      requestedAt: Date.now(),
      status: "pending",
    });
  },
});

function normalizeObject<T extends Record<string, unknown> | undefined>(
  value: T
) {
  if (!value) {
    return undefined;
  }

  const filteredEntries = Object.entries(value).filter(
    ([, fieldValue]) =>
      fieldValue !== undefined &&
      fieldValue !== null &&
      fieldValue !== ""
  );

  if (filteredEntries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(filteredEntries) as NonNullable<T>;
}

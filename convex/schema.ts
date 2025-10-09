import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const vendorIdentityFields = {
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
};

const vendorBusinessFields = {
  industry: v.optional(v.string()),
  categories: v.optional(v.array(v.string())),
  yearFounded: v.optional(v.number()),
};

const vendorContactFields = {
  primaryContact: v.optional(
    v.object({
      name: v.string(),
      role: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
    }),
  ),
  secondaryContact: v.optional(
    v.object({
      name: v.optional(v.string()),
      role: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
    }),
  ),
};

const auditFields = {
  createdBy: v.id("users"),
  updatedAt: v.optional(v.number()),
  updatedBy: v.optional(v.id("users")),
};

const vendorFields = {
  ...vendorIdentityFields,
  ...vendorBusinessFields,
  ...vendorContactFields,
  notes: v.optional(v.string()),
};

const vendorRequestFields = {
  ...vendorIdentityFields,
  ...vendorBusinessFields,
  ...vendorContactFields,
  justification: v.string(),
  projectName: v.optional(v.string()),
};

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("buyer"), v.literal("manager"), v.literal("admin")),
    avatarUrl: v.optional(v.string()),
  }).index("by_email", ["email"]),

  vendors: defineTable({
    ...vendorFields,
    ...auditFields,
  })
    .index("by_name", ["name"])
    .index("by_vat", ["vatNumber"]),

  vendor_requests: defineTable({
    ...vendorRequestFields,
    requestedBy: v.id("users"),
    requestedAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    decisionNotes: v.optional(v.string()),
    linkedVendorId: v.optional(v.id("vendors")),
  })
    .index("by_status", ["status", "requestedAt"])
    .index("by_requester", ["requestedBy", "requestedAt"])
    .index("by_vat", ["vatNumber"]),
});

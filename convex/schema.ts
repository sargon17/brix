import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

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
    })
  ),
};

const vendorBusinessFields = {
  industry: v.optional(v.string()),
  categories: v.optional(v.array(v.string())),
  yearFounded: v.optional(v.number()),
  employeeCount: v.optional(v.number()),
  annualRevenue: v.optional(
    v.object({
      currency: v.string(),
      amountRange: v.union(
        v.literal("lt_1m"),
        v.literal("1m_5m"),
        v.literal("5m_20m"),
        v.literal("20m_plus")
      ),
    })
  ),
  insurance: v.optional(
    v.object({
      expiresOn: v.optional(v.number()),
      provider: v.optional(v.string()),
    })
  ),
};

const vendorContactFields = {
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
};

const auditFields = {
  createdAt: v.number(),
  createdBy: v.id("users"),
  updatedAt: v.optional(v.number()),
  updatedBy: v.optional(v.id("users")),
};

const vendorFields = {
  ...vendorIdentityFields,
  ...vendorBusinessFields,
  ...vendorContactFields,
  complianceStatus: v.optional(
    v.union(
      v.literal("verified"),
      v.literal("pending"),
      v.literal("expired")
    )
  ),
  notes: v.optional(v.string()),
};

const vendorRequestFields = {
  ...vendorIdentityFields,
  ...vendorBusinessFields,
  ...vendorContactFields,
  justification: v.string(),
  projectName: v.optional(v.string()),
  expectedSpend: v.optional(
    v.object({
      currency: v.string(),
      value: v.number(),
    })
  ),
  priority: v.union(
    v.literal("low"),
    v.literal("medium"),
    v.literal("high")
  ),
};

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("buyer"),
      v.literal("manager"),
      v.literal("admin")
    ),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  vendors: defineTable({
    ...vendorFields,
    sourcingChannel: v.union(
      v.literal("catalog"),
      v.literal("imported"),
      v.literal("manual")
    ),
    lifespanStatus: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("archived")
    ),
    ...auditFields,
  })
    .index("by_name", ["name"])
    .index("by_vat", ["vatNumber"])
    .index("by_status", ["lifespanStatus", "createdAt"]),

  vendor_requests: defineTable({
    ...vendorRequestFields,
    requestedBy: v.id("users"),
    requestedAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("approved"),
      v.literal("rejected")
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

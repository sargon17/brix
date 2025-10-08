import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

type UserSeed = {
  name: string;
  email: string;
  role: "buyer" | "manager" | "admin";
  createdAt: number;
  avatarUrl?: string;
};

type VendorSeed = {
  name: string;
  vatNumber?: string;
  registrationId?: string;
  website?: string;
  headquarters?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  industry?: string;
  categories?: string[];
  yearFounded?: number;
  employeeCount?: number;
  annualRevenue?: {
    currency: string;
    amountRange: "lt_1m" | "1m_5m" | "5m_20m" | "20m_plus";
  };
  insurance?: {
    expiresOn?: number;
    provider?: string;
  };
  primaryContact?: {
    name: string;
    role?: string;
    email?: string;
    phone?: string;
  };
  secondaryContact?: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
  };
  complianceStatus?: "verified" | "pending" | "expired";
  notes?: string;
  sourcingChannel: "catalog" | "imported" | "manual";
  lifespanStatus: "active" | "inactive" | "archived";
  createdAt: number;
  updatedAt?: number;
  createdByEmail: string;
  updatedByEmail?: string;
};

type VendorRequestSeed = {
  name: string;
  vatNumber?: string;
  registrationId?: string;
  website?: string;
  headquarters?: VendorSeed["headquarters"];
  industry?: string;
  categories?: string[];
  yearFounded?: number;
  employeeCount?: number;
  annualRevenue?: VendorSeed["annualRevenue"];
  insurance?: VendorSeed["insurance"];
  primaryContact?: VendorSeed["primaryContact"];
  secondaryContact?: VendorSeed["secondaryContact"];
  justification: string;
  projectName?: string;
  expectedSpend?: {
    currency: string;
    value: number;
  };
  priority: "low" | "medium" | "high";
  requestedAt: number;
  status: "pending" | "reviewing" | "approved" | "rejected";
  decisionNotes?: string;
  requestedByEmail: string;
  reviewedByEmail?: string;
  reviewedAt?: number;
  linkedVendorName?: string;
};

export const seed = mutation(async ({ db }) => {
  const existingUsers = await db.query("users").take(1);
  if (existingUsers.length > 0) {
    return { seeded: false, reason: "data already present" };
  }

  const now = Date.now();

  const userSeeds: UserSeed[] = [
    {
      name: "Amelia Cho",
      email: "amelia@constructionpro.com",
      role: "buyer",
      createdAt: now - 1000 * 60 * 60 * 24 * 14,
    },
    {
      name: "Luca Marin",
      email: "luca@constructionpro.com",
      role: "manager",
      createdAt: now - 1000 * 60 * 60 * 24 * 20,
    },
    {
      name: "Priya Desai",
      email: "priya@constructionpro.com",
      role: "admin",
      createdAt: now - 1000 * 60 * 60 * 24 * 28,
    },
  ];

  const userIdByEmail = new Map<string, Id<"users">>();

  for (const user of userSeeds) {
    const id = await db.insert("users", user);
    userIdByEmail.set(user.email, id);
  }

  const vendorSeeds: VendorSeed[] = [
    {
      name: "Atlas Concrete Works",
      vatNumber: "GB123456789",
      registrationId: "COMP-ACW-9987",
      website: "https://atlasconcrete.example",
      headquarters: {
        addressLine1: "120 Riverfront Ave",
        city: "Manchester",
        region: "Greater Manchester",
        postalCode: "M1 1AE",
        country: "United Kingdom",
      },
      industry: "Concrete Supply",
      categories: ["Concrete", "Aggregates", "Ready Mix"],
      yearFounded: 1994,
      employeeCount: 240,
      annualRevenue: {
        currency: "GBP",
        amountRange: "20m_plus",
      },
      insurance: {
        provider: "Lloyd's",
        expiresOn: now + 1000 * 60 * 60 * 24 * 180,
      },
      primaryContact: {
        name: "Elliot Rhodes",
        role: "Commercial Lead",
        email: "elliot.rhodes@atlasconcrete.example",
        phone: "+44 161 555 0142",
      },
      secondaryContact: {
        name: "Marina Green",
        role: "Operations Manager",
        email: "marina.green@atlasconcrete.example",
      },
      complianceStatus: "verified",
      notes: "Preferred supplier for precast components across the North West.",
      sourcingChannel: "catalog",
      lifespanStatus: "active",
      createdAt: now - 1000 * 60 * 60 * 24 * 120,
      updatedAt: now - 1000 * 60 * 60 * 24 * 10,
      createdByEmail: "priya@constructionpro.com",
      updatedByEmail: "luca@constructionpro.com",
    },
    {
      name: "Skyline Mechanical Group",
      vatNumber: "GB845672301",
      registrationId: "SMG-REG-4521",
      website: "https://skylinemech.example",
      headquarters: {
        addressLine1: "44 Anchor Street",
        addressLine2: "Suite 8",
        city: "Birmingham",
        region: "West Midlands",
        postalCode: "B1 1AA",
        country: "United Kingdom",
      },
      industry: "Mechanical & HVAC",
      categories: ["HVAC", "Mechanical Systems"],
      yearFounded: 2007,
      employeeCount: 85,
      annualRevenue: {
        currency: "GBP",
        amountRange: "5m_20m",
      },
      insurance: {
        provider: "Zurich Construction",
        expiresOn: now + 1000 * 60 * 60 * 24 * 90,
      },
      primaryContact: {
        name: "Sanjay Patel",
        role: "Business Development Manager",
        email: "sanjay.patel@skylinemech.example",
        phone: "+44 121 555 8670",
      },
      complianceStatus: "pending",
      notes: "Awaiting updated insurance certificates before next tender.",
      sourcingChannel: "manual",
      lifespanStatus: "active",
      createdAt: now - 1000 * 60 * 60 * 24 * 45,
      createdByEmail: "amelia@constructionpro.com",
    },
  ];

  const vendorIdByName = new Map<string, Id<"vendors">>();

  for (const vendor of vendorSeeds) {
    const createdBy = userIdByEmail.get(vendor.createdByEmail);
    if (!createdBy) {
      throw new Error(`Missing createdBy user for vendor ${vendor.name}`);
    }
    const updatedBy = vendor.updatedByEmail
      ? userIdByEmail.get(vendor.updatedByEmail)
      : undefined;

    const vendorId = await db.insert("vendors", {
      name: vendor.name,
      vatNumber: vendor.vatNumber,
      registrationId: vendor.registrationId,
      website: vendor.website,
      headquarters: vendor.headquarters,
      industry: vendor.industry,
      categories: vendor.categories,
      yearFounded: vendor.yearFounded,
      employeeCount: vendor.employeeCount,
      annualRevenue: vendor.annualRevenue,
      insurance: vendor.insurance,
      primaryContact: vendor.primaryContact,
      secondaryContact: vendor.secondaryContact,
      complianceStatus: vendor.complianceStatus,
      notes: vendor.notes,
      sourcingChannel: vendor.sourcingChannel,
      lifespanStatus: vendor.lifespanStatus,
      createdAt: vendor.createdAt,
      createdBy,
      updatedAt: vendor.updatedAt,
      updatedBy,
    });

    vendorIdByName.set(vendor.name, vendorId);
  }

  const requestSeeds: VendorRequestSeed[] = [
    {
      name: "Northern Scaffolders Ltd.",
      vatNumber: "GB223467890",
      website: "https://northernscaffolders.example",
      headquarters: {
        addressLine1: "19 Quayside Park",
        city: "Newcastle upon Tyne",
        region: "Tyne and Wear",
        postalCode: "NE1 3DX",
        country: "United Kingdom",
      },
      industry: "Scaffolding",
      categories: ["Scaffolding", "Site Safety"],
      yearFounded: 2011,
      employeeCount: 45,
      annualRevenue: {
        currency: "GBP",
        amountRange: "1m_5m",
      },
      primaryContact: {
        name: "Laura Fielding",
        role: "Contracts Director",
        email: "laura.fielding@northernscaffolders.example",
        phone: "+44 191 555 1001",
      },
      justification:
        "Preferred by the site supervisor for rapid tower deployments on high-rise refurb project.",
      projectName: "Quayside Towers Refurbishment",
      expectedSpend: {
        currency: "GBP",
        value: 48000,
      },
      priority: "high",
      requestedAt: now - 1000 * 60 * 60 * 24 * 3,
      status: "pending",
      requestedByEmail: "amelia@constructionpro.com",
    },
    {
      name: "GreenGrid Solar Partners",
      vatNumber: "GB563890124",
      registrationId: "GGS-EN-8821",
      website: "https://greengridsolar.example",
      headquarters: {
        addressLine1: "2 Horizon Way",
        city: "Bristol",
        region: "South West",
        postalCode: "BS1 4DJ",
        country: "United Kingdom",
      },
      industry: "Renewable Energy",
      categories: ["Solar", "Electrical"],
      yearFounded: 2016,
      employeeCount: 60,
      annualRevenue: {
        currency: "GBP",
        amountRange: "5m_20m",
      },
      insurance: {
        provider: "Allianz Construction",
        expiresOn: now + 1000 * 60 * 60 * 24 * 210,
      },
      primaryContact: {
        name: "Maya Khatri",
        role: "Partnerships Lead",
        email: "maya.khatri@greengridsolar.example",
        phone: "+44 117 555 2124",
      },
      justification:
        "Needed to accelerate the sustainability roadmap for logistics warehouse program.",
      projectName: "DeepGreen Warehousing Initiative",
      expectedSpend: {
        currency: "GBP",
        value: 175000,
      },
      priority: "medium",
      requestedAt: now - 1000 * 60 * 60 * 24 * 12,
      status: "reviewing",
      requestedByEmail: "luca@constructionpro.com",
      reviewedByEmail: "priya@constructionpro.com",
      reviewedAt: now - 1000 * 60 * 60 * 24 * 1,
      decisionNotes:
        "Verifying performance guarantees; awaiting sustainability certificates upload.",
    },
    {
      name: "Precision Steelworks",
      vatNumber: "GB908776541",
      registrationId: "PSW-REG-1199",
      website: "https://precisionsteelworks.example",
      headquarters: {
        addressLine1: "89 Forge Lane",
        city: "Glasgow",
        region: "Scotland",
        postalCode: "G1 2FF",
        country: "United Kingdom",
      },
      industry: "Structural Steel",
      categories: ["Steel Fabrication"],
      yearFounded: 1986,
      employeeCount: 320,
      annualRevenue: {
        currency: "GBP",
        amountRange: "20m_plus",
      },
      primaryContact: {
        name: "Gavin McLeod",
        role: "Commercial Director",
        email: "gavin.mcleod@precisionsteelworks.example",
        phone: "+44 141 555 7722",
      },
      justification:
        "Needed for accelerated frame install on the Skyline Embassy Tower project.",
      projectName: "Skyline Embassy Tower",
      expectedSpend: {
        currency: "GBP",
        value: 640000,
      },
      priority: "high",
      requestedAt: now - 1000 * 60 * 60 * 24 * 30,
      status: "approved",
      decisionNotes:
        "Approved and onboarded after compliance review; ready for first tender package.",
      requestedByEmail: "amelia@constructionpro.com",
      reviewedByEmail: "priya@constructionpro.com",
      reviewedAt: now - 1000 * 60 * 60 * 24 * 25,
      linkedVendorName: "Atlas Concrete Works",
    },
  ];

  for (const request of requestSeeds) {
    const requestedBy = userIdByEmail.get(request.requestedByEmail);
    if (!requestedBy) {
      throw new Error(`Missing requester for vendor request ${request.name}`);
    }
    const reviewedBy = request.reviewedByEmail
      ? userIdByEmail.get(request.reviewedByEmail)
      : undefined;
    const linkedVendorId = request.linkedVendorName
      ? vendorIdByName.get(request.linkedVendorName)
      : undefined;

    await db.insert("vendor_requests", {
      name: request.name,
      vatNumber: request.vatNumber,
      registrationId: request.registrationId,
      website: request.website,
      headquarters: request.headquarters,
      industry: request.industry,
      categories: request.categories,
      yearFounded: request.yearFounded,
      employeeCount: request.employeeCount,
      annualRevenue: request.annualRevenue,
      insurance: request.insurance,
      primaryContact: request.primaryContact,
      secondaryContact: request.secondaryContact,
      justification: request.justification,
      projectName: request.projectName,
      expectedSpend: request.expectedSpend,
      priority: request.priority,
      requestedBy,
      requestedAt: request.requestedAt,
      status: request.status,
      decisionNotes: request.decisionNotes,
      reviewedBy,
      reviewedAt: request.reviewedAt,
      linkedVendorId,
    });
  }

  return { seeded: true, users: userSeeds.length, vendors: vendorSeeds.length, requests: requestSeeds.length };
});

import { mutation } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

const DAY = 1000 * 60 * 60 * 24;

type UserSeed = Omit<Doc<"users">, "_id" | "_creationTime">;
type NewVendor = Omit<Doc<"vendors">, "_id" | "_creationTime">;
type VendorSeed = Omit<NewVendor, "createdBy" | "updatedBy"> & {
  createdByEmail: string;
  updatedByEmail?: string;
};
type NewVendorRequest = Omit<Doc<"vendor_requests">, "_id" | "_creationTime">;
type VendorRequestSeed = Omit<
  NewVendorRequest,
  "requestedBy" | "reviewedBy" | "linkedVendorId"
> & {
  requestedByEmail: string;
  reviewedByEmail?: string;
  linkedVendorName?: string;
};

export const seed = mutation(async ({ db }) => {
  const existingUsers = await db.query("users").take(1);
  if (existingUsers.length > 0) {
    return { seeded: false, reason: "data already present" };
  }

  const now = Date.now();
  const buyerEmail = "marta.rossi@costruzioniprosrl.com";
  const adminEmail = "filippo.simone@brix.supply";

  const userSeeds: UserSeed[] = [
    {
      name: "Marta Rossi",
      email: buyerEmail,
      role: "buyer",
    },
    {
      name: "Filippo Simone",
      email: adminEmail,
      role: "admin",
    },
  ];

  const userIdByEmail = new Map<string, Id<"users">>();
  for (const user of userSeeds) {
    const id = await db.insert("users", user);
    userIdByEmail.set(user.email, id);
  }

  const vendorSeeds: VendorSeed[] = [
    {
      name: "Atlas Calcestruzzo S.p.A.",
      vatNumber: "IT01234567890",
      registrationId: "COMP-ACW-9987",
      website: "https://atlasconcrete.example",
      headquarters: {
        addressLine1: "Via dell'Industria 120",
        city: "Milano",
        region: "Lombardia",
        postalCode: "20100",
        country: "Italia",
      },
      industry: "Concrete Supply",
      categories: ["Concrete", "Aggregates"],
      yearFounded: 1994,
      primaryContact: {
        name: "Elliot Rhodes",
        role: "Commercial Lead",
        email: "elliot.rhodes@atlasconcrete.example",
        phone: "+44 161 555 0142",
      },
      notes:
        "Fornitore di riferimento per prefabbricati nell'area nord Italia.",
      updatedAt: now - DAY * 5,
      createdByEmail: adminEmail,
      updatedByEmail: adminEmail,
    },
    {
      name: "Meccanica Skyline S.r.l.",
      vatNumber: "IT08456723019",
      registrationId: "SMG-REG-4521",
      website: "https://skylinemech.example",
      headquarters: {
        addressLine1: "Via degli Artigiani 44",
        addressLine2: "Scala B",
        city: "Torino",
        region: "Piemonte",
        postalCode: "10100",
        country: "Italia",
      },
      industry: "Mechanical & HVAC",
      categories: ["HVAC", "Mechanical"],
      yearFounded: 2007,
      primaryContact: {
        name: "Sanjay Patel",
        role: "Business Development Manager",
        email: "sanjay.patel@skylinemech.example",
        phone: "+44 121 555 8670",
      },
      notes: "Team manutentivo attivo h24 per impianti HVAC complessi.",
      createdByEmail: buyerEmail,
    },
    {
      name: "Fabbro Porto Acciaio S.r.l.",
      vatNumber: "IT05647382910",
      registrationId: "HSF-REG-7755",
      website: "https://harborsteel.example",
      headquarters: {
        addressLine1: "Via del Porto 80",
        city: "Genova",
        region: "Liguria",
        postalCode: "16100",
        country: "Italia",
      },
      industry: "Structural Steel",
      categories: ["Steel Fabrication", "Erection"],
      yearFounded: 1988,
      primaryContact: {
        name: "Joanna Harker",
        role: "Bid Coordinator",
        email: "joanna.harker@harborsteel.example",
        phone: "+44 151 555 8192",
      },
      notes:
        "Specializzati in carpenterie complesse con tempi di consegna ridotti.",
      updatedAt: now - DAY * 12,
      createdByEmail: adminEmail,
      updatedByEmail: buyerEmail,
    },
    {
      name: "Precisione Impianti Elettrici S.r.l.",
      vatNumber: "IT09988774433",
      registrationId: "PES-REG-3301",
      website: "https://precisionelectrical.example",
      headquarters: {
        addressLine1: "Via Alessandro Volta 12",
        city: "Brescia",
        region: "Lombardia",
        postalCode: "25100",
        country: "Italia",
      },
      industry: "Electrical",
      categories: ["Electrical Fit-out"],
      yearFounded: 2001,
      primaryContact: {
        name: "Darren Cole",
        role: "Client Director",
        email: "darren.cole@precisionelectrical.example",
        phone: "+44 113 555 9234",
      },
      notes: "Focus su impianti intelligenti e sensoristica per edifici smart.",
      createdByEmail: buyerEmail,
    },
    {
      name: "GreenGrid Solare Partners S.r.l.",
      vatNumber: "IT05638901244",
      registrationId: "GGS-EN-8821",
      website: "https://greengridsolar.example",
      headquarters: {
        addressLine1: "Via Orizzonte 2",
        city: "Bari",
        region: "Puglia",
        postalCode: "70100",
        country: "Italia",
      },
      industry: "Renewable Energy",
      categories: ["Solar", "Electrical"],
      yearFounded: 2016,
      primaryContact: {
        name: "Maya Khatri",
        role: "Partnerships Lead",
        email: "maya.khatri@greengridsolar.example",
        phone: "+44 117 555 2124",
      },
      notes: "Supporta roadmap di sostenibilità per hub logistici nazionali.",
      createdByEmail: adminEmail,
    },
    {
      name: "Ponteggi Nord S.r.l.",
      vatNumber: "IT02234678902",
      registrationId: "NSL-REG-1144",
      website: "https://northernscaffolders.example",
      headquarters: {
        addressLine1: "Via del Porto 19",
        city: "Trieste",
        region: "Friuli-Venezia Giulia",
        postalCode: "34100",
        country: "Italia",
      },
      industry: "Scaffolding",
      categories: ["Access", "Safety"],
      yearFounded: 2011,
      primaryContact: {
        name: "Laura Fielding",
        role: "Contracts Director",
        email: "laura.fielding@northernscaffolders.example",
        phone: "+44 191 555 1001",
      },
      notes: "Ottima reattività per installazioni di accesso in emergenza.",
      createdByEmail: buyerEmail,
    },
    {
      name: "Summit Interiors S.r.l.",
      vatNumber: "IT05566328890",
      registrationId: "SIC-REG-7742",
      website: "https://summitinteriors.example",
      headquarters: {
        addressLine1: "Via Reggenza 45",
        city: "Milano",
        region: "Lombardia",
        postalCode: "20121",
        country: "Italia",
      },
      industry: "Interior Fit-out",
      categories: ["Fit-out", "Joinery"],
      yearFounded: 2004,
      primaryContact: {
        name: "Katie Morin",
        role: "Business Development Lead",
        email: "katie.morin@summitinteriors.example",
        phone: "+44 20 5555 7766",
      },
      notes:
        "Fornisce lobby su misura per progetti direzionali di fascia alta.",
      updatedAt: now - DAY * 2,
      createdByEmail: adminEmail,
      updatedByEmail: adminEmail,
    },
    {
      name: "BlueRiver Impianti Idraulici S.r.l.",
      vatNumber: "IT04477882211",
      registrationId: "BRP-REG-9088",
      website: "https://blueriverplumbing.example",
      headquarters: {
        addressLine1: "Via del Canale 88",
        city: "Padova",
        region: "Veneto",
        postalCode: "35100",
        country: "Italia",
      },
      industry: "Plumbing",
      categories: ["HVAC", "Plumbing"],
      yearFounded: 1999,
      primaryContact: {
        name: "Harvey Leung",
        role: "Service Manager",
        email: "harvey.leung@blueriverplumbing.example",
        phone: "+44 115 555 2390",
      },
      notes:
        "Gestione completa di centrali termiche e anelli acqua refrigerata.",
      createdByEmail: buyerEmail,
    },
    {
      name: "Elevate Crane Operators S.p.A.",
      vatNumber: "IT06677889900",
      registrationId: "ECO-REG-5520",
      website: "https://elevatecrane.example",
      headquarters: {
        addressLine1: "Via Ferrovia 31",
        city: "Parma",
        region: "Emilia-Romagna",
        postalCode: "43100",
        country: "Italia",
      },
      industry: "Lifting & Hoisting",
      categories: ["Cranes", "Logistics"],
      yearFounded: 2009,
      primaryContact: {
        name: "Ibrahim Khan",
        role: "Operations Lead",
        email: "ibrahim.khan@elevatecrane.example",
        phone: "+44 114 555 6544",
      },
      notes: "Certificati per gru a torre su cantieri ad alta quota.",
      createdByEmail: adminEmail,
    },
    {
      name: "Soluzioni Asfalto Urbano S.r.l.",
      vatNumber: "IT07788990021",
      registrationId: "UAS-REG-6611",
      website: "https://urbanasphalt.example",
      headquarters: {
        addressLine1: "Via Deposito 5",
        city: "Bologna",
        region: "Emilia-Romagna",
        postalCode: "40121",
        country: "Italia",
      },
      industry: "Civil Works",
      categories: ["Surfacing", "Roadworks"],
      yearFounded: 1990,
      primaryContact: {
        name: "Michelle Ortiz",
        role: "Framework Manager",
        email: "michelle.ortiz@urbanasphalt.example",
        phone: "+44 116 555 8890",
      },
      notes: "Capacità di asfaltature rapide con turni notturni.",
      createdByEmail: buyerEmail,
    },
  ];

  const vendorIdByName = new Map<string, Id<"vendors">>();

  for (const vendor of vendorSeeds) {
    const { createdByEmail, updatedByEmail, ...rest } = vendor;
    const createdBy = userIdByEmail.get(createdByEmail);
    if (!createdBy) {
      throw new Error(`Missing createdBy user for vendor ${vendor.name}`);
    }

    const vendorDoc: NewVendor = {
      ...rest,
      createdBy,
    };

    if (updatedByEmail) {
      const updatedBy = userIdByEmail.get(updatedByEmail);
      if (!updatedBy) {
        throw new Error(`Missing updatedBy user for vendor ${vendor.name}`);
      }
      vendorDoc.updatedBy = updatedBy;
    }

    const id = await db.insert("vendors", vendorDoc);
    vendorIdByName.set(vendor.name, id);
  }

  const requestSeeds: VendorRequestSeed[] = [
    {
      name: "Summit Interiors S.r.l.",
      vatNumber: "IT05566328890",
      registrationId: "SIC-REG-7742",
      website: "https://summitinteriors.example",
      headquarters: {
        addressLine1: "Via Reggenza 45",
        city: "Milano",
        region: "Lombardia",
        postalCode: "20121",
        country: "Italia",
      },
      industry: "Interior Fit-out",
      categories: ["Fit-out", "Joinery"],
      yearFounded: 2004,
      primaryContact: {
        name: "Katie Morin",
        role: "Business Development Lead",
        email: "katie.morin@summitinteriors.example",
        phone: "+44 20 5555 7766",
      },
      justification:
        "Serve un partner premium per il pacchetto lobby della torre Aurora.",
      projectName: "Torre Uffici Aurora",
      requestedAt: now - DAY * 3,
      status: "approved",
      decisionNotes:
        "Approvata e inserita a catalogo dopo verifica finanziaria.",
      reviewedAt: now - DAY,
      requestedByEmail: buyerEmail,
      reviewedByEmail: adminEmail,
      linkedVendorName: "Summit Interiors S.r.l.",
    },
  ];

  for (const request of requestSeeds) {
    const { requestedByEmail, reviewedByEmail, linkedVendorName, ...rest } =
      request;

    const requestedBy = userIdByEmail.get(requestedByEmail);
    if (!requestedBy) {
      throw new Error(
        `Missing requestedBy user for vendor request ${request.name}`,
      );
    }

    const requestDoc: NewVendorRequest = {
      ...rest,
      requestedBy,
    };

    if (reviewedByEmail) {
      const reviewedBy = userIdByEmail.get(reviewedByEmail);
      if (!reviewedBy) {
        throw new Error(
          `Missing reviewedBy user for vendor request ${request.name}`,
        );
      }
      requestDoc.reviewedBy = reviewedBy;
    }

    if (linkedVendorName) {
      const linkedVendorId = vendorIdByName.get(linkedVendorName);
      if (!linkedVendorId) {
        throw new Error(
          `Missing linked vendor for request tied to ${linkedVendorName}`,
        );
      }
      requestDoc.linkedVendorId = linkedVendorId;
    }

    await db.insert("vendor_requests", requestDoc);
  }

  return {
    seeded: true,
    users: userSeeds.length,
    vendors: vendorSeeds.length,
    requests: requestSeeds.length,
  };
});

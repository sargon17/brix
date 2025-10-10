import { type } from "arktype";

export const vendorRequestSchema = type({
  name: "string>2",
  vatNumber: "string?",
  website: "string?",
  industry: "string?",
  categories: "string?",
  "headquarters?": {
    addressLine1: "string?",
    addressLine2: "string?",
    city: "string?",
    region: "string?",
    postalCode: "string?",
    country: "string?",
  },
  "primaryContact?": {
    name: "string",
    role: "string?",
    email: "string?",
    phone: "string?",
  },
  justification: "string>20",
});

export type VendorRequestFormValue = typeof vendorRequestSchema.infer;

export const vendorRequestDefaultValues: VendorRequestFormValue = {
  name: "",
  vatNumber: "",
  website: "",
  industry: "",
  categories: "",
  headquarters: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
  },
  primaryContact: {
    name: "",
    role: "",
    email: "",
    phone: "",
  },
  justification: "",
};

export type VendorRequestPayload = Omit<VendorRequestFormValue, "categories"> & {
  categories: string[] | undefined;
};

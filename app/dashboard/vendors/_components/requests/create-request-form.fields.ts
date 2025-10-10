import type { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import type {
  TextAreaConfig,
  TextFieldConfig,
} from "@/lib/form-building-helpers";

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

export type FormValue = typeof vendorRequestSchema.infer;

export const defaultValues: FormValue = {
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

type StepConfig = Omit<
  TextFieldConfig<ReturnType<typeof useForm>, FormValue>,
  "form"
>;
type TextAreaStepConfig = Omit<
  TextAreaConfig<ReturnType<typeof useForm>, FormValue>,
  "form"
>;

const identityFields: StepConfig[] = [
  {
    name: "name",
    label: "Legal name",
    placeholder: "e.g. Atlas Concrete Ltd.",
    required: true,
  },
  {
    name: "vatNumber",
    label: "VAT number",
    placeholder: "e.g. IT01234567890",
  },
  {
    name: "website",
    label: "Website",
    placeholder: "https://",
  },
  {
    name: "industry",
    label: "Industry",
    placeholder: "e.g. Industrial prefabs",
  },
  {
    name: "categories",
    label: "Categories (comma separated)",
    placeholder: "e.g. Concrete, Aggregates",
  },
];

const headquartersFields: StepConfig[] = [
  {
    name: "headquarters.addressLine1",
    label: "Address line 1",
    placeholder: "Street address",
  },
  {
    name: "headquarters.addressLine2",
    label: "Suite / floor",
    placeholder: "Optional",
  },
  {
    name: "headquarters.city",
    label: "City",
    placeholder: "e.g. Milan",
  },
  {
    name: "headquarters.region",
    label: "Region",
    placeholder: "e.g. Lombardy",
  },
  {
    name: "headquarters.postalCode",
    label: "Postal code",
    placeholder: "e.g. 20100",
  },
  {
    name: "headquarters.country",
    label: "Country",
    placeholder: "e.g. Italy",
  },
];

const primaryContactFields: StepConfig[] = [
  {
    name: "primaryContact.name",
    label: "Primary contact",
    placeholder: "Full name",
  },
  {
    name: "primaryContact.role",
    label: "Role",
    placeholder: "e.g. Sales",
  },
  {
    name: "primaryContact.email",
    label: "Email",
    placeholder: "name@company.com",
  },
  {
    name: "primaryContact.phone",
    label: "Phone",
    placeholder: "e.g. +39 ...",
  },
];

const justificationField: TextAreaStepConfig = {
  name: "justification",
  label: "Notes for Brix reviewer",
  placeholder: "Describe why this vendor is critical for the project.",
};

export const stepsData = [
  {
    id: "company-data",
    title: "Company data",
    description: "Core information about the vendor.",
    fields: identityFields.map((field) => field.name),
    fieldSet: identityFields,
    variant: "textfield",
  },
  {
    id: "headquarters",
    title: "Headquarters",
    description: "Tell us the main operating location.",
    fields: headquartersFields.map((field) => field.name),
    fieldSet: headquartersFields,
    variant: "textfield",
  },
  {
    id: "contacts",
    title: "Contacts",
    description: "Points of contact for onboarding and operations.",
    fields: primaryContactFields.map((field) => field.name),
    fieldSet: primaryContactFields,
    variant: "textfield",
  },
  {
    id: "request-context",
    title: "Request context",
    description:
      "Explain why the vendor should be added and how it relates to your projects.",
    fields: ["justification"] as const,
    fieldSet: [justificationField],
    variant: "textarea",
  },
];

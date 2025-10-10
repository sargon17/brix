import type { DeepKeys } from "@tanstack/react-form";

import type { VendorRequestFormValue } from "./vendor-request-form.schema";

export type TextFieldDefinition = {
  name: DeepKeys<VendorRequestFormValue>;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
};

export type TextAreaDefinition = {
  name: DeepKeys<VendorRequestFormValue>;
  label: string;
  placeholder?: string;
  minRows?: number;
};

type BaseStepDefinition = {
  id: string;
  title: string;
  description: string;
  fields: ReadonlyArray<DeepKeys<VendorRequestFormValue>>;
};

type TextFieldStepDefinition = BaseStepDefinition & {
  variant: "textfield";
  fieldSet: ReadonlyArray<TextFieldDefinition>;
};

type TextAreaStepDefinition = BaseStepDefinition & {
  variant: "textarea";
  fieldSet: ReadonlyArray<TextAreaDefinition>;
};

export type VendorRequestStepDefinition =
  | TextFieldStepDefinition
  | TextAreaStepDefinition;

const identityFields: ReadonlyArray<TextFieldDefinition> = [
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
] as const;

const headquartersFields: ReadonlyArray<TextFieldDefinition> = [
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
] as const;

const primaryContactFields: ReadonlyArray<TextFieldDefinition> = [
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
] as const;

const justificationField: TextAreaDefinition = {
  name: "justification",
  label: "Notes for Brix reviewer",
  placeholder: "Describe why this vendor is critical for the project.",
};

export const vendorRequestSteps: ReadonlyArray<VendorRequestStepDefinition> = [
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
    fields: [justificationField.name],
    fieldSet: [justificationField],
    variant: "textarea",
  },
] as const;

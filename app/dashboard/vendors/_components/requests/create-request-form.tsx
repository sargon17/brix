"use client";

import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation } from "convex/react";
import type { JSX, PropsWithChildren } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import type { DeepKeys } from "@tanstack/react-table";
import { Textarea } from "@/components/ui/textarea";


import { toast } from "sonner"

const vendorRequestSchema = type({
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


type FormValue = typeof vendorRequestSchema.infer

type PayloadType = Omit<typeof vendorRequestSchema.infer, "categories"> & {
  categories: string[] | undefined
}


const defaultValues: FormValue = {
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
const textFieldLabelClassName = "flex items-center justify-between";



interface CreateRequestFormProps extends PropsWithChildren { }

export default function CreateRequestForm({
  children,
}: CreateRequestFormProps) {
  const createRequest = useMutation(api.vendorRequests.create);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);


  const form = useForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      const payload = mapFormValuesToPayload(value);


      try {
        await createRequest(payload);
        formApi.reset();
        setOpen(false);
        toast.info("Vendor onboarding request submitted successfully")
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "We cannot create the request right now.";

        toast.error(message)
        throw error;
      }
    },
    validators: {
      onChange: vendorRequestSchema
    }
  });

  const isSubmitting = form.state.isSubmitting;
  const isValidating = form.state.isValidating;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset();
      setActiveStep(0);
    }
    setOpen(nextOpen);
  };

  type TextFieldConfig = {
    name: DeepKeys<FormValue>;
    label: string;
    placeholder?: string;
    required?: boolean;
    description?: string;
  };

  type TextAreaConfig = {
    name: DeepKeys<FormValue>;
    label: string;
    placeholder?: string;
    minRows?: number;
  };

  const renderTextField = ({
    name,
    label,
    placeholder,
    required,
    description,
  }: TextFieldConfig) => (
    <form.Field key={name} name={name}>
      {(field) => (
        <Field>
          <FieldLabel htmlFor={field.name} className={textFieldLabelClassName}>
            <span>{label}</span>
            {required ? (
              <span className="ml-2 text-xs font-normal text-destructive">
                required
              </span>
            ) : null}
          </FieldLabel>
          <Input
            id={field.name}
            placeholder={placeholder}
            value={field.state.value?.toString()}
            onChange={(event) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
          />
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
          <FieldError errors={field.state.meta.errors} />
        </Field>
      )}
    </form.Field>
  );

  const renderTextArea = ({
    name,
    label,
    placeholder,
    minRows = 4,
  }: TextAreaConfig) => (
    <form.Field key={name} name={name}>
      {(field) => (
        <Field>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Textarea
            id={field.name}
            rows={minRows}
            placeholder={placeholder}
            value={field.state.value?.toString()}
            onChange={(event) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
          />
          <FieldError errors={field.state.meta.errors} />
        </Field>
      )}
    </form.Field>
  );


  const identityFields: TextFieldConfig[] = [
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

  const headquartersFields: TextFieldConfig[] = [
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

  const primaryContactFields: TextFieldConfig[] = [
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

  type StepConfig = {
    id: string;
    title: string;
    description: string;
    fields: ReadonlyArray<DeepKeys<FormValue>>;
    render: () => JSX.Element;
  };

  const steps = [
    {
      id: "company-data",
      title: "Company data",
      description: "Core information about the vendor.",
      fields: identityFields.map((field) => field.name),
      render: () => (
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {identityFields.map((field) => renderTextField(field))}
        </FieldGroup>
      ),
    },
    {
      id: "headquarters",
      title: "Headquarters",
      description: "Tell us the main operating location.",
      fields: headquartersFields.map((field) => field.name),
      render: () => (
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {headquartersFields.map((field) => renderTextField(field))}
        </FieldGroup>
      ),
    },
    {
      id: "contacts",
      title: "Contacts",
      description: "Points of contact for onboarding and operations.",
      fields: primaryContactFields.map((field) => field.name),
      render: () => (
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {primaryContactFields.map((field) => renderTextField(field))}
        </FieldGroup>
      ),
    },
    {
      id: "request-context",
      title: "Request context",
      description:
        "Explain why the vendor should be added and how it relates to your projects.",
      fields: ["justification"] as const,
      render: () => (
        <FieldGroup className="gap-4">
          {renderTextArea({
            name: "justification",
            label: "Notes for Brix reviewer",
            placeholder:
              "Describe why this vendor is critical for the project.",
          })}
        </FieldGroup>
      ),
    },
  ] satisfies StepConfig[];

  const currentStep = steps[activeStep] ?? steps[0];
  const totalSteps = steps.length;
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === totalSteps - 1;

  const goToNextStep = () => {
    setActiveStep((step) => Math.min(step + 1, totalSteps - 1));
  };

  const goToPreviousStep = () => {
    setActiveStep((step) => Math.max(step - 1, 0));
  };

  const validateStep = async (step: StepConfig) => {
    let hasErrors = false;
    for (const field of step.fields) {
      await form.validateField(field, "change");
      const fieldMeta = form.getFieldMeta(field);
      if (fieldMeta?.errors && fieldMeta.errors.length > 0) {
        hasErrors = true;
      }
    }
    return !hasErrors;
  };

  const handleNext = async () => {
    const step = steps[activeStep];
    if (!step) return;
    const canAdvance = await validateStep(step);
    if (canAdvance) {
      goToNextStep();
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-y-hidden md:min-w-200 gap-0">
        <DialogHeader className="py-6">
          <DialogTitle>Request vendor onboarding</DialogTitle>
          <DialogDescription>
            Provide the key details to start Brix&apos;s review process.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const step = steps[activeStep];
            if (step) {
              const canSubmit = await validateStep(step);
              if (!canSubmit) {
                return;
              }
            }
            await form.handleSubmit();
          }}
        >
          <div className="flex items-center justify-between py-4 text-sm text-muted-foreground">
            <span>
              Step {activeStep + 1} of {totalSteps}
            </span>
            <span className="font-medium text-foreground">
              {currentStep.title}
            </span>
          </div>

          <FieldSet>
            <FieldLegend>{currentStep.title}</FieldLegend>
            <FieldDescription>{currentStep.description}</FieldDescription>
            {currentStep.render()}
          </FieldSet>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            {!isFirstStep ? (
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isSubmitting || isValidating}
              >
                Back
              </Button>
            ) : null}
            {isLastStep ? (
              <Button type="submit" disabled={isSubmitting || isValidating}>
                {isSubmitting ? "Submitting..." : "Submit request"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  void handleNext();
                }}
                disabled={isSubmitting || isValidating}
              >
                Next
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  );
}


function mapFormValuesToPayload(values: FormValue): PayloadType {
  const categories = values.categories ? values.categories
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) : undefined;

  return {
    ...values,
    categories
  };
}

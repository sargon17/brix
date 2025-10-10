"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { toast } from "sonner";

import SteppedForm from "@/components/form/stepped-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import {
  type TextAreaDefinition,
  type TextFieldDefinition,
  vendorRequestSteps,
} from "./vendor-request-form.config";
import { mapVendorRequestFormToPayload } from "./vendor-request-form.helpers";
import {
  type VendorRequestFormValue,
  vendorRequestDefaultValues,
  vendorRequestSchema,
} from "./vendor-request-form.schema";

interface VendorRequestFormProps extends PropsWithChildren {}

export default function VendorRequestForm({
  children,
}: VendorRequestFormProps) {
  const createRequest = useMutation(api.vendorRequests.create);
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: vendorRequestDefaultValues,
    onSubmit: async ({ value, formApi }) => {
      const payload = mapVendorRequestFormToPayload(value);

      try {
        await createRequest(payload);
        formApi.reset();
        setOpen(false);
        toast.info("Vendor onboarding request submitted successfully");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "We cannot create the request right now.";

        toast.error(message);
        throw error;
      }
    },
    validators: {
      onChange: vendorRequestSchema,
    },
  });

  const renderTextField = (field: TextFieldDefinition) => (
    <form.Field key={field.name} name={field.name}>
      {(fieldApi) => (
        <Field>
          <FieldLabel
            htmlFor={fieldApi.name}
            className="flex items-center justify-between"
          >
            <span>{field.label}</span>
            {field.required ? (
              <span className="ml-2 text-xs font-normal text-destructive">
                required
              </span>
            ) : null}
          </FieldLabel>
          <Input
            id={fieldApi.name}
            placeholder={field.placeholder}
            value={fieldApi.state.value?.toString() ?? ""}
            onChange={(event) => fieldApi.handleChange(event.target.value)}
            onBlur={fieldApi.handleBlur}
          />
          {field.description ? (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          ) : null}
          <FieldError errors={fieldApi.state.meta.errors} />
        </Field>
      )}
    </form.Field>
  );

  const renderTextArea = (field: TextAreaDefinition) => (
    <form.Field key={field.name} name={field.name}>
      {(fieldApi) => (
        <Field>
          <FieldLabel htmlFor={fieldApi.name}>{field.label}</FieldLabel>
          <Textarea
            id={fieldApi.name}
            rows={field.minRows ?? 4}
            placeholder={field.placeholder}
            value={fieldApi.state.value?.toString() ?? ""}
            onChange={(event) => fieldApi.handleChange(event.target.value)}
            onBlur={fieldApi.handleBlur}
          />
          <FieldError errors={fieldApi.state.meta.errors} />
        </Field>
      )}
    </form.Field>
  );

  const steps = vendorRequestSteps.map((step) => ({
    ...step,
    render: () => (
      <FieldGroup
        className={cn(
          "gap-4",
          step.variant === "textfield" && "grid grid-cols-1 md:grid-cols-2",
        )}
      >
        {step.variant === "textfield"
          ? step.fieldSet.map((field) => renderTextField(field))
          : step.fieldSet.map((field) => renderTextArea(field))}
      </FieldGroup>
    ),
  }));

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset();
    }
    setOpen(nextOpen);
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
        <SteppedForm<VendorRequestFormValue> steps={steps} form={form} />
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { toast } from "sonner";
import SteppedForm from "@/components/organisms/stepped-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { DefaultTextArea, DefaultTextField } from "@/lib/form-building-helpers";
import { cn } from "@/lib/utils";
import {
  defaultValues,
  type FormValue,
  stepsData,
  vendorRequestSchema,
} from "./create-request-form.fields";

type PayloadType = Omit<typeof vendorRequestSchema.infer, "categories"> & {
  categories: string[] | undefined;
};

interface CreateRequestFormProps extends PropsWithChildren {}
export default function CreateRequestForm({
  children,
}: CreateRequestFormProps) {
  const createRequest = useMutation(api.vendorRequests.create);
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      const payload = mapFormValuesToPayload(value);

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

  const steps = stepsData.map((step) => ({
    ...step,
    render: () => (
      <FieldGroup
        className={cn(
          "gap-4",
          step.variant === "textfield" && "grid grid-cols-1 md:grid-cols-2",
        )}
      >
        {step.fieldSet.map((field) => {
          if (step.variant === "textfield") {
            return DefaultTextField<typeof form, FormValue>({
              ...field,
              form,
            });
          }
          return DefaultTextArea<typeof form, FormValue>({ ...field, form });
        })}
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
        <SteppedForm steps={steps} form={form} />
      </DialogContent>
    </Dialog>
  );
}

function mapFormValuesToPayload(values: FormValue): PayloadType {
  const categories = values.categories
    ? values.categories
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : undefined;

  return {
    ...values,
    categories,
  };
}

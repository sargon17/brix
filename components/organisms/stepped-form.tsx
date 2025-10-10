import type { DeepKeys, useForm } from "@tanstack/react-form";
import type { JSX, PropsWithChildren } from "react";
import { useStepper } from "@/hooks/use-stepper";
import type { FormUtilType } from "@/lib/form-building-helpers";
import { Button } from "../ui/button";
import { FieldDescription, FieldLegend, FieldSet } from "../ui/field";

type StepConfig<V> = {
  id: string;
  title: string;
  description: string;
  fields: ReadonlyArray<DeepKeys<V>>;
  render: () => JSX.Element;
};

interface SteppedFormProps<V, T> extends PropsWithChildren {
  steps: StepConfig<V>[];
  form: T extends ReturnType<typeof useForm> ? T : FormUtilType;
}
export default function SteppedForm<V, T>({
  steps,
  form,
}: SteppedFormProps<V, T>) {
  const stepper = useStepper(steps.length);

  const validateStep = async (step: StepConfig<V>) => {
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
    const step = steps[stepper.activeStep];
    if (!step) return;
    const canAdvance = await validateStep(step);
    if (canAdvance) {
      stepper.goToNextStep();
    }
  };

  const currentStep = steps[stepper.activeStep];
  const isSubmitting = form.state.isSubmitting;
  const isValidating = form.state.isValidating;

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const step = steps[stepper.activeStep];
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
          Step {stepper.activeStep + 1} of {steps.length}
        </span>
        <span className="font-medium text-foreground">{currentStep.title}</span>
      </div>

      <FieldSet>
        <FieldLegend>{currentStep.title}</FieldLegend>
        <FieldDescription>{currentStep.description}</FieldDescription>
        {currentStep.render()}
      </FieldSet>
      <div className="flex items-center justify-end gap-4">
        {!stepper.isFirstStep ? (
          <Button
            type="button"
            variant="outline"
            onClick={stepper.goToPreviousStep}
            disabled={isSubmitting || isValidating}
          >
            Back
          </Button>
        ) : null}
        {stepper.isLastStep ? (
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
      </div>
    </form>
  );
}

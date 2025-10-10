import React from "react";

export function useStepper(steps: number) {
  const [activeStep, setActiveStep] = React.useState(0);

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps - 1;

  const goToNextStep = () => {
    setActiveStep((step) => Math.min(step + 1, steps - 1));
  };

  const goToPreviousStep = () => {
    setActiveStep((step) => Math.max(step - 1, 0));
  };

  const reset = () => {
    setActiveStep(0);
  };

  return {
    activeStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    reset,
  };
}

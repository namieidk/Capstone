"use client";

import { Check } from "lucide-react";

interface StepItem {
  step: number;
  label: string;
  sub: string;
}

interface OnboardingStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  maxAccessibleStep?: number;
}

const WIZARD_STEPS: StepItem[] = [
  { step: 1, label: "School Scale", sub: "Grading system" },
  { step: 2, label: "Prospectus", sub: "Curriculum upload" },
  { step: 3, label: "Confirmation", sub: "Document check" },
  { step: 4, label: "Final Review", sub: "Submit baseline" },
];

export function OnboardingStepper({ currentStep, onStepClick, maxAccessibleStep = 1 }: OnboardingStepperProps) {
  return (
    <ol className="flex items-start rounded-[18px]! border border-border bg-white p-3.5 sm:p-4 shadow-xs w-full">
      {WIZARD_STEPS.map((s, i) => {
        const done = s.step < currentStep;
        const active = s.step === currentStep;
        const unlocked = s.step <= maxAccessibleStep;

        return (
          <li key={s.step} className="flex flex-1 items-start last:flex-none">
            <button
              type="button"
              onClick={() => unlocked && onStepClick?.(s.step)}
              disabled={!unlocked}
              aria-current={active ? "step" : undefined}
              className={`flex flex-col items-center gap-1.5 rounded-lg px-1 ${
                unlocked ? "cursor-pointer" : "cursor-default opacity-60"
              }`}
            >
              <span
                className={`flex size-8.5 sm:size-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all duration-300 transform ${
                  done
                    ? "bg-navy text-white shadow-xs"
                    : active
                      ? "bg-amber! text-navy! ring-4 ring-amber/25 scale-105 shadow-xs"
                      : "bg-muted text-muted-foreground scale-95"
                }`}
              >
                {done ? (
                  <Check className="size-4 animate-in zoom-in-50 duration-200" />
                ) : (
                  <span className="tabular-nums">{s.step}</span>
                )}
              </span>

              <span className="flex flex-col items-center text-center">
                <span
                  className={`text-[11px] sm:text-xs transition-colors duration-200 ${
                    active || done ? "font-semibold text-navy" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                <span className="hidden text-[0.7rem] text-muted-foreground sm:block">{s.sub}</span>
              </span>
            </button>

            {i < WIZARD_STEPS.length - 1 && (
              <div className="mx-1 sm:mx-2 mt-4 h-1 flex-1 overflow-hidden rounded-full bg-border/70">
                <div
                  className="h-full bg-navy transition-all duration-500 ease-out"
                  style={{ width: s.step < currentStep ? "100%" : "0%" }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

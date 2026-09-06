"use client";

import { GraduationCap, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { SchoolGradingInput } from "@/lib/api/settings";
import { EMPTY_GRADING_VALUES, GradingFields, type GradingFormValues, gradingFormToInput } from "./GradingFields";

interface AddGradingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: SchoolGradingInput) => Promise<void>;
}

export function AddGradingSheet({ open, onOpenChange, onCreate }: AddGradingSheetProps) {
  const [values, setValues] = useState<GradingFormValues>({ ...EMPTY_GRADING_VALUES, codes: [] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setValues({ ...EMPTY_GRADING_VALUES, codes: [] });
      setError("");
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { input, error: validationError } = gradingFormToInput(values);
    if (validationError || !input) {
      setError(validationError ?? "Invalid grading configuration.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onCreate(input);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add grading system.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[440px]! max-w-[92vw]! gap-0 overflow-y-auto border-line bg-white p-8 text-sm!"
      >
        <div className="flex items-start gap-3.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white shadow-xs">
            <GraduationCap className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl! text-navy!">Add grading system</SheetTitle>
            <SheetDescription className="text-sm!">Configure how grades are interpreted for a school.</SheetDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="size-5 text-[#9a9a94]" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <GradingFields values={values} onChange={setValues} idPrefix="add-grading" />

          {error && (
            <div className="mt-4 rounded-[10px] border border-[#f5c2c0] bg-[#fdebec] px-3.5 py-3 text-sm leading-relaxed text-[#b3261e]">
              {error}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 text-sm! text-navy"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 px-6 text-sm!" disabled={saving}>
              {saving ? "Adding..." : "Add system"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

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
        className="w-full sm:max-w-lg flex flex-col gap-0 p-0 overflow-hidden border-l border-border bg-background"
      >
        <div className="flex items-center justify-between border-b border-border p-6 bg-card">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0">
              <SheetTitle className="text-lg font-semibold text-foreground">Add Grading System</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Configure scale bounds & status interpretations for a school.
              </SheetDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="add-grading-form" onSubmit={handleSubmit}>
            <GradingFields values={values} onChange={setValues} idPrefix="add-grading" />

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium leading-relaxed text-destructive">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border p-4 bg-card/60">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 text-sm font-medium"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-grading-form"
            className="h-10 px-5 text-sm font-semibold shadow-xs"
            disabled={saving}
          >
            {saving ? "Adding..." : "Add System"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SchoolGradingInput } from "@/lib/api/settings";
import { schoolGradingSchema } from "@/lib/validation";

export interface GradingFormValues {
  school_name: string;
  grading_scale: string;
  passing_grade: string;
  highest_grade: string;
  failing_grade: string;
  notes: string;
  codes: Array<{ id: string; code: string; status: string }>;
}

export const EMPTY_GRADING_VALUES: GradingFormValues = {
  school_name: "",
  grading_scale: "",
  passing_grade: "",
  highest_grade: "",
  failing_grade: "",
  notes: "",
  codes: [],
};

export function toFormValues(
  g?: {
    school_name: string;
    grading_scale: string;
    passing_grade: number | string;
    highest_grade: number | string;
    failing_grade: number | string;
    notes?: string | null;
    special_codes?: Record<string, string> | null;
  } | null,
): GradingFormValues {
  if (!g) return { ...EMPTY_GRADING_VALUES, codes: [] };
  return {
    school_name: g.school_name,
    grading_scale: g.grading_scale,
    passing_grade: String(g.passing_grade),
    highest_grade: String(g.highest_grade),
    failing_grade: String(g.failing_grade),
    notes: g.notes ?? "",
    codes: Object.entries(g.special_codes ?? {}).map(([code, status]) => ({ id: code, code, status })),
  };
}

const toNum = (v: string): number => (v.trim() === "" ? Number.NaN : Number(v));

// Validates the form and converts it to the backend input shape.
// Returns { error } (first unmet rule) instead of throwing.
export function gradingFormToInput(values: GradingFormValues): { input?: SchoolGradingInput; error?: string } {
  const special_codes: Record<string, string> = {};
  for (const { code, status } of values.codes) {
    const c = code.trim();
    const s = status.trim();
    if (!c && !s) continue;
    if (!c || !s) return { error: "Each special code needs both a grade value and a status." };
    special_codes[c] = s;
  }
  const parsed = schoolGradingSchema.safeParse({
    school_name: values.school_name,
    grading_scale: values.grading_scale,
    passing_grade: toNum(values.passing_grade),
    highest_grade: toNum(values.highest_grade),
    failing_grade: toNum(values.failing_grade),
    notes: values.notes.trim() ? values.notes.trim() : undefined,
    special_codes: Object.keys(special_codes).length > 0 ? special_codes : undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid grading configuration." };
  }
  return { input: parsed.data };
}

const FIELD_INPUT = "mt-2 h-11! border-line bg-[#f7f9fb]! text-sm! md:text-sm!";

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm! font-semibold text-navy">
      {children} {required && <span className="text-amber">*</span>}
    </Label>
  );
}

interface GradingFieldsProps {
  values: GradingFormValues;
  onChange: (values: GradingFormValues) => void;
  idPrefix: string;
}

export function GradingFields({ values, onChange, idPrefix }: GradingFieldsProps) {
  const set = (patch: Partial<GradingFormValues>) => onChange({ ...values, ...patch });

  function setCode(id: string, patch: Partial<{ code: string; status: string }>) {
    set({ codes: values.codes.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel htmlFor={`${idPrefix}-school-name`} required>
          School name
        </FieldLabel>
        <Input
          id={`${idPrefix}-school-name`}
          placeholder="e.g. University of Mindanao"
          value={values.school_name}
          onChange={(e) => set({ school_name: e.target.value })}
          required
          className={FIELD_INPUT}
        />
      </div>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-grading-scale`} required>
          Grading scale
        </FieldLabel>
        <Input
          id={`${idPrefix}-grading-scale`}
          placeholder="e.g. UM_SCALE or PERCENTAGE_100"
          value={values.grading_scale}
          onChange={(e) => set({ grading_scale: e.target.value })}
          required
          className={FIELD_INPUT}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor={`${idPrefix}-passing`} required>
            Passing
          </FieldLabel>
          <Input
            id={`${idPrefix}-passing`}
            type="number"
            step="0.01"
            placeholder="75.00"
            value={values.passing_grade}
            onChange={(e) => set({ passing_grade: e.target.value })}
            required
            className={FIELD_INPUT}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`${idPrefix}-highest`} required>
            Highest
          </FieldLabel>
          <Input
            id={`${idPrefix}-highest`}
            type="number"
            step="0.01"
            placeholder="100.00"
            value={values.highest_grade}
            onChange={(e) => set({ highest_grade: e.target.value })}
            required
            className={FIELD_INPUT}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`${idPrefix}-failing`} required>
            Failing
          </FieldLabel>
          <Input
            id={`${idPrefix}-failing`}
            type="number"
            step="0.01"
            placeholder="74.00"
            value={values.failing_grade}
            onChange={(e) => set({ failing_grade: e.target.value })}
            required
            className={FIELD_INPUT}
          />
        </div>
      </div>
      <div>
        <p className="text-sm! font-semibold text-navy">Special codes</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Non-standard marks and what they mean (e.g. 7.1 → DROPPED).
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {values.codes.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2">
              <Input
                placeholder="7.1"
                value={c.code}
                onChange={(e) => setCode(c.id, { code: e.target.value })}
                aria-label={`Special code value ${i + 1}`}
                className="h-10! w-28 border-line bg-[#f7f9fb]! text-sm! md:text-sm!"
              />
              <Input
                placeholder="DROPPED"
                value={c.status}
                onChange={(e) => setCode(c.id, { status: e.target.value })}
                aria-label={`Special code status ${i + 1}`}
                className="h-10! flex-1 border-line bg-[#f7f9fb]! text-sm! md:text-sm!"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove special code ${i + 1}`}
                onClick={() => set({ codes: values.codes.filter((row) => row.id !== c.id) })}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 self-start text-xs!"
            onClick={() => set({ codes: [...values.codes, { id: `code-${Date.now()}`, code: "", status: "" }] })}
          >
            <Plus className="size-3.5" />
            Add code
          </Button>
        </div>
      </div>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-notes`}>Notes</FieldLabel>
        <Textarea
          id={`${idPrefix}-notes`}
          placeholder="e.g. 1.0 is Failed, 2.0 is 75-79 (Passing)."
          value={values.notes}
          onChange={(e) => set({ notes: e.target.value })}
          className="mt-2 min-h-24 border-line bg-[#f7f9fb]! text-sm! md:text-sm!"
        />
      </div>
    </div>
  );
}

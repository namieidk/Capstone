"use client";

import { Info, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  grading_scale: "NUMERIC_4_POINT",
  passing_grade: "2.00",
  highest_grade: "4.00",
  failing_grade: "1.00",
  notes: "",
  codes: [],
};

export const SCALE_PRESETS = [
  {
    id: "NUMERIC_4_POINT",
    label: "4.0 Scale (Ascending - e.g. UM)",
    description: "4.00 Highest, 2.00 Passing, 1.00 Failing (Higher is better)",
    passing: "2.00",
    highest: "4.00",
    failing: "1.00",
    defaultNotes: "4.0 (96-100), 3.5 (90-95), 3.0 (85-89), 2.5 (80-84), 2.0 (75-79 Passing), 1.0 (Failed).",
  },
  {
    id: "NUMERIC_5_POINT",
    label: "5.0 Scale (Descending - e.g. USEP / UP)",
    description: "1.00 Highest, 3.00 Passing, 5.00 Failing (Lower is better)",
    passing: "3.00",
    highest: "1.00",
    failing: "5.00",
    defaultNotes:
      "1.0 (96-100), 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0 (Passing), 4.0 (Conditional), 5.0 (Failed).",
  },
  {
    id: "PERCENTAGE_100",
    label: "100-Point Percentage (DepEd / SHS)",
    description: "100.00 Highest, 75.00 Passing, 74.00 Failing (Higher is better)",
    passing: "75.00",
    highest: "100.00",
    failing: "74.00",
    defaultNotes: "75.00 is minimum passing mark, 90.00+ for academic retention/honors.",
  },
  {
    id: "CUSTOM",
    label: "Custom Scale Identifier",
    description: "Custom institutional scale bounds",
    passing: "",
    highest: "",
    failing: "",
    defaultNotes: "",
  },
];

export const UM_SPECIAL_CODES = [
  { code: "9.0", status: "DROPPED" },
  { code: "7.1", status: "LACKING_PAYMENT" },
  { code: "7.2", status: "LACKING_REQUIREMENTS" },
  { code: "1.0", status: "FAILED" },
  { code: "PSD", status: "PASSED" },
  { code: "TWE", status: "TOTAL_WITHDRAWAL" },
  { code: "INC", status: "INCOMPLETE" },
];

export const STANDARD_SPECIAL_CODES = [
  { code: "5.0", status: "FAILED" },
  { code: "INC", status: "INCOMPLETE" },
  { code: "DRP", status: "DROPPED" },
  { code: "FA", status: "FAILURE_DUE_TO_ABSENCES" },
  { code: "P", status: "PASSED" },
  { code: "LOA", status: "LEAVE_OF_ABSENCE" },
];

export const COMMON_STATUS_OPTIONS = [
  { value: "DROPPED", label: "DROPPED (e.g. 9.0, DRP)" },
  { value: "LACKING_PAYMENT", label: "LACKING_PAYMENT (e.g. 7.1)" },
  { value: "LACKING_REQUIREMENTS", label: "LACKING_REQUIREMENTS (e.g. 7.2)" },
  { value: "FAILED", label: "FAILED (e.g. 1.0, 5.0)" },
  { value: "PASSED", label: "PASSED (e.g. PSD, P)" },
  { value: "INCOMPLETE", label: "INCOMPLETE (e.g. INC)" },
  { value: "TOTAL_WITHDRAWAL", label: "TOTAL_WITHDRAWAL (e.g. TWE)" },
  { value: "LEAVE_OF_ABSENCE", label: "LEAVE_OF_ABSENCE (e.g. LOA)" },
  { value: "FAILURE_DUE_TO_ABSENCES", label: "FAILURE_DUE_TO_ABSENCES (FA)" },
];

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
    codes: Object.entries(g.special_codes ?? {}).map(([code, status]) => ({
      id: `${code}-${Math.random()}`,
      code,
      status,
    })),
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
  const [customScaleMode, setCustomScaleMode] = useState(
    !SCALE_PRESETS.some((p) => p.id === values.grading_scale && p.id !== "CUSTOM") && values.grading_scale !== "",
  );

  const set = (patch: Partial<GradingFormValues>) => onChange({ ...values, ...patch });

  function handlePresetSelect(scaleId: string) {
    if (scaleId === "CUSTOM") {
      setCustomScaleMode(true);
      set({ grading_scale: "" });
      return;
    }
    setCustomScaleMode(false);
    const preset = SCALE_PRESETS.find((p) => p.id === scaleId);
    if (!preset) return;

    set({
      grading_scale: preset.id,
      passing_grade: preset.passing,
      highest_grade: preset.highest,
      failing_grade: preset.failing,
      notes: values.notes.trim() ? values.notes : preset.defaultNotes,
    });
  }

  function loadUmSpecialCodes() {
    const existing = new Set(values.codes.map((c) => c.code.trim().toUpperCase()));
    const newItems = UM_SPECIAL_CODES.filter((u) => !existing.has(u.code.toUpperCase())).map((u) => ({
      id: `um-${u.code}-${Date.now()}`,
      code: u.code,
      status: u.status,
    }));
    set({ codes: [...values.codes, ...newItems] });
  }

  function loadStandardSpecialCodes() {
    const existing = new Set(values.codes.map((c) => c.code.trim().toUpperCase()));
    const newItems = STANDARD_SPECIAL_CODES.filter((u) => !existing.has(u.code.toUpperCase())).map((u) => ({
      id: `std-${u.code}-${Date.now()}`,
      code: u.code,
      status: u.status,
    }));
    set({ codes: [...values.codes, ...newItems] });
  }

  function setCode(id: string, patch: Partial<{ code: string; status: string }>) {
    set({ codes: values.codes.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  }

  const selectedPreset =
    SCALE_PRESETS.find((p) => p.id === values.grading_scale) ?? (customScaleMode ? SCALE_PRESETS[3] : null);

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
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={`${idPrefix}-grading-scale`} required>
            Grading scale type
          </FieldLabel>
          <span className="text-[11px] text-muted-foreground">Determines passing & threshold direction</span>
        </div>

        <div className="mt-2">
          <Select
            value={customScaleMode ? "CUSTOM" : values.grading_scale || "NUMERIC_4_POINT"}
            onValueChange={handlePresetSelect}
          >
            <SelectTrigger className="h-11 border-line bg-[#f7f9fb] text-sm text-navy">
              <SelectValue placeholder="Choose grading scale" />
            </SelectTrigger>
            <SelectContent className="border-line bg-white">
              {SCALE_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-sm py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-navy">{p.label}</span>
                    <span className="text-xs text-muted-foreground">{p.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {customScaleMode && (
          <div className="mt-2">
            <Input
              id={`${idPrefix}-grading-scale-custom`}
              placeholder="Enter custom scale identifier (e.g. UM_SCALE or GPA_4)"
              value={values.grading_scale}
              onChange={(e) => set({ grading_scale: e.target.value })}
              required
              className={FIELD_INPUT}
            />
          </div>
        )}

        {selectedPreset && (
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-tint/60 p-2.5 text-xs text-navy border border-line">
            <Info className="size-4 shrink-0 text-navy mt-0.5" />
            <div>
              <p className="font-medium">{selectedPreset.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor={`${idPrefix}-passing`} required>
            Passing Grade
          </FieldLabel>
          <Input
            id={`${idPrefix}-passing`}
            type="number"
            step="0.01"
            placeholder="2.00"
            value={values.passing_grade}
            onChange={(e) => set({ passing_grade: e.target.value })}
            required
            className={FIELD_INPUT}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Minimum mark to pass</p>
        </div>
        <div>
          <FieldLabel htmlFor={`${idPrefix}-highest`} required>
            Highest Grade
          </FieldLabel>
          <Input
            id={`${idPrefix}-highest`}
            type="number"
            step="0.01"
            placeholder="4.00"
            value={values.highest_grade}
            onChange={(e) => set({ highest_grade: e.target.value })}
            required
            className={FIELD_INPUT}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Top academic mark</p>
        </div>
        <div>
          <FieldLabel htmlFor={`${idPrefix}-failing`} required>
            Failing Grade
          </FieldLabel>
          <Input
            id={`${idPrefix}-failing`}
            type="number"
            step="0.01"
            placeholder="1.00"
            value={values.failing_grade}
            onChange={(e) => set({ failing_grade: e.target.value })}
            required
            className={FIELD_INPUT}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Disqualifying mark</p>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm! font-semibold text-navy">Special Status Codes</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Transcript marks representing non-standard marks (e.g. 9.0 → DROPPED, 7.1 → LACKING_PAYMENT, PSD →
              PASSED).
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs font-semibold text-navy border-line hover:bg-tint"
              onClick={loadUmSpecialCodes}
            >
              <Sparkles className="size-3 text-amber mr-1" />+ Load UM Codes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs font-semibold text-navy border-line hover:bg-tint"
              onClick={loadStandardSpecialCodes}
            >
              + Load Standard Codes
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {values.codes.length === 0 && (
            <p className="text-xs text-muted-foreground py-2 text-center bg-[#f7f9fb] rounded-lg border border-dashed border-line">
              No special codes added. Click &quot;+ Load UM Codes&quot; or &quot;Add code&quot; below.
            </p>
          )}

          {values.codes.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2">
              <Input
                placeholder="e.g. 9.0 or PSD"
                value={c.code}
                onChange={(e) => setCode(c.id, { code: e.target.value })}
                aria-label={`Special code mark ${i + 1}`}
                className="h-10! w-28 border-line bg-[#f7f9fb]! text-xs! font-bold text-navy md:text-xs!"
              />
              <Input
                placeholder="DROPPED or PASSED"
                value={c.status}
                onChange={(e) => setCode(c.id, { status: e.target.value })}
                aria-label={`Special code status ${i + 1}`}
                className="h-10! flex-1 border-line bg-[#f7f9fb]! text-xs! font-semibold text-navy md:text-xs!"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove special code ${i + 1}`}
                className="size-8 text-muted-foreground hover:text-red-600"
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
            className="h-8 self-start text-xs! border-line mt-1"
            onClick={() => set({ codes: [...values.codes, { id: `code-${Date.now()}`, code: "", status: "" }] })}
          >
            <Plus className="size-3.5 mr-1" />
            Add code
          </Button>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-notes`}>Grading System Notes & Breakdown</FieldLabel>
        <Textarea
          id={`${idPrefix}-notes`}
          placeholder="e.g. 4.0 = 96-100, 3.5 = 90-95, 3.0 = 85-89, 2.5 = 80-84, 2.0 = 75-79 (Passing), 1.0 = Failed."
          value={values.notes}
          onChange={(e) => set({ notes: e.target.value })}
          className="mt-2 min-h-20 border-line bg-[#f7f9fb]! text-sm! md:text-sm!"
        />
      </div>
    </div>
  );
}

"use client";

import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { SchoolGrading, SchoolGradingInput } from "@/lib/api/settings";
import {
  EMPTY_GRADING_VALUES,
  GradingFields,
  type GradingFormValues,
  gradingFormToInput,
  toFormValues,
} from "./GradingFields";

interface GradingSheetProps {
  school: SchoolGrading | null;
  onClose: () => void;
  canDelete: boolean;
  onUpdate: (id: number, input: Partial<SchoolGradingInput>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const SECTION_LABEL = "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card px-4 py-3.5">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-center text-sm font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

function getSpecialCodeBadgeClass(status: string): string {
  const upper = status.toUpperCase();
  if (upper.includes("FAIL") || upper.includes("DROP") || upper.includes("WITHDRAW")) {
    return "bg-red-50 text-red-700 border-red-200";
  }
  if (upper.includes("LACK") || upper.includes("INC") || upper.includes("HOLD") || upper.includes("PAYMENT")) {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  if (upper.includes("PASS") || upper === "PSD" || upper === "P") {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
  return "bg-[#f7f9fb] text-navy border-line";
}

function formatScaleLabel(scale: string): string {
  if (scale === "NUMERIC_4_POINT") return "4.0 Scale (Ascending - e.g. UM)";
  if (scale === "NUMERIC_5_POINT") return "5.0 Scale (Descending - e.g. USEP / UP)";
  if (scale === "PERCENTAGE_100") return "100-Point Percentage (DepEd / SHS)";
  return scale;
}

export function GradingSheet({ school, onClose, canDelete, onUpdate, onDelete }: GradingSheetProps) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<GradingFormValues>(EMPTY_GRADING_VALUES);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setEditing(false);
    setError("");
    setValues(toFormValues(school));
  }, [school]);

  // The page closes the sheet after a successful delete — make sure a
  // lingering confirmation dialog closes with it.
  useEffect(() => {
    if (!school) setConfirmDelete(false);
  }, [school]);

  async function handleSave() {
    if (!school) return;
    const { input, error: validationError } = gradingFormToInput(values);
    if (validationError || !input) {
      setError(validationError ?? "Invalid grading configuration.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onUpdate(school.school_id, input);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update grading system.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!school) return;
    setDeleting(true);
    try {
      await onDelete(school.school_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete grading system.");
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  const codes = Object.entries(school?.special_codes ?? {});

  return (
    <>
      <Sheet open={school !== null} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex w-full flex-col gap-0 overflow-hidden border-l border-border bg-background p-0 sm:max-w-lg"
        >
          {school && (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="truncate text-base font-semibold text-foreground">
                    {school.school_name}
                  </SheetTitle>
                  <SheetDescription className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {formatScaleLabel(school.grading_scale)}
                  </SheetDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={onClose}
                  aria-label="Close details"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-7">
                {editing ? (
                  <div className="space-y-4">
                    <GradingFields values={values} onChange={setValues} idPrefix="edit-grading" />
                    {error && (
                      <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium leading-relaxed text-destructive">
                        {error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-7">
                    <div className="grid grid-cols-3 gap-3">
                      <InfoItem label="Passing" value={school.passing_grade.toFixed(2)} />
                      <InfoItem label="Highest" value={school.highest_grade.toFixed(2)} />
                      <InfoItem label="Failing" value={school.failing_grade.toFixed(2)} />
                    </div>

                    <div className="space-y-3">
                      <p className={SECTION_LABEL}>Special Status Codes</p>
                      {codes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">None configured.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {codes.map(([code, status]) => (
                            <span
                              key={code}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold tabular-nums ${getSpecialCodeBadgeClass(
                                String(status),
                              )}`}
                            >
                              <span className="font-bold">{code}</span>
                              <span className="text-muted-foreground">→</span>
                              <span>{String(status)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <p className={SECTION_LABEL}>Notes</p>
                      <p className="rounded-xl border border-border/70 bg-card p-4 text-sm leading-relaxed text-foreground wrap-break-word">
                        {school.notes?.trim() ? school.notes : "No notes."}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground">Last updated {formatDateTime(school.updated_at)}</p>

                    {error && (
                      <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium leading-relaxed text-destructive">
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col gap-2.5">
                      <Button
                        type="button"
                        className="h-11 w-full rounded-xl text-sm font-semibold"
                        onClick={() => {
                          setValues(toFormValues(school));
                          setError("");
                          setEditing(true);
                        }}
                      >
                        <Pencil className="size-4 mr-2" />
                        Edit System
                      </Button>
                      {canDelete && (
                        <Button
                          type="button"
                          variant="destructive"
                          className="h-11 w-full rounded-xl text-sm font-medium"
                          onClick={() => setConfirmDelete(true)}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete System
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {editing && (
                <div className="flex items-center justify-end gap-3 border-t border-border/70 px-6 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-xl px-4 text-sm font-medium"
                    onClick={() => {
                      setEditing(false);
                      setError("");
                      setValues(toFormValues(school));
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="h-10 rounded-xl px-5 text-sm font-semibold shadow-xs"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete grading system?"
        description={
          school
            ? `The configuration for ${school.school_name} will be removed. This cannot be undone.`
            : "This grading configuration will be removed."
        }
        confirmLabel="Delete"
        acting={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

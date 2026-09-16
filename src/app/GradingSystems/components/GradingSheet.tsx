"use client";

import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    <div>
      <p className="mb-1 text-xs text-[#9a9a94]">{label}</p>
      <p className="text-sm font-bold text-navy tabular-nums">{value}</p>
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
          className="w-full sm:max-w-lg flex flex-col gap-0 p-0 overflow-hidden border-l border-border bg-background"
        >
          {school && (
            <>
              <div className="flex items-center justify-between border-b border-border p-6 bg-card">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-lg font-semibold text-foreground truncate">
                    {school.school_name}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                    {formatScaleLabel(school.grading_scale)}
                  </SheetDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground shrink-0"
                  onClick={onClose}
                  aria-label="Close details"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {editing ? (
                  <div className="space-y-4">
                    <GradingFields values={values} onChange={setValues} idPrefix="edit-grading" />
                    {error && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium leading-relaxed text-destructive">
                        {error}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-muted/40 p-4">
                      <InfoItem label="Passing" value={school.passing_grade.toFixed(2)} />
                      <InfoItem label="Highest" value={school.highest_grade.toFixed(2)} />
                      <InfoItem label="Failing" value={school.failing_grade.toFixed(2)} />
                    </div>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Special Status Codes
                    </p>
                    {codes.length === 0 ? (
                      <p className="mt-2 text-sm text-muted-foreground">None configured.</p>
                    ) : (
                      <div className="mt-2 flex flex-wrap gap-2">
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

                    <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
                    <p className="mt-2 rounded-lg border border-border bg-muted/30 p-3 text-sm leading-relaxed wrap-break-word text-foreground">
                      {school.notes?.trim() ? school.notes : "No notes."}
                    </p>

                    <Separator className="my-5" />
                    <p className="text-xs text-muted-foreground">Last updated {formatDateTime(school.updated_at)}</p>

                    {error && (
                      <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium leading-relaxed text-destructive">
                        {error}
                      </div>
                    )}

                    <div className="mt-6 flex flex-col gap-2.5">
                      <Button
                        type="button"
                        className="h-10 w-full font-semibold"
                        onClick={() => {
                          setValues(toFormValues(school));
                          setError("");
                          setEditing(true);
                        }}
                      >
                        <Pencil className="size-4 mr-1.5" />
                        Edit System
                      </Button>
                      {canDelete && (
                        <Button
                          type="button"
                          variant="destructive"
                          className="h-10 w-full font-medium"
                          onClick={() => setConfirmDelete(true)}
                        >
                          <Trash2 className="size-4 mr-1.5" />
                          Delete System
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {editing && (
                <div className="flex items-center justify-end gap-2.5 border-t border-border p-4 bg-card/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      setError("");
                      setValues(toFormValues(school));
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button type="button" size="sm" className="px-5 font-semibold" onClick={handleSave} disabled={saving}>
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

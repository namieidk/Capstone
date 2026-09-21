"use client";

import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BAD, BAD_BG } from "@/components/Adminshared";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
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
          className="w-[440px]! max-w-[92vw]! gap-0 overflow-y-auto border-line bg-white p-8 text-sm!"
        >
          {school && (
            <>
              <div className="flex items-start gap-3.5">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-xl! text-navy!">{school.school_name}</SheetTitle>
                  <SheetDescription className="text-sm!">{school.grading_scale}</SheetDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={onClose}
                  aria-label="Close details"
                >
                  <X className="size-5 text-[#9a9a94]" />
                </Button>
              </div>

              {editing ? (
                <div className="mt-6">
                  <GradingFields values={values} onChange={setValues} idPrefix="edit-grading" />
                  {error && (
                    <div className="mt-4 rounded-[10px] border border-[#f5c2c0] bg-[#fdebec] px-3.5 py-3 text-sm leading-relaxed text-[#b3261e]">
                      {error}
                    </div>
                  )}
                  <div className="mt-4 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 flex-1 text-sm! text-navy"
                      onClick={() => {
                        setEditing(false);
                        setError("");
                        setValues(toFormValues(school));
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button type="button" className="h-11 flex-1 text-sm!" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-6 grid grid-cols-3 gap-4 rounded-[14px] bg-tint p-5">
                    <InfoItem label="Passing" value={school.passing_grade.toFixed(2)} />
                    <InfoItem label="Highest" value={school.highest_grade.toFixed(2)} />
                    <InfoItem label="Failing" value={school.failing_grade.toFixed(2)} />
                  </div>

                  <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[#9a9a94]">Special codes</p>
                  {codes.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">None configured.</p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {codes.map(([code, status]) => (
                        <Badge key={code} variant="outline" className="h-6 px-2.5 text-xs! tabular-nums">
                          {code} → {status}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[#9a9a94]">Notes</p>
                  <p className="mt-2 rounded-md bg-muted p-3 text-sm leading-relaxed break-words">
                    {school.notes?.trim() ? school.notes : "No notes."}
                  </p>

                  <Separator className="my-4" />
                  <p className="text-xs text-muted-foreground">Last updated {formatDateTime(school.updated_at)}</p>

                  {error && (
                    <div className="mt-4 rounded-[10px] border border-[#f5c2c0] bg-[#fdebec] px-3.5 py-3 text-sm leading-relaxed text-[#b3261e]">
                      {error}
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-2.5">
                    <Button
                      type="button"
                      className="h-11 w-full rounded-full text-sm!"
                      onClick={() => {
                        setValues(toFormValues(school));
                        setError("");
                        setEditing(true);
                      }}
                    >
                      <Pencil className="size-4" />
                      Edit system
                    </Button>
                    {canDelete && (
                      <Button
                        type="button"
                        className="h-11 w-full rounded-full text-sm!"
                        style={{ background: BAD_BG, color: BAD }}
                        onClick={() => setConfirmDelete(true)}
                      >
                        <Trash2 className="size-4" />
                        Delete system
                      </Button>
                    )}
                  </div>
                </>
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

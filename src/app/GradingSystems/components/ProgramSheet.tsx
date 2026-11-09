"use client";

import { AlertCircle, Archive, BookOpen, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  type ArchiveRecordInput,
  archiveReasonLabel,
  PROGRAM_ARCHIVE_REASONS,
  type ProgramArchiveReason,
} from "@/lib/api/archive";
import type { AcademicProgram, AcademicProgramInput } from "@/lib/api/settings";
import { academicProgramSchema } from "@/lib/validation";

interface ProgramSheetProps {
  program: AcademicProgram | null;
  open: boolean;
  canDelete?: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: number, input: Partial<AcademicProgramInput>) => Promise<void>;
  onDelete: (id: number, data: ArchiveRecordInput) => Promise<void>;
}

export function ProgramSheet({
  program,
  open,
  canDelete = false,
  onOpenChange,
  onUpdate,
  onDelete,
}: ProgramSheetProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("College");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [archiveReason, setArchiveReason] = useState<ProgramArchiveReason>("PROGRAM_OUTDATED");
  const [archiveNotes, setArchiveNotes] = useState("");

  const isPending = Boolean(program && !program.is_active);

  useEffect(() => {
    if (program) {
      setCode(program.program_code);
      setName(program.program_name);
      setCategory(program.category || "College");
      setDescription(program.description || "");
      setIsActive(program.is_active);
      setShowConfirmDelete(false);
      setArchiveReason("PROGRAM_OUTDATED");
      setArchiveNotes("");
      setError("");
    }
  }, [program]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!program) return;

    const result = academicProgramSchema.safeParse({
      program_code: code,
      program_name: name,
      category,
      description,
      is_active: isPending ? true : isActive,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please provide valid program details.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onUpdate(program.program_id, {
        program_code: result.data.program_code,
        program_name: result.data.program_name,
        category: result.data.category,
        description: result.data.description,
        is_active: result.data.is_active,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update academic program.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!program) return;
    setDeleting(true);
    try {
      await onDelete(program.program_id, {
        archive_reason: archiveReason,
        archive_notes: archiveNotes.trim() || undefined,
      });
      setShowConfirmDelete(false);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive academic program.");
    } finally {
      setDeleting(false);
    }
  }

  if (!program) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full sm:max-w-lg! flex flex-col gap-0 p-0 overflow-hidden border-l border-border bg-background"
        >
          <div className="flex items-center justify-between border-b border-border p-6 bg-card">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <BookOpen className="size-5" />
              </span>
              <div className="min-w-0">
                <SheetTitle className="text-lg font-semibold text-foreground">Edit Academic Program</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  ID: #{program.program_id} &middot; Created on {new Date(program.created_at).toLocaleDateString()}
                </SheetDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="size-8 rounded-full"
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>

          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && <div className="rounded-lg bg-bad-bg p-3 text-xs font-semibold text-bad">{error}</div>}

            {isPending && (
              <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-semibold text-amber-900">
                  <AlertCircle className="size-4 text-amber-600 shrink-0" />
                  <span>Pending Program Verification</span>
                </div>
                <p className="mt-1 text-[11px] text-amber-800/90 leading-relaxed">
                  This academic program was proposed by an applicant during application. Please verify its official
                  course title, assign an appropriate program code (e.g. BSIT, BSED), and click{" "}
                  <strong>Verify Program</strong> to activate it for all scholars.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="edit_program_code" className="text-xs font-bold text-navy uppercase">
                Program Code *
              </Label>
              <Input
                id="edit_program_code"
                placeholder="e.g. BSIT"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_program_name" className="text-xs font-bold text-navy uppercase">
                Program Name *
              </Label>
              <Input
                id="edit_program_name"
                placeholder="e.g. BS Information Technology"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_category" className="text-xs font-bold text-navy uppercase">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="edit_category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="College">College Degree Program</SelectItem>
                  <SelectItem value="Senior High School">Senior High School Strand</SelectItem>
                  <SelectItem value="Vocational">Vocational / Technical</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_description" className="text-xs font-bold text-navy uppercase">
                Description / Notes
              </Label>
              <Textarea
                id="edit_description"
                placeholder="Details about this program..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="edit_is_active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded border-line accent-navy"
              />
              <Label htmlFor="edit_is_active" className="text-xs font-medium cursor-pointer">
                Active (selectable by applicants during application)
              </Label>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-line">
              {canDelete ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-2 text-bad hover:bg-bad-bg hover:text-bad"
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={saving || deleting}
                >
                  <Archive className="size-4" />
                  Archive
                </Button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving || deleting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || deleting}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Academic Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive{" "}
              <strong>
                {program.program_name} ({program.program_code})
              </strong>
              ? It will no longer appear in active lists but will remain in the archive for records. Choose the reason
              for archiving.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-1">
            <Select value={archiveReason} onValueChange={(value) => setArchiveReason(value as ProgramArchiveReason)}>
              <SelectTrigger aria-label="Archive reason" className="h-10 text-sm w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {PROGRAM_ARCHIVE_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {archiveReasonLabel(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={archiveNotes}
              onChange={(e) => setArchiveNotes(e.target.value)}
              placeholder="Optional note (e.g. curriculum replaced in AY 2026–2027)"
              className="text-sm resize-none min-h-[70px]"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-bad text-bad-fg hover:bg-bad/90"
            >
              {deleting ? "Archiving..." : "Archive Program"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

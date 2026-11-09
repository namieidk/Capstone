"use client";

import { Archive, Building2, GraduationCap, LibraryBig } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ToastContext";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import {
  type ArchivedApplicantProfile,
  type ArchivedProgram,
  type ArchivedScholarProfile,
  type ArchivedSchool,
  restoreApplicant,
  restoreProgram,
  restoreScholar,
  restoreSchool,
} from "@/lib/api/archive";
import { ArchiveReasonBadge } from "./ArchiveReasonBadge";
import { type ArchivedItem, formatArchiveDate } from "./types";

interface ArchiveDetailDrawerProps {
  item: ArchivedItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestored: () => void;
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-0.5 min-w-0">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="text-xs font-bold text-foreground break-words">{value || "—"}</div>
    </div>
  );
}

function DrawerAvatar({ item }: { item: ArchivedItem }) {
  if (item.kind === "school") {
    return (
      <div className="flex size-12 items-center justify-center rounded-full bg-navy/10 text-navy">
        <Building2 className="size-6" />
      </div>
    );
  }
  if (item.kind === "program") {
    return (
      <div className="flex size-12 items-center justify-center rounded-full bg-navy/10 text-navy">
        <LibraryBig className="size-6" />
      </div>
    );
  }
  const row = item.row as ArchivedScholarProfile | ArchivedApplicantProfile;
  const initials = `${row.first_name?.[0] ?? ""}${row.last_name?.[0] ?? ""}`.toUpperCase() || "SC";
  return (
    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
      {initials}
    </div>
  );
}

function drawerTitle(item: ArchivedItem): string {
  switch (item.kind) {
    case "scholar":
      return `${item.row.first_name} ${item.row.last_name}`.trim() || "Archived Scholar";
    case "applicant":
      return `${item.row.first_name} ${item.row.last_name}`.trim() || "Archived Applicant";
    case "school":
      return item.row.school_name;
    case "program":
      return item.row.program_name;
  }
}

function drawerSubtitle(item: ArchivedItem): string {
  switch (item.kind) {
    case "scholar":
      return item.row.course_of_study || item.row.user.email;
    case "applicant":
      return item.row.course_of_study || item.row.user.email;
    case "school":
      return item.row.school_code ?? item.row.contact_email ?? "Archived Institution";
    case "program":
      return item.row.program_code;
  }
}

function renderInfoTiles(item: ArchivedItem) {
  switch (item.kind) {
    case "scholar":
      return (
        <>
          <InfoTile label="Scholarship Track" value={item.row.scholarship_track?.replaceAll("_", " ") ?? "—"} />
          <InfoTile label="Student No." value={item.row.student_number ?? "—"} />
          <InfoTile label="School" value={item.row.school_name ?? "Unassigned"} />
          <InfoTile label="Email" value={item.row.user.email} />
        </>
      );
    case "applicant": {
      const latest = item.row.applications?.[0];
      return (
        <>
          <InfoTile label="School" value={item.row.school_name ?? "Unassigned"} />
          <InfoTile label="Email" value={item.row.user.email} />
          <InfoTile label="Latest Status" value={latest ? latest.status : "—"} />
          <InfoTile label="Latest Stage" value={latest ? latest.stage : "—"} />
        </>
      );
    }
    case "school": {
      const row = item.row as ArchivedSchool;
      return (
        <>
          <InfoTile label="Code" value={row.school_code ?? "—"} />
          <InfoTile label="Grading Scale" value={row.grading_system?.grading_scale?.replaceAll("_", " ") ?? "—"} />
          <InfoTile label="Linked Scholars" value={String(row._count?.scholar_profiles ?? 0)} />
          <InfoTile label="Address" value={row.address ?? "—"} />
        </>
      );
    }
    case "program": {
      const row = item.row as ArchivedProgram;
      return (
        <>
          <InfoTile label="Program Code" value={row.program_code} />
          <InfoTile label="Category" value={row.category ?? "—"} />
        </>
      );
    }
  }
}

export function ArchiveDetailDrawer({ item, open, onOpenChange, onRestored }: ArchiveDetailDrawerProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [restoring, setRestoring] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);

  const canRestore = user?.role === "ADMIN" || user?.role === "GRANTOR";

  useEffect(() => {
    if (!open) {
      setRestoring(false);
      setConfirmRestore(false);
    }
  }, [open]);

  if (!item) return null;

  const title = drawerTitle(item);
  const reason = item.row.archive_reason;
  const notes = item.row.archive_notes || "No notes were recorded for this archive decision.";

  async function handleRestore() {
    if (!item) return;
    setRestoring(true);
    try {
      let result: { message: string };
      switch (item.kind) {
        case "scholar":
          result = await restoreScholar(item.row.profile_id);
          break;
        case "applicant":
          result = await restoreApplicant(item.row.profile_id);
          break;
        case "school":
          result = await restoreSchool(item.row.school_id);
          break;
        case "program":
          result = await restoreProgram(item.row.program_id);
          break;
      }
      showToast(result.message || "Record restored successfully.", "success");
      setConfirmRestore(false);
      onOpenChange(false);
      onRestored();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to restore the record.", "error");
      setConfirmRestore(false);
    } finally {
      setRestoring(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6 space-y-5">
          <SheetHeader className="pb-3 border-b border-border space-y-3">
            <div className="flex items-center gap-3">
              <DrawerAvatar item={item} />
              <div className="min-w-0">
                <SheetTitle className="text-base font-bold text-foreground truncate">{title}</SheetTitle>
                <p className="text-xs text-muted-foreground truncate">{drawerSubtitle(item)}</p>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Archive Details
              </span>
              <div className="grid grid-cols-2 gap-2.5">{renderInfoTiles(item)}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <ArchiveReasonBadge reason={reason} />
                <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                  Archived on {formatArchiveDate(item.row.archived_at)}
                </span>
              </div>
              <span className="font-semibold text-foreground">Archive Note:</span>
              <p className="text-[11px] leading-relaxed">{notes}</p>
            </div>

            <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground px-1">
              <span>Records are never deleted.</span>
              <Badge variant="outline" className="text-[10px]">
                <GraduationCap className="mr-1 size-3" />
                Preserved
              </Badge>
            </div>

            {canRestore && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-center gap-1.5 text-xs h-10 border-navy/20 text-navy hover:bg-tint"
                onClick={() => setConfirmRestore(true)}
                disabled={restoring}
              >
                <Archive className="w-4 h-4" />
                {restoring ? "Restoring..." : "Restore Record"}
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmRestore} onOpenChange={setConfirmRestore}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore “{title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This record will be visible in the active lists again and will be unarchived. The archive reason and notes
              will be cleared. Linked historical data is not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={restoring}
              className="bg-navy text-white hover:bg-navy/90"
            >
              {restoring ? "Restoring..." : "Confirm Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

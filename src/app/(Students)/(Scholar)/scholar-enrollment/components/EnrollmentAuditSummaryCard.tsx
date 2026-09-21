"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, Info, Loader2, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { EnrollmentAuditResult } from "@/lib/api/enrollment";

interface EnrollmentAuditSummaryCardProps {
  auditResult: EnrollmentAuditResult | null;
  isSubmitting: boolean;
  isSavingDraft?: boolean;
  canSubmit: boolean;
  status: string;
  coordinatorNotes?: string | null;
  onSubmit: () => void;
  onSaveDraft?: () => void;
  onDiscardDraft?: () => void;
  hasDraft?: boolean;
}

export function EnrollmentAuditSummaryCard({
  auditResult,
  isSubmitting,
  isSavingDraft,
  canSubmit,
  status,
  coordinatorNotes,
  onSubmit,
  onSaveDraft,
  onDiscardDraft,
  hasDraft,
}: EnrollmentAuditSummaryCardProps) {
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING_REVIEW";
  const isCorrection = status === "CHANGES_REQUESTED";

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <ShieldCheck className="size-4.5 text-emerald-700" />
            Automated Baseline Audit Pre-Check
          </CardTitle>
          {auditResult && (
            <Badge
              variant="outline"
              className={`text-xs font-semibold px-2.5 py-0.5 ${
                auditResult.all_cleared
                  ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                  : "bg-amber-50 text-amber-900 border-amber-300"
              }`}
            >
              {auditResult.all_cleared ? "Ready for Endorsement" : "Advisories Detected"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        {isCorrection && coordinatorNotes && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertTriangle className="size-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-orange-950">Coordinator Requested Corrections:</p>
              <p className="text-xs text-orange-900 mt-0.5">{coordinatorNotes}</p>
            </div>
          </div>
        )}

        {auditResult && auditResult.flags.length > 0 && (
          <div className="space-y-2">
            {auditResult.flags.map((flag) => (
              <div
                key={flag}
                className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-950"
              >
                <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{flag.replace(/_/g, " ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {isApproved ? (
            <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600" />
              Enrollment verified and tuition balance endorsed to Grantor.
            </p>
          ) : isPending ? (
            <p className="text-amber-800 font-medium">
              Your credentials have been submitted and are currently in the Coordinator's review queue.
            </p>
          ) : (
            <p>Review all extracted subjects and billing ledger above before submitting for coordinator audit.</p>
          )}
        </div>
      </CardContent>

      {!isApproved && !isPending && (
        <CardFooter className="p-4 sm:p-5 pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/20">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasDraft && onDiscardDraft && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDiscardDialogOpen(true)}
                disabled={isSubmitting || isSavingDraft}
                className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-9 gap-1.5 w-full sm:w-auto"
              >
                <Trash2 className="size-3.5" />
                Discard Draft
              </Button>
            )}
            {onSaveDraft && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSaveDraft}
                disabled={isSubmitting || isSavingDraft}
                className="text-xs font-semibold h-9 gap-1.5 w-full sm:w-auto"
              >
                {isSavingDraft ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                Save as Draft
              </Button>
            )}
          </div>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting || isSavingDraft}
            className="w-full sm:w-auto h-9 px-6 text-xs font-bold gap-2 bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Submitting for Audit...</span>
              </>
            ) : (
              <>
                <span>Submit Enrollment Credentials</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </CardFooter>
      )}

      {/* Discard Draft Confirmation Alert Dialog */}
      <AlertDialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl p-6">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="size-6" />
            </div>
            <AlertDialogTitle className="text-base sm:text-lg font-bold">Discard Enrollment Draft?</AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-xs text-muted-foreground">
              Are you sure you want to discard your draft enrollment? This will remove all uploaded documents, extracted
              course subjects, and tuition billing data from this session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-2">
            <AlertDialogCancel className="h-9 rounded-lg text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-9 rounded-lg bg-destructive px-4 text-xs font-semibold text-white hover:bg-destructive/90"
              onClick={() => {
                setIsDiscardDialogOpen(false);
                onDiscardDraft?.();
              }}
            >
              Discard Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

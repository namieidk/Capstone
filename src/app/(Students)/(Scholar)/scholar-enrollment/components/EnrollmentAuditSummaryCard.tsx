"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, Info, Loader2, ShieldCheck } from "lucide-react";
import type { EnrollmentAuditResult } from "@/lib/api/enrollment";

interface EnrollmentAuditSummaryCardProps {
  auditResult: EnrollmentAuditResult | null;
  isSubmitting: boolean;
  canSubmit: boolean;
  status: string;
  coordinatorNotes?: string | null;
  onSubmit: () => void;
}

export function EnrollmentAuditSummaryCard({
  auditResult,
  isSubmitting,
  canSubmit,
  status,
  coordinatorNotes,
  onSubmit,
}: EnrollmentAuditSummaryCardProps) {
  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING_REVIEW";
  const isCorrection = status === "CHANGES_REQUESTED";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0a4f42]" />
          Automated Baseline Audit Pre-Check
        </h3>
        {auditResult && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              auditResult.all_cleared
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {auditResult.all_cleared ? "Ready for Endorsement" : "Advisories Detected"}
          </span>
        )}
      </div>

      {isCorrection && coordinatorNotes && (
        <div className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-3.5 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-orange-900">Coordinator Requested Corrections:</p>
            <p className="text-xs text-orange-800 mt-0.5">{coordinatorNotes}</p>
          </div>
        </div>
      )}

      {auditResult && auditResult.flags.length > 0 && (
        <div className="mb-4 space-y-2">
          {auditResult.flags.map((flag) => (
            <div
              key={flag}
              className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900"
            >
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{flag.replace(/_/g, " ")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          {isApproved ? (
            <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Enrollment verified and tuition balance endorsed to Grantor.
            </p>
          ) : isPending ? (
            <p className="text-amber-700 font-medium">
              Your credentials have been submitted and are currently in the Coordinator's 60-second review queue.
            </p>
          ) : (
            <p>Review all extracted subjects and billing ledger above before submitting for coordinator audit.</p>
          )}
        </div>

        {!isApproved && !isPending && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0a4f42] hover:bg-[#083c32] rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting for Audit...</span>
              </>
            ) : (
              <>
                <span>Submit Enrollment Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

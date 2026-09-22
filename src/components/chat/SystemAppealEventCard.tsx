"use client";

import { CheckCircle2, Clock, GraduationCap, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MessageItem } from "@/lib/api/chat";
import { formatMessageTime } from "./chat-utils";

interface SystemAppealEventCardProps {
  message: MessageItem;
}

export function SystemAppealEventCard({ message }: SystemAppealEventCardProps) {
  const isSubmitted = message.message_type === "SYSTEM_APPEAL_SUBMITTED";
  const isApproved = message.message_type === "SYSTEM_APPEAL_APPROVED";
  const isDenied = message.message_type === "SYSTEM_APPEAL_DENIED";

  const meta = (message.metadata || {}) as {
    student_name?: string;
    student_number?: string;
    academic_year?: string;
    semester?: string;
    gpa?: number;
    evaluation_flag?: string;
    appeal_notes?: string;
    decision?: string;
    decision_notes?: string;
    reviewed_by_name?: string;
  };

  const termText =
    meta.academic_year && meta.semester ? `${meta.academic_year} • ${meta.semester}` : "Term Academic Appeal";
  const gwaText = meta.gpa != null ? Number(meta.gpa).toFixed(2) : undefined;
  const statement = meta.appeal_notes || meta.decision_notes || message.message_text;

  return (
    <div className="my-4 flex justify-center w-full px-2 sm:px-4">
      <div
        className={`w-full max-w-lg rounded-2xl border p-4 sm:p-5 shadow-xs transition-all ${
          isApproved
            ? "border-emerald-200/90 bg-emerald-50/50"
            : isDenied
              ? "border-rose-200/90 bg-rose-50/50"
              : "border-amber-200/90 bg-linear-to-br from-amber-50/60 via-white to-orange-50/30"
        }`}
      >
        {/* Header Badge & System Title */}
        <div className="flex items-center justify-between gap-2 border-b pb-3 border-current/10">
          <div className="flex items-center gap-2">
            <div
              className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${
                isApproved
                  ? "bg-emerald-100 text-emerald-800"
                  : isDenied
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
              }`}
            >
              {isApproved ? (
                <CheckCircle2 className="size-4" />
              ) : isDenied ? (
                <XCircle className="size-4" />
              ) : (
                <GraduationCap className="size-4" />
              )}
            </div>
            <span className="text-xs font-bold text-navy">
              {isApproved
                ? "Appeal Verdict: Approved"
                : isDenied
                  ? "Appeal Verdict: Denied"
                  : "Official Academic Appeal Filed"}
            </span>
          </div>

          <div>
            {isApproved ? (
              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px] font-bold py-0.5 px-2">
                Probation Clearance
              </Badge>
            ) : isDenied ? (
              <Badge className="bg-rose-100 text-rose-900 border-rose-300 text-[10px] font-bold py-0.5 px-2">
                Discontinued
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-bold py-0.5 px-2 gap-1">
                <Clock className="size-3" />
                Under Grantor Review
              </Badge>
            )}
          </div>
        </div>

        {/* Academic Details Pill Box */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-white/80 border border-black/5 p-2">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Term</span>
            <span className="font-bold text-navy text-[11px] truncate block">{termText}</span>
          </div>
          {gwaText && (
            <div className="rounded-lg bg-white/80 border border-black/5 p-2">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Term GWA</span>
              <span className="font-bold text-navy text-[11px] tabular-nums block">{gwaText}</span>
            </div>
          )}
          {meta.evaluation_flag && (
            <div className="col-span-2 sm:col-span-1 rounded-lg bg-white/80 border border-black/5 p-2">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Audit Flag</span>
              <span className="font-bold text-rose-700 text-[10px] truncate block">{meta.evaluation_flag}</span>
            </div>
          )}
          {meta.reviewed_by_name && (
            <div className="col-span-2 rounded-lg bg-white/80 border border-black/5 p-2 text-left">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Reviewed By</span>
              <span className="font-semibold text-navy text-[11px] block">{meta.reviewed_by_name}</span>
            </div>
          )}
        </div>

        {/* Statement / Remarks Box */}
        {statement && (
          <div className="mt-3 rounded-lg bg-white/90 border border-black/5 p-3 text-xs">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
              {isSubmitted ? "Scholar Statement" : "Grantor Remarks"}
            </span>
            <p className="text-stone-700 italic leading-relaxed whitespace-pre-wrap">"{statement}"</p>
          </div>
        )}

        {/* Footer Timestamp */}
        <div className="mt-2.5 text-right text-[10px] text-muted-foreground/80">
          <span>{formatMessageTime(message.sent_at)}</span>
        </div>
      </div>
    </div>
  );
}

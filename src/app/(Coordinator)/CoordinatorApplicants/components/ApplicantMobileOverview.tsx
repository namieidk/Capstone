"use client";

import { CalendarClock } from "lucide-react";
import type { Applicant } from "@/components/Coordinatorshared";
import { formatGwa, gwaSourceTitle } from "./applicant-helpers";

interface ApplicantMobileOverviewProps {
  applicant: Applicant;
}

export function ApplicantMobileOverview({ applicant }: ApplicantMobileOverviewProps) {
  return (
    <div className="p-3.5 space-y-3.5">
      {/* Academic & Institution Information */}
      <div className="rounded-xl border border-border/70 bg-white p-3.5 shadow-2xs">
        <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Academic & Institution Details
        </h3>
        <dl className="grid grid-cols-1 gap-2.5 text-xs">
          <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
            <dt className="text-[11px] text-muted-foreground">Scholarship Track</dt>
            <dd className="font-semibold text-foreground">{applicant.track || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
            <dt className="text-[11px] text-muted-foreground">Course of Study</dt>
            <dd className="font-semibold text-foreground">{applicant.course || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
            <dt className="text-[11px] text-muted-foreground">Current Year Level</dt>
            <dd className="font-semibold text-foreground">{applicant.year || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
            <dt className="text-[11px] text-muted-foreground">General Weighted Average (GWA)</dt>
            <dd className="font-semibold tabular-nums text-foreground" title={gwaSourceTitle(applicant.gwaSource)}>
              {applicant.gwa !== null ? formatGwa(applicant.gwa) : "—"}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
            <dt className="text-[11px] text-muted-foreground">School Name</dt>
            <dd className="font-semibold text-foreground">{applicant.schoolName || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] text-muted-foreground">School Address</dt>
            <dd className="font-semibold text-foreground wrap-break-word">{applicant.schoolAddress || "—"}</dd>
          </div>
        </dl>
      </div>

      {/* Personal, Contact & Affiliation Details */}
      <div className="rounded-xl border border-border/70 bg-white p-3.5 shadow-2xs">
        <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Personal & Contact Details
        </h3>
        <dl className="grid grid-cols-1 gap-2.5 text-xs">
          <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
            <dt className="text-[11px] text-muted-foreground">Student Number</dt>
            <dd className="font-semibold text-foreground">{applicant.studentNumber || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
            <dt className="text-[11px] text-muted-foreground">Phone Number</dt>
            <dd className="font-semibold text-foreground">{applicant.phoneNumber || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
            <dt className="text-[11px] text-muted-foreground">Home Address</dt>
            <dd className="font-semibold text-foreground wrap-break-word">{applicant.studentAddress || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] text-muted-foreground">Relative Employed By Partner</dt>
            <dd className="font-semibold text-foreground">{applicant.relativeEmployee || "None / N/A"}</dd>
          </div>
        </dl>
      </div>

      {/* Interview Stage Status Info */}
      {applicant.stage === "Interview" && (
        <div className="rounded-xl border border-navy/20 bg-navy/5 p-3 text-xs text-navy">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4 shrink-0 text-navy" />
            <span>
              {applicant.hasInterview && applicant.interviewAt ? (
                <>
                  Interview scheduled on{" "}
                  <strong>
                    {new Date(applicant.interviewAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </strong>
                </>
              ) : (
                <>
                  Applicant is in <strong>Interview Stage</strong> (no meeting scheduled yet)
                </>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

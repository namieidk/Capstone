"use client";

import { CalendarClock } from "lucide-react";
import type { Applicant } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { formatGwa, gwaSourceTitle } from "./applicant-helpers";

interface ApplicantDesktopDetailsProps {
  applicant: Applicant;
}

export function ApplicantDesktopDetails({ applicant }: ApplicantDesktopDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Academic & Institution Information */}
      <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Academic & Institution Details
        </h3>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Scholarship Track</dt>
            <dd className="font-medium text-foreground">{applicant.track || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Course of Study</dt>
            <dd className="font-medium text-foreground">{applicant.course || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Current Year Level</dt>
            <dd className="font-medium text-foreground">{applicant.year || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">General Weighted Average (GWA)</dt>
            <dd className="font-medium tabular-nums text-foreground" title={gwaSourceTitle(applicant.gwaSource)}>
              {applicant.gwa !== null ? formatGwa(applicant.gwa) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">School Name</dt>
            <dd className="font-medium text-foreground">{applicant.schoolName || "—"}</dd>
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <dt className="text-xs text-muted-foreground">School Address</dt>
            <dd className="font-medium text-foreground">{applicant.schoolAddress || "—"}</dd>
          </div>
        </dl>
      </div>

      {/* Personal, Contact & Affiliation Details */}
      <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Personal, Contact & Affiliation Details
        </h3>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Student Number</dt>
            <dd className="font-medium text-foreground">{applicant.studentNumber || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Phone Number</dt>
            <dd className="font-medium text-foreground">{applicant.phoneNumber || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Home Address</dt>
            <dd className="font-medium text-foreground">{applicant.studentAddress || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Relative Employed By Partner</dt>
            <dd className="font-medium text-foreground">{applicant.relativeEmployee || "None / N/A"}</dd>
          </div>
        </dl>
      </div>

      {/* Interview Stage Status Info */}
      {applicant.stage === "Interview" && (
        <div className="rounded-xl border border-navy/20 bg-navy/5 p-3.5 text-xs text-navy flex items-center justify-between gap-3">
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
          {applicant.hasInterview && (
            <Badge variant="outline" className="border-navy/30 bg-white text-navy text-[0.65rem]!">
              Scheduled
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

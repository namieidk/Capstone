"use client";

import { AlertTriangle, Check } from "lucide-react";
import type { ExtractedDataShape } from "./types";

interface ExtractedMetadataViewProps {
  extractedData: ExtractedDataShape;
  isReadOnly?: boolean;
  showConfirmedNotice?: boolean;
}

export function ExtractedMetadataView({ extractedData, showConfirmedNotice = false }: ExtractedMetadataViewProps) {
  const forensic = extractedData.forensic_analysis;
  const studentName = extractedData.student_name ? String(extractedData.student_name) : null;
  const schoolName = extractedData.school_name ? String(extractedData.school_name) : null;
  const courseName = extractedData.course_name ? String(extractedData.course_name) : null;

  const legend = extractedData.grading_legend;

  return (
    <div className="flex flex-col gap-3">
      {/* Advisory / Flags Banner */}
      {forensic?.summary && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber/40 bg-amber-bg/30 p-3 text-xs text-navy">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber" />
          <div>
            <p className="font-semibold">Document Advisory</p>
            <p className="mt-0.5 leading-relaxed text-muted-foreground">{forensic.summary}</p>
          </div>
        </div>
      )}

      {showConfirmedNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-good/30 bg-good-bg/40 p-3 text-xs text-navy">
          <Check className="size-4 shrink-0 text-good" />
          <p>This document has already been confirmed and is currently being processed by scholarship coordinators.</p>
        </div>
      )}

      {/* Read-only Extracted Identifiers */}
      <div className="grid grid-cols-1 gap-2.5 rounded-xl border border-border bg-white p-3.5 sm:grid-cols-3">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">Detected Student</p>
          <p className="mt-0.5 truncate text-xs font-medium text-navy">
            {studentName ?? <span className="italic text-muted-foreground">Not detected</span>}
          </p>
        </div>
        <div>
          <p className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">Detected School</p>
          <p className="mt-0.5 truncate text-xs font-medium text-navy">
            {schoolName ?? <span className="italic text-muted-foreground">Not detected</span>}
          </p>
        </div>
        <div>
          <p className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">Section / Course</p>
          <p className="mt-0.5 truncate text-xs font-medium text-navy">
            {courseName ?? <span className="italic text-muted-foreground">Not detected</span>}
          </p>
        </div>
      </div>

      {/* Detected Grading Legend if present */}
      {legend && (legend.legend_title || legend.grading_scale) && (
        <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-navy dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-900 dark:text-blue-300">Detected Grading Scale:</span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[0.7rem] font-semibold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                {legend.grading_scale === "NUMERIC_4_POINT"
                  ? "4.00 Point Direct Scale (UM)"
                  : legend.grading_scale === "NUMERIC_5_POINT"
                    ? "5.00 Point Inverse Scale (USEP/UP)"
                    : legend.grading_scale === "PERCENTAGE_100"
                      ? "100% Percentage Scale"
                      : (legend.grading_scale ?? "Standard")}
              </span>
            </div>
            {legend.legend_title && (
              <p className="mt-1 text-[0.7rem] text-muted-foreground">
                Policy: <span className="italic">{legend.legend_title}</span>
              </p>
            )}
            <div className="mt-1.5 flex flex-wrap gap-3 text-[0.7rem] text-muted-foreground">
              {legend.highest_grade != null && (
                <span>
                  Highest: <strong className="text-navy dark:text-white">{legend.highest_grade}</strong>
                </span>
              )}
              {legend.passing_grade != null && (
                <span>
                  Passing: <strong className="text-navy dark:text-white">{legend.passing_grade}</strong>
                </span>
              )}
              {legend.failing_grade != null && (
                <span>
                  Failing: <strong className="text-navy dark:text-white">{legend.failing_grade}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

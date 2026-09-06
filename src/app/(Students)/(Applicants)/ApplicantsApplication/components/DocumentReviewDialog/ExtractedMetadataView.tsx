"use client";

import { AlertTriangle, Check } from "lucide-react";
import type { ExtractedDataShape } from "./types";

interface ExtractedMetadataViewProps {
  extractedData: ExtractedDataShape;
  isReadOnly: boolean;
}

export function ExtractedMetadataView({ extractedData, isReadOnly }: ExtractedMetadataViewProps) {
  const forensic = extractedData.forensic_analysis;
  const studentName = extractedData.student_name ? String(extractedData.student_name) : null;
  const schoolName = extractedData.school_name ? String(extractedData.school_name) : null;
  const courseName = extractedData.course_name ? String(extractedData.course_name) : null;

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

      {isReadOnly && (
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
    </div>
  );
}

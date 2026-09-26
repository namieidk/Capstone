"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FileText,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GradeItem, ScholarDocument } from "@/lib/api/documents";

interface CcgGradeReviewTableProps {
  doc: ScholarDocument;
  academicYear: string;
  setAcademicYear: (ay: string) => void;
  semester: string;
  setSemester: (sem: string) => void;
  gradeItems: GradeItem[];
  setGradeItems?: React.Dispatch<React.SetStateAction<GradeItem[]>>;
  previewGwa: string;
  discarding: boolean;
  confirming: boolean;
  onDiscard: () => void;
  onConfirm: () => void;
  onAddSubject?: () => void;
}

export function CcgGradeReviewTable({
  doc,
  academicYear,
  semester,
  gradeItems,
  previewGwa,
  discarding,
  confirming,
  onDiscard,
  onConfirm,
}: CcgGradeReviewTableProps) {
  return (
    <div className="space-y-4">
      {doc.status === "NEEDS_REUPLOAD" && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Correction Notice: </span>
            <span>{doc.rejection_reason || "Please check your document legibility or re-upload a clearer copy."}</span>
          </div>
        </div>
      )}

      {/* Header Info Banner with Preview Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-teal-50/70 border border-teal-200 p-3.5">
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy truncate max-w-xs">{doc.file_name || "CCG Document"}</span>
            <Badge variant="outline" className="text-[10px] font-bold bg-white text-teal-800 border-teal-300">
              {gradeItems.length} Courses Detected
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Scanned registrar grade slip. The coordinator will audit and verify your grades for scholarship renewal.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {doc.file_url && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="h-7 px-2.5 text-xs font-semibold text-[#0a4f42] border-teal-300 bg-white hover:bg-teal-50"
            >
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                <ExternalLink className="size-3" />
                <span>Open File</span>
              </a>
            </Button>
          )}
          <Badge className="bg-[#0a4f42] text-white text-xs font-bold px-3 py-1 shadow-xs">
            Detected GWA: {previewGwa}
          </Badge>
        </div>
      </div>

      {/* Detected Academic Term */}
      <div className="p-4 rounded-xl border border-line bg-[#fdfcfb] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-navy">
          <Calendar className="size-4 text-[#0a4f42]" />
          <span>Academic Term:</span>
          <Badge variant="secondary" className="text-xs font-semibold text-navy bg-white border border-slate-200">
            {academicYear} • {semester}
          </Badge>
        </div>
        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
          <FileCheck2 className="size-3.5 text-emerald-600" />
          <span>Ready for Coordinator Verification</span>
        </div>
      </div>

      {/* Read-Only Extracted Courses Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-navy flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-[#0a4f42]" />
            Scanned Course Grades ({gradeItems.length})
          </span>
          <span className="text-[11px] text-muted-foreground">Read-only AI extraction preview</span>
        </div>

        <div className="border border-line rounded-xl overflow-hidden text-xs bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fdfcfb] border-b border-line text-[#8a8a84] font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2.5 w-32">Subject Code</th>
                <th className="p-2.5">Descriptive Title</th>
                <th className="p-2.5 w-20 text-center">Units</th>
                <th className="p-2.5 w-24 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {gradeItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-xs text-muted-foreground">
                    Document uploaded. The coordinator will audit your grades directly from the submitted document.
                  </td>
                </tr>
              ) : (
                gradeItems.map((item, idx) => (
                  <tr
                    key={item.subject_code ? `ccg-${item.subject_code}-${idx}` : `ccg-idx-${idx}`}
                    className="hover:bg-[#faf8f5]"
                  >
                    <td className="p-2.5 font-mono font-bold text-navy">{item.subject_code || "—"}</td>
                    <td className="p-2.5 text-slate-700 font-medium">{item.subject_name || "—"}</td>
                    <td className="p-2.5 text-center font-semibold text-slate-900">
                      {Number(item.units || 1).toFixed(1)}
                    </td>
                    <td className="p-2.5 text-center font-bold text-emerald-800">
                      {item.grade ? Number(item.grade).toFixed(2) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation & Legibility Checklist */}
      <div className="rounded-xl border border-line bg-white p-4 space-y-2.5 text-xs text-slate-700 shadow-2xs">
        <p className="font-semibold text-navy text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="size-3.5 text-[#0a4f42]" />
          Submission Confirmation
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          By confirming, you submit your official grade slip for review. The Scholarship Coordinator will verify your
          grades and GPA against your scholarship agreement guidelines.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line">
        <Button
          type="button"
          variant="outline"
          disabled={discarding || confirming}
          onClick={onDiscard}
          className="h-9 rounded-xl border-line text-xs font-semibold text-rose-700 hover:bg-rose-50"
        >
          {discarding ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <RotateCcw className="size-3.5 mr-1" />}
          Discard Draft & Upload New File
        </Button>

        <Button
          type="button"
          disabled={confirming || doc.status === "NEEDS_REUPLOAD" || gradeItems.length === 0}
          onClick={onConfirm}
          className="h-9 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs font-bold px-5 gap-1.5 shadow-xs"
        >
          {confirming ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
          <span>Confirm & Submit Grade Slip for Audit</span>
        </Button>
      </div>
    </div>
  );
}

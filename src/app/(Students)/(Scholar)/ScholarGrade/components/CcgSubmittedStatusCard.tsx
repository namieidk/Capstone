"use client";

import { Calendar, Clock, FileCheck, Loader2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GradeItem, ScholarDocument } from "@/lib/api/documents";

interface CcgSubmittedStatusCardProps {
  doc: ScholarDocument;
  academicYear: string;
  semester: string;
  gradeItems: GradeItem[];
  previewGwa: string;
  discarding: boolean;
  onDiscard: () => void;
}

export function CcgSubmittedStatusCard({
  doc,
  academicYear,
  semester,
  gradeItems,
  previewGwa,
  discarding,
  onDiscard,
}: CcgSubmittedStatusCardProps) {
  const totalUnits = gradeItems.reduce((acc, item) => acc + (Number(item.units) || 0), 0);

  return (
    <div className="space-y-4">
      {/* Status Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-start gap-2.5">
          <Clock className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-navy">Document Submitted — Awaiting Coordinator Audit</p>
            <p className="text-[11px] text-muted-foreground">
              Your Certified Copy of Grades (CCG) has been submitted. Your scholarship coordinator is currently auditing
              your grades and updating your prospectus credits.
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-white text-amber-800 border-amber-300 font-bold shrink-0 self-start sm:self-auto"
        >
          Under Coordinator Audit
        </Badge>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-line bg-[#fdfcfb]">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-0.5">
            Academic Term
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-navy">
            <Calendar className="size-3.5 text-[#0a4f42]" />
            <span>
              {academicYear} • {semester}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-line bg-[#fdfcfb]">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-0.5">
            Computed GWA
          </span>
          <span className="text-xs font-bold text-emerald-800">{previewGwa}</span>
        </div>

        <div className="p-3.5 rounded-xl border border-line bg-[#fdfcfb]">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-0.5">
            Total Academic Units
          </span>
          <span className="text-xs font-bold text-navy">{totalUnits.toFixed(1)} Units</span>
        </div>
      </div>

      {/* Confirmed Grades Table (Read-Only) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-navy flex items-center gap-1.5">
            <FileCheck className="size-3.5 text-[#0a4f42]" />
            Submitted Course Records ({gradeItems.length})
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">{doc.file_name || "CCG Document"}</span>
        </div>

        <div className="border border-line rounded-xl overflow-hidden text-xs bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fdfcfb] border-b border-line text-[#8a8a84] font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2.5 w-32">Subject Code</th>
                <th className="p-2.5">Descriptive Title</th>
                <th className="p-2.5 w-24 text-center">Units</th>
                <th className="p-2.5 w-28 text-center">Final Grade</th>
                <th className="p-2.5 w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {gradeItems.map((item, idx) => (
                <tr
                  key={item.subject_code ? `ccg-sub-${item.subject_code}-${idx}` : `ccg-sub-${idx}`}
                  className="hover:bg-[#faf8f5]"
                >
                  <td className="p-2.5 font-bold text-navy uppercase">{item.subject_code || "N/A"}</td>
                  <td className="p-2.5 text-slate-700">{item.subject_name || "N/A"}</td>
                  <td className="p-2.5 text-center font-semibold text-slate-700">
                    {Number(item.units || 0).toFixed(1)}
                  </td>
                  <td className="p-2.5 text-center font-bold text-emerald-800">{Number(item.grade || 0).toFixed(2)}</td>
                  <td className="p-2.5 text-center">
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                      Confirmed
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discard / Re-upload Option */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line">
        <p className="text-[11px] text-muted-foreground">
          Need to correct or re-submit a different copy? You can withdraw this submission before it is audited.
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={discarding}
          onClick={onDiscard}
          className="h-8 rounded-xl border-line text-xs font-semibold text-rose-700 hover:bg-rose-50 self-start sm:self-auto shrink-0"
        >
          {discarding ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <RotateCcw className="size-3.5 mr-1" />}
          Withdraw & Upload New File
        </Button>
      </div>
    </div>
  );
}

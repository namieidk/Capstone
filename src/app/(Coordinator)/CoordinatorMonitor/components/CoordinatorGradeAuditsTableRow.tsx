"use client";

import { AlertTriangle, CheckCircle2, Clock, Eye, GraduationCap, User } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ScholarDocument } from "@/lib/api/documents";

interface CoordinatorGradeAuditsTableRowProps {
  item: ScholarDocument;
  onSelectAudit: (documentId: number) => void;
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "VERIFIED":
      return (
        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs gap-1 font-semibold py-0.5">
          <CheckCircle2 className="size-3 text-emerald-600" />
          Verified & Credited
        </Badge>
      );
    case "NEEDS_REUPLOAD":
      return (
        <Badge className="bg-orange-50 text-orange-900 border-orange-300 text-xs gap-1 font-semibold py-0.5">
          <AlertTriangle className="size-3 text-orange-600" />
          Correction Requested
        </Badge>
      );
    case "STUDENT_CONFIRMED":
      return (
        <Badge className="bg-blue-50 text-blue-900 border-blue-300 text-xs gap-1 font-semibold py-0.5">
          <Clock className="size-3 text-blue-600" />
          Ready for Audit
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-xs gap-1 font-semibold py-0.5">
          <Clock className="size-3 text-amber-600" />
          Pending Review
        </Badge>
      );
  }
}

export function CoordinatorGradeAuditsTableRow({ item, onSelectAudit }: CoordinatorGradeAuditsTableRowProps) {
  const scholar = item.scholar_profile;
  const scholarName = scholar
    ? `${scholar.first_name || ""} ${scholar.last_name || ""}`.trim()
    : `Scholar #${item.scholar_profile_id}`;
  const confirmed = (item.confirmed_data || item.extracted_data || {}) as Record<string, unknown>;
  const ay = String(confirmed.academic_year || "Current AY");
  const sem = String(confirmed.semester || "Semester");

  return (
    <TableRow
      onClick={() => onSelectAudit(item.document_id)}
      className="cursor-pointer transition-colors hover:bg-[#faf8f5]"
    >
      <TableCell className="whitespace-normal! py-4 pl-6 text-left">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
            <User className="size-4 text-[#0a4f42]" />
          </div>
          <div>
            <p className="text-xs font-bold text-navy">{scholarName}</p>
            <p className="text-[11px] text-muted-foreground">
              {scholar?.student_number ? `${scholar.student_number} • ` : ""}
              {scholar?.course_of_study || scholar?.school_name || "Active Scholar"}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="whitespace-normal! py-4 text-center!">
        <div className="flex items-center justify-center gap-1.5">
          <GraduationCap className="size-3.5 text-[#0a4f42]" />
          <span className="text-xs font-bold text-navy">{item.document_type || "CCG"}</span>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground truncate max-w-35 mx-auto">
          {item.file_name || `Doc #${item.document_id}`}
        </p>
      </TableCell>

      <TableCell className="py-4 text-center!">
        <p className="text-xs font-semibold text-navy">
          {ay} • {sem}
        </p>
        {typeof confirmed.general_average === "number" && (
          <p className="mt-0.5 text-[10px] text-emerald-800 font-bold">
            GWA: {Number(confirmed.general_average).toFixed(2)}
          </p>
        )}
      </TableCell>

      <TableCell className="py-4 text-center!">
        <span className="text-xs text-slate-700">{new Date(item.uploaded_at).toLocaleDateString()}</span>
      </TableCell>

      <TableCell className="py-4 text-center!">
        <div className="flex flex-col items-center gap-1">{getStatusBadge(item.status)}</div>
      </TableCell>

      <TableCell className="py-4 pr-6 text-center!">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold rounded-xl border-line bg-white hover:bg-tint gap-1 text-navy"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onSelectAudit(item.document_id);
          }}
          aria-label={`Audit document #${item.document_id}`}
        >
          <Eye className="size-3.5 text-[#0a4f42]" />
          <span>Audit</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}

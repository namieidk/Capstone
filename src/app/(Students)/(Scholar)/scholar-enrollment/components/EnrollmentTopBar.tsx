"use client";

import { AlertCircle, CheckCircle2, Clock, FileCheck, RefreshCw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnrollmentTopBarProps {
  studentName: string;
  schoolName: string;
  courseName: string;
  academicYear: string;
  semester: string;
  yearLevel: number;
  status: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export function EnrollmentTopBar({
  studentName,
  schoolName,
  courseName,
  academicYear,
  semester,
  yearLevel,
  status,
  isRefreshing,
  onRefresh,
}: EnrollmentTopBarProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1 px-3 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved & Endorsed to Grantor
          </Badge>
        );
      case "PENDING_REVIEW":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 py-1 px-3 font-medium animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under Coordinator Audit
          </Badge>
        );
      case "CHANGES_REQUESTED":
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 gap-1.5 py-1 px-3 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
            Correction Requested
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 gap-1.5 py-1 px-3 font-medium">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Enrollment Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 gap-1.5 py-1 px-3 font-medium">
            <FileCheck className="w-3.5 h-3.5 text-slate-500" />
            Ready for Submission
          </Badge>
        );
    }
  };

  const getYearLabel = (lvl: number) => {
    if (lvl === 1) return "1st Year";
    if (lvl === 2) return "2nd Year";
    if (lvl === 3) return "3rd Year";
    return `${lvl}th Year`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-[#0a4f42]">
          <FileCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Start-of-Term Enrollment & SOA Audit</h1>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2 flex-wrap">
            <span className="text-slate-700 font-semibold">{studentName}</span>
            <span>•</span>
            <span>{schoolName}</span>
            <span>•</span>
            <span>{courseName}</span>
            <span>•</span>
            <span className="text-[#0a4f42] font-semibold bg-teal-50/70 px-2 py-0.5 rounded-md border border-teal-100/60">
              {academicYear} • {semester} ({getYearLabel(yearLevel)})
            </span>
          </p>
        </div>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors disabled:opacity-50 self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0a4f42]" : ""}`} />
          <span>Refresh</span>
        </button>
      )}
    </div>
  );
}

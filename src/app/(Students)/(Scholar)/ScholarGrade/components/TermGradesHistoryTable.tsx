"use client";

import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { GradeReport } from "@/lib/api/documents";

interface TermGradesHistoryTableProps {
  reports: GradeReport[];
  loading?: boolean;
}

export function TermGradesHistoryTable({ reports, loading }: TermGradesHistoryTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (report: GradeReport) => {
    if (report.appeal_status === "APPROVED") {
      return (
        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs font-semibold">
          Probation Granted
        </Badge>
      );
    }
    if (report.appeal_status === "DENIED") {
      return <Badge className="bg-rose-50 text-rose-800 border-rose-300 text-xs font-semibold">Disqualified</Badge>;
    }
    if (report.appeal_status === "PENDING_GRANTOR") {
      return (
        <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-xs font-semibold">
          Appeal Pending Grantor Review
        </Badge>
      );
    }
    if (report.is_eligible && report.status === "APPROVED") {
      return (
        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs font-semibold gap-1">
          <CheckCircle2 className="size-3 text-emerald-600" />
          Good Standing
        </Badge>
      );
    }
    return (
      <Badge className="bg-rose-50 text-rose-800 border-rose-300 text-xs font-semibold gap-1">
        <AlertTriangle className="size-3 text-rose-600" />
        {report.evaluation_flag || "Under Review"}
      </Badge>
    );
  };

  return (
    <Card className="rounded-[18px]! border-line bg-white shadow-va-sm">
      <CardContent className="p-5 md:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-navy flex items-center gap-2">
            <GraduationCap className="size-4 text-[#0a4f42]" />
            Semestral Academic Credited Records
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            History of evaluated grades and general weighted averages across enrolled academic semesters.
          </p>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-muted-foreground">Loading semestral grade records...</div>
        ) : reports.length === 0 ? (
          <div className="border border-dashed border-line rounded-2xl p-8 text-center bg-[#faf8f5]">
            <p className="text-xs text-muted-foreground">No end-of-term grade reports verified yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => {
              const isExpanded = expandedId === report.report_id;
              const totalUnits = (report.grade_items || []).reduce((sum, item) => sum + (Number(item.units) || 0), 0);

              return (
                <div
                  key={report.report_id}
                  className="rounded-xl border border-line bg-[#fdfcfb] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(report.report_id)}
                    className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf8f5] transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy">
                          AY {report.academic_year} • {report.semester}
                        </span>
                        {getStatusBadge(report)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {report.grade_items?.length || 0} Courses • {totalUnits.toFixed(1)} Total Units
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-start sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-[#8a8a84] block">Term GWA</span>
                        <span className="text-base font-black text-[#0a4f42] tabular-nums">
                          {Number(report.gpa).toFixed(2)}
                        </span>
                      </div>

                      {report.document?.file_url && (
                        <a
                          href={report.document.file_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-[#7a7a74] hover:text-navy hover:bg-white rounded-lg border border-line transition-colors"
                          title="View Uploaded CCG"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}

                      <span className="p-1 text-[#7a7a74] hover:text-navy transition-colors">
                        {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-line p-4 bg-white space-y-3">
                      <h4 className="text-xs font-bold text-navy">Course Breakdown & Final Marks:</h4>
                      <div className="border border-line rounded-lg overflow-hidden text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-[#fdfcfb] border-b border-line text-[#8a8a84] font-bold text-[10px] uppercase">
                            <tr>
                              <th className="p-2.5">Code</th>
                              <th className="p-2.5">Descriptive Title</th>
                              <th className="p-2.5 text-center">Units</th>
                              <th className="p-2.5 text-center">Grade</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line">
                            {(report.grade_items || []).map((sub, i) => (
                              <tr key={`item-${sub.item_id || i}`} className="hover:bg-[#faf8f5]/60">
                                <td className="p-2.5 font-bold text-navy">{sub.subject_code}</td>
                                <td className="p-2.5 text-slate-700">{sub.subject_name}</td>
                                <td className="p-2.5 text-center font-semibold">{sub.units}</td>
                                <td className="p-2.5 text-center font-bold text-navy">
                                  {Number(sub.grade).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {report.appeal_notes && (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs space-y-1">
                          <span className="font-bold text-amber-900">Scholar Appeal Statement:</span>
                          <p className="text-amber-800">{report.appeal_notes}</p>
                          {report.appeal_decision_notes && (
                            <p className="text-emerald-800 font-semibold pt-1 border-t border-amber-200">
                              Grantor Remarks: {report.appeal_decision_notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

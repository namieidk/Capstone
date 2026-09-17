"use client";

import { AlertTriangle, BookOpen, CheckCircle2, HelpCircle, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EnrolledSubjectItem } from "@/lib/api/enrollment";

interface EnrolledSubjectsReviewProps {
  subjects: EnrolledSubjectItem[];
  onChangeSubjects?: (subjects: EnrolledSubjectItem[]) => void;
  isReadOnly?: boolean;
}

export function EnrolledSubjectsReview({ subjects, onChangeSubjects, isReadOnly }: EnrolledSubjectsReviewProps) {
  const totalUnits = subjects.reduce((sum, s) => sum + (Number(s.units) || 0), 0);

  const handleUpdate = (index: number, field: keyof EnrolledSubjectItem, value: unknown) => {
    if (!onChangeSubjects || isReadOnly) return;
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    onChangeSubjects(updated);
  };

  const handleRemove = (index: number) => {
    if (!onChangeSubjects || isReadOnly) return;
    onChangeSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleAddSubject = () => {
    if (!onChangeSubjects || isReadOnly) return;
    onChangeSubjects([
      ...subjects,
      {
        subject_code: "",
        descriptive_title: "",
        units: 3.0,
        section: "",
        schedule: "",
        room: "",
        status: "ON_TRACK",
      },
    ]);
  };

  const renderStatusBadge = (sub: EnrolledSubjectItem) => {
    if (sub.status === "MISSING_PREREQUISITE") {
      return (
        <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[11px] font-medium gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Prereq Unmet
        </Badge>
      );
    }
    if (sub.status === "OFF_TRACK") {
      return (
        <Badge className="bg-rose-50 text-rose-800 border-rose-200 text-[11px] font-medium gap-1">
          <HelpCircle className="w-3 h-3 text-rose-600" />
          Off-Track Elective
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[11px] font-medium gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Curriculum Matched
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0a4f42]" />
            Enrolled Subjects Review ({subjects.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified course schedule and credit units against frozen curriculum
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            Total Units: <span className="text-[#0a4f42]">{totalUnits.toFixed(1)}</span>
          </div>
          {!isReadOnly && onChangeSubjects && (
            <button
              type="button"
              onClick={handleAddSubject}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#0a4f42] bg-teal-50 hover:bg-teal-100/70 border border-teal-200 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Course
            </button>
          )}
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50">
          <p className="text-xs font-medium text-slate-500">
            No subjects extracted yet. Upload your Certificate of Registration (COR) or Matriculation above.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Subject Code</th>
                <th className="py-2.5 px-3">Descriptive Title</th>
                <th className="py-2.5 px-3">Sec / Sched / Room</th>
                <th className="py-2.5 px-3 text-center">Units</th>
                <th className="py-2.5 px-3">Audit Check</th>
                {!isReadOnly && <th className="py-2.5 px-3 text-center w-10">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub, idx) => {
                const rowKey = sub.curriculum_subject_id
                  ? `curric-${sub.curriculum_subject_id}`
                  : sub.subject_code
                    ? `code-${sub.subject_code}-${sub.section || ""}`
                    : `row-item-${idx}`;

                return (
                  <tr key={rowKey} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {isReadOnly ? (
                        sub.subject_code
                      ) : (
                        <input
                          type="text"
                          value={sub.subject_code}
                          onChange={(e) => handleUpdate(idx, "subject_code", e.target.value.toUpperCase())}
                          className="w-24 px-2 py-1 border border-slate-200 rounded-md font-bold focus:outline-none focus:border-[#0a4f42]"
                        />
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium min-w-50">
                      {isReadOnly ? (
                        sub.descriptive_title
                      ) : (
                        <input
                          type="text"
                          value={sub.descriptive_title}
                          onChange={(e) => handleUpdate(idx, "descriptive_title", e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md focus:outline-none focus:border-[#0a4f42]"
                        />
                      )}
                      {sub.remarks && <p className="text-[10px] text-amber-700 mt-0.5">{sub.remarks}</p>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                      {[sub.section, sub.schedule, sub.room].filter(Boolean).join(" • ") || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800 whitespace-nowrap">
                      {isReadOnly ? (
                        Number(sub.units).toFixed(1)
                      ) : (
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="12"
                          value={sub.units}
                          onChange={(e) => handleUpdate(idx, "units", Number(e.target.value))}
                          className="w-16 px-1 py-1 border border-slate-200 rounded-md text-center font-bold focus:outline-none focus:border-[#0a4f42]"
                        />
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{renderStatusBadge(sub)}</td>
                    {!isReadOnly && (
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemove(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                          title="Delete course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

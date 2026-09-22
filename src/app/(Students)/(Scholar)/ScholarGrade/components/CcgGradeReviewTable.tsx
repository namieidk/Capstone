"use client";

import { AlertTriangle, Calendar, CheckCircle2, Loader2, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GradeItem, ScholarDocument } from "@/lib/api/documents";

interface CcgGradeReviewTableProps {
  doc: ScholarDocument;
  academicYear: string;
  setAcademicYear: (ay: string) => void;
  semester: string;
  setSemester: (sem: string) => void;
  gradeItems: GradeItem[];
  setGradeItems: React.Dispatch<React.SetStateAction<GradeItem[]>>;
  previewGwa: string;
  discarding: boolean;
  confirming: boolean;
  onDiscard: () => void;
  onConfirm: () => void;
  onAddSubject: () => void;
}

export function CcgGradeReviewTable({
  doc,
  academicYear,
  setAcademicYear,
  semester,
  setSemester,
  gradeItems,
  setGradeItems,
  previewGwa,
  discarding,
  confirming,
  onDiscard,
  onConfirm,
  onAddSubject,
}: CcgGradeReviewTableProps) {
  return (
    <div className="space-y-4">
      {doc.status === "NEEDS_REUPLOAD" && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Correction Notice: </span>
            <span>{doc.rejection_reason || "Please verify your extracted grades or re-upload a clearer copy."}</span>
          </div>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-teal-50/70 border border-teal-200 p-3.5">
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy">{doc.file_name || "CCG Document"}</span>
            <Badge variant="outline" className="text-[10px] font-bold bg-white text-teal-800 border-teal-300">
              {gradeItems.length} Subjects Detected
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Extracted from registrar grade report. Verify academic period and grades before final submission.
          </p>
        </div>
        <Badge className="bg-[#0a4f42] text-white text-xs font-bold px-3 py-1 self-start sm:self-auto shadow-xs">
          Computed GWA: {previewGwa}
        </Badge>
      </div>

      {/* Academic Term & Semester Verification Block */}
      <div className="p-4 rounded-xl border border-line bg-[#fdfcfb] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-navy">
          <Calendar className="size-3.5 text-[#0a4f42]" />
          <span>Academic Term for Grade Crediting</span>
          <Badge variant="outline" className="text-[10px] bg-white border-line text-slate-600 font-medium">
            Review / Edit
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="review-academic-year" className="text-[11px] font-semibold text-slate-700 block mb-1">
              Academic Year (e.g. 2025-2026)
            </label>
            <Input
              id="review-academic-year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2025-2026"
              className="h-9 w-full rounded-xl bg-white text-xs font-semibold text-navy border-input shadow-xs px-3"
            />
          </div>
          <div>
            <label htmlFor="review-semester" className="text-[11px] font-semibold text-slate-700 block mb-1">
              Semester / Term
            </label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger
                id="review-semester"
                className="h-9! min-h-9! py-1.5! w-full rounded-xl bg-white text-xs font-semibold text-navy border-input shadow-xs px-3"
              >
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-line">
                <SelectItem value="1st Semester" className="text-xs font-medium">
                  1st Semester
                </SelectItem>
                <SelectItem value="2nd Semester" className="text-xs font-medium">
                  2nd Semester
                </SelectItem>
                <SelectItem value="Summer" className="text-xs font-medium">
                  Summer
                </SelectItem>
                <SelectItem value="Annual" className="text-xs font-medium">
                  Annual
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Extracted Courses Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-navy flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-[#0a4f42]" />
            Extracted Course Grades ({gradeItems.length})
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddSubject}
            className="h-7 text-xs font-semibold gap-1 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
          >
            <Plus className="size-3" />
            Add Course
          </Button>
        </div>

        <div className="border border-line rounded-xl overflow-hidden text-xs bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fdfcfb] border-b border-line text-[#8a8a84] font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2.5 w-32">Subject Code</th>
                <th className="p-2.5">Descriptive Title</th>
                <th className="p-2.5 w-20 text-center">Units</th>
                <th className="p-2.5 w-24 text-center">Final Grade</th>
                <th className="p-2.5 w-10 text-center" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {gradeItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-xs text-muted-foreground">
                    No courses extracted. Click "Add Course" to manually enter your grades.
                  </td>
                </tr>
              ) : (
                gradeItems.map((item, idx) => (
                  <tr
                    key={item.subject_code ? `ccg-${item.subject_code}-${idx}` : `ccg-idx-${idx}`}
                    className="hover:bg-[#faf8f5]"
                  >
                    <td className="p-2">
                      <Input
                        value={item.subject_code || ""}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setGradeItems((prev) => prev.map((g, i) => (i === idx ? { ...g, subject_code: val } : g)));
                        }}
                        placeholder="e.g. CS 101"
                        className="h-7 text-xs font-bold uppercase"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={item.subject_name || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGradeItems((prev) => prev.map((g, i) => (i === idx ? { ...g, subject_name: val } : g)));
                        }}
                        placeholder="Descriptive Title"
                        className="h-7 text-xs"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Input
                        type="number"
                        step="0.5"
                        value={item.units}
                        onChange={(e) => {
                          const val = Number.parseFloat(e.target.value) || 0;
                          setGradeItems((prev) => prev.map((g, i) => (i === idx ? { ...g, units: val } : g)));
                        }}
                        className="h-7 w-16 text-center font-bold mx-auto text-xs"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.grade || ""}
                        onChange={(e) => {
                          const val = Number.parseFloat(e.target.value) || 0;
                          setGradeItems((prev) => prev.map((g, i) => (i === idx ? { ...g, grade: val } : g)));
                        }}
                        className="h-7 w-20 text-center font-bold mx-auto text-xs text-emerald-800"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => setGradeItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        aria-label="Remove course"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
          disabled={confirming || gradeItems.length === 0}
          onClick={onConfirm}
          className="h-9 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs font-bold px-5 gap-1.5 shadow-xs"
        >
          {confirming ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
          <span>Confirm & Submit for Coordinator Audit</span>
        </Button>
      </div>
    </div>
  );
}

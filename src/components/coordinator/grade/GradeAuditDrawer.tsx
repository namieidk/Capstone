"use client";

import { CheckCircle2, ExternalLink, GraduationCap, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type GradeItem,
  getDocument,
  requestDocumentChanges,
  type ScholarDocument,
  verifyDocument,
} from "@/lib/api/documents";
import { getSettings } from "@/lib/api/settings";
import { GradeAuditSkeleton } from "./GradeAuditSkeleton";
import { GradeAuditSubjectsTable } from "./GradeAuditSubjectsTable";
import { GradeGradingSystemLegend } from "./GradeGradingSystemLegend";
import { GradeRequestChangesDialog } from "./GradeRequestChangesDialog";

interface GradeAuditDrawerProps {
  documentId: number | null;
  open: boolean;
  onClose: () => void;
  onReviewed: () => void;
}

export function GradeAuditDrawer({ documentId, open, onClose, onReviewed }: GradeAuditDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState<ScholarDocument | null>(null);
  const [gradeThreshold, setGradeThreshold] = useState<number>(90);
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([]);
  const [academicYear, setAcademicYear] = useState<string>("2025-2026");
  const [semester, setSemester] = useState<string>("2nd Semester");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  const [coordinatorNotes, setCoordinatorNotes] = useState("");

  useEffect(() => {
    if (!documentId || !open) return;
    async function loadData() {
      try {
        setLoading(true);
        const [data, settings] = await Promise.all([
          getDocument(documentId as number),
          getSettings().catch(() => ({ grade_threshold: 90 })),
        ]);
        setDoc(data);
        if (settings?.grade_threshold) {
          setGradeThreshold(Number(settings.grade_threshold));
        }

        const extracted = (data.confirmed_data || data.extracted_data || {}) as Record<string, unknown>;
        if (typeof extracted.academic_year === "string") setAcademicYear(extracted.academic_year);
        if (typeof extracted.semester === "string") setSemester(extracted.semester);

        const items = Array.isArray(extracted.grade_items)
          ? (extracted.grade_items as GradeItem[])
          : Array.isArray(extracted.subjects)
            ? (extracted.subjects as GradeItem[])
            : [];

        setGradeItems(
          items.map((item) => ({
            subject_code: item.subject_code || "",
            subject_name: item.subject_name || "",
            units: Number(item.units) || 3,
            grade: Number(item.grade) || 0,
          })),
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load document details.");
        onClose();
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [documentId, open, onClose]);

  const { totalUnits, computedGwa } = useMemo(() => {
    let unitsSum = 0;
    let weightedSum = 0;
    for (const item of gradeItems) {
      const u = Number(item.units) || 0;
      const g = Number(item.grade) || 0;
      if (u > 0 && g > 0) {
        unitsSum += u;
        weightedSum += u * g;
      }
    }
    const gwa = unitsSum > 0 ? weightedSum / unitsSum : 0;
    return { totalUnits: unitsSum, computedGwa: gwa };
  }, [gradeItems]);

  if (!open || !documentId) return null;

  const handleVerify = async () => {
    if (gradeItems.length === 0) {
      toast.error("Please ensure at least one subject grade is present before verifying.");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await verifyDocument(documentId, {
        academic_year: academicYear,
        semester: semester,
        general_average: computedGwa,
        grade_items: gradeItems,
        notes: coordinatorNotes || undefined,
      });
      toast.success(
        res.isEligible
          ? "Grades verified successfully! Scholar is cleared for the next term."
          : "Grades recorded. Scholar flagged as Under Review / Academic Appeal required.",
      );
      onReviewed();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to verify grades.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    try {
      setIsSubmitting(true);
      await requestDocumentChanges(documentId, coordinatorNotes);
      toast.success("Correction request sent to scholar.");
      setRequestChangesOpen(false);
      setCoordinatorNotes("");
      onReviewed();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to request changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileUrl = doc?.file_url;
  const scholar = doc?.scholar_profile;
  const scholarName = scholar ? `${scholar.first_name || ""} ${scholar.last_name || ""}`.trim() : "Scholar";
  const schoolGrading = scholar?.school_grading_system;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-6xl bg-slate-50 h-full flex flex-col shadow-2xl overflow-hidden border-l border-slate-200">
        {/* Drawer Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <GraduationCap className="size-5 text-[#0a4f42]" />
              <h2 className="text-lg font-bold text-slate-900">Certified Copy of Grades (CCG) Audit</h2>
              {scholar && (
                <Badge
                  variant="outline"
                  className="bg-[#0a4f42]/10 text-[#0a4f42] border-[#0a4f42]/30 text-xs font-bold"
                >
                  {scholarName} {scholar.student_number ? `(${scholar.student_number})` : ""}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {scholar?.course_of_study ? `${scholar.course_of_study} • ` : ""}
              AY {academicYear} • {semester} • {doc?.document_type || "CCG"} • Uploaded{" "}
              {doc?.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {loading || !doc ? (
          <GradeAuditSkeleton />
        ) : (
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Document Preview */}
            <div className="lg:col-span-6 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700 shrink-0">
                <span className="text-xs font-semibold text-slate-300">Document Scan</span>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                  >
                    <span>Open External</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
              <div className="flex-1 p-2 bg-slate-950 flex items-center justify-center overflow-auto relative">
                {fileUrl ? (
                  fileUrl.toLowerCase().includes(".pdf") ? (
                    <iframe
                      src={`${fileUrl}#toolbar=0`}
                      className="w-full h-full rounded-md border-0"
                      title="CCG preview"
                    />
                  ) : (
                    <Image src={fileUrl} alt="Uploaded CCG" fill unoptimized className="object-contain rounded-md" />
                  )
                ) : (
                  <p className="text-xs text-slate-500">No document preview available.</p>
                )}
              </div>
            </div>

            {/* Right: Grade Verification Panel */}
            <div className="lg:col-span-6 flex flex-col h-full overflow-hidden p-5 space-y-4 bg-white">
              {/* Metric Strip */}
              <div className="grid grid-cols-3 gap-2.5 shrink-0">
                <div className="bg-teal-50/70 border border-teal-100 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-teal-700 block">Total Units</span>
                  <span className="text-base font-black text-[#0a4f42]">{totalUnits.toFixed(1)}</span>
                </div>
                <div className="bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Computed GWA</span>
                  <span className="text-base font-black text-emerald-900">
                    {computedGwa > 0 ? computedGwa.toFixed(2) : "—"}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">Status</span>
                  <Badge variant="outline" className="mt-1 text-[10px] font-bold">
                    {doc.status}
                  </Badge>
                </div>
              </div>

              {/* Grading System Legend */}
              <GradeGradingSystemLegend
                schoolName={scholar?.school_name}
                schoolGrading={schoolGrading}
                gradeThreshold={gradeThreshold}
              />

              {/* Subjects Table */}
              <GradeAuditSubjectsTable
                items={gradeItems}
                onChange={setGradeItems}
                disabled={isSubmitting}
                passingGrade={schoolGrading?.passing_grade ? Number(schoolGrading.passing_grade) : undefined}
                highestGrade={schoolGrading?.highest_grade ? Number(schoolGrading.highest_grade) : undefined}
                failingGrade={schoolGrading?.failing_grade ? Number(schoolGrading.failing_grade) : undefined}
              />

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 mt-auto flex items-center justify-between gap-3 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => {
                    setCoordinatorNotes("");
                    setRequestChangesOpen(true);
                  }}
                  className="h-9.5 rounded-xl border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-amber-900 text-xs font-semibold px-3.5"
                >
                  Request Correction
                </Button>

                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleVerify}
                  className="h-9.5 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs font-bold px-5 gap-2 shadow-xs"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Approve</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <GradeRequestChangesDialog
        open={requestChangesOpen}
        onOpenChange={setRequestChangesOpen}
        notes={coordinatorNotes}
        onNotesChange={setCoordinatorNotes}
        onConfirm={handleRequestChanges}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

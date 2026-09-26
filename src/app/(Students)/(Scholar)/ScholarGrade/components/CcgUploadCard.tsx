"use client";

import { AlertTriangle, Clock, FileText, FileUp, ShieldAlert } from "lucide-react";
import type React from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SocketContext } from "@/contexts/SocketContext";
import {
  confirmDocument,
  deleteDocument,
  type GradeItem,
  type GradeReport,
  getExtractedData,
  getMyDocuments,
  type ScholarDocument,
  uploadDocuments,
} from "@/lib/api/documents";
import { getCurrentEnrollment } from "@/lib/api/enrollment";
import { CcgCardSkeleton } from "./CcgCardSkeleton";
import { CcgFileDropzone } from "./CcgFileDropzone";
import { CcgGradeReviewTable } from "./CcgGradeReviewTable";
import { CcgNeedsReuploadCard } from "./CcgNeedsReuploadCard";
import { CcgOcrScanning } from "./CcgOcrScanning";
import { CcgSubmittedStatusCard } from "./CcgSubmittedStatusCard";

interface CcgUploadCardProps {
  onSuccess: () => void;
  latestReport?: GradeReport | null;
  onOpenAppeal?: () => void;
}

function normalizeAy(raw?: string): string {
  if (!raw) return "2025-2026";
  const match = raw.match(/\d{4}\s*-\s*\d{4}/);
  return match ? match[0].replace(/\s+/g, "") : raw.replace(/^(a\.?y\.?|s\.?y\.?)\s*/i, "").trim();
}

function normalizeSem(raw?: string): string {
  if (!raw) return "1st Semester";
  if (/second|2nd|sem\s*2|2nd\s*sem/i.test(raw)) return "2nd Semester";
  if (/first|1st|sem\s*1|1st\s*sem/i.test(raw)) return "1st Semester";
  if (/third|3rd|sem\s*3|3rd\s*sem/i.test(raw)) return "3rd Semester";
  if (/summer|midyear/i.test(raw)) return "Summer";
  return raw;
}

export function CcgUploadCard({ onSuccess, latestReport, onOpenAppeal }: CcgUploadCardProps) {
  const { socket } = useContext(SocketContext);

  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [semester, setSemester] = useState("2nd Semester");
  const [enrollmentDetected, setEnrollmentDetected] = useState<string | null>(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzingOcr, setAnalyzingOcr] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const [doc, setDoc] = useState<ScholarDocument | null>(null);
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([]);
  const [generalAvg, setGeneralAvg] = useState<number | undefined>(undefined);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch current/submitted term enrollment for default AY & Semester
  useEffect(() => {
    async function loadActiveEnrollment() {
      try {
        const state = await getCurrentEnrollment();
        const active = state.enrollment || state.completed_previous_enrollment;
        if (active?.academic_year || active?.semester) {
          const ay = normalizeAy(active.academic_year);
          const sem = normalizeSem(active.semester);
          setAcademicYear(ay);
          setSemester(sem);
          setEnrollmentDetected(`${ay} • ${sem}`);
        }
      } catch (err) {
        console.error("Failed to load active term enrollment:", err);
      }
    }
    loadActiveEnrollment();
  }, []);

  const parseExtractedPayload = useCallback((extracted: Record<string, unknown> | null | undefined) => {
    if (!extracted) return;
    const rawGrades = (extracted.grades || extracted.grade_items || extracted.subjects || []) as Array<{
      subject_code?: string;
      code?: string;
      subject_name?: string;
      descriptive_title?: string;
      title?: string;
      units?: number | string;
      grade?: number | string;
    }>;

    if (Array.isArray(rawGrades) && rawGrades.length > 0) {
      setGradeItems(
        rawGrades.map((g) => ({
          subject_code: g.subject_code || g.code || "",
          subject_name: g.subject_name || g.descriptive_title || g.title || "",
          units: g.units != null ? Number(g.units) : 3,
          grade: Number(g.grade) || 0,
        })),
      );
    }

    if (typeof extracted.general_average === "number" || typeof extracted.general_average === "string") {
      setGeneralAvg(Number(extracted.general_average) || undefined);
    }
    if (typeof extracted.academic_year === "string" && extracted.academic_year.trim()) {
      setAcademicYear(normalizeAy(extracted.academic_year));
    }
    if (typeof extracted.semester === "string" && extracted.semester.trim()) {
      setSemester(normalizeSem(extracted.semester));
    }
  }, []);

  // 2. Fetch initial draft / pending CCG document
  const fetchActiveDraft = useCallback(async () => {
    try {
      const docs = await getMyDocuments();
      const unverified = docs.find((d) =>
        ["PENDING", "PASSED_PRECHECK", "STUDENT_CONFIRMED", "NEEDS_REUPLOAD"].includes(d.status),
      );

      if (unverified) {
        setDoc(unverified);
        if (unverified.status === "PENDING") {
          setAnalyzingOcr(true);
        } else {
          setAnalyzingOcr(false);
          parseExtractedPayload(
            (unverified.confirmed_data || unverified.extracted_data || {}) as Record<string, unknown>,
          );
        }
      } else {
        setDoc(null);
        setAnalyzingOcr(false);
      }
    } catch (err) {
      console.error("Failed to load active CCG draft:", err);
    } finally {
      setInitialLoading(false);
    }
  }, [parseExtractedPayload]);

  useEffect(() => {
    fetchActiveDraft();
  }, [fetchActiveDraft]);

  // 3. Polling for OCR results if doc is PENDING
  useEffect(() => {
    if (doc?.status !== "PENDING" || !analyzingOcr) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    const currentDocId = doc.document_id;
    let attempts = 0;

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const fresh = await getExtractedData(currentDocId);
        if (fresh && fresh.status !== "PENDING") {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setDoc((prev) => (prev ? { ...prev, ...fresh } : null));
          setAnalyzingOcr(false);
          if (fresh.status === "NEEDS_REUPLOAD") {
            toast.error(
              fresh.rejection_reason ||
                "Document validation failed: The uploaded file is not an official Certified Copy of Grades.",
            );
          } else {
            parseExtractedPayload((fresh.confirmed_data || fresh.extracted_data) as Record<string, unknown>);
            toast.success("AI extraction completed! Review your extracted grades below.");
          }
        }
      } catch {
        // Silently retry
      }
      if (attempts >= 15) {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setAnalyzingOcr(false);
      }
    }, 3000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [doc, analyzingOcr, parseExtractedPayload]);

  // 4. Socket listeners
  useEffect(() => {
    if (!socket) return;
    const handleOcrFinished = (payload: { documentId: number }) => {
      if (doc && doc.document_id === payload.documentId) {
        getExtractedData(doc.document_id)
          .then((fresh) => {
            setDoc((prev) => (prev ? { ...prev, ...fresh } : null));
            setAnalyzingOcr(false);
            if (fresh.status === "NEEDS_REUPLOAD") {
              toast.error(
                fresh.rejection_reason ||
                  "Document validation failed: The uploaded file is not an official Certified Copy of Grades.",
              );
            } else {
              parseExtractedPayload((fresh.confirmed_data || fresh.extracted_data) as Record<string, unknown>);
              toast.success("Your grades and academic records were read successfully.");
            }
          })
          .catch(() => undefined);
      }
    };

    const handleDocumentVerified = (payload: { documentId: number }) => {
      if (doc && doc.document_id === payload.documentId) {
        setDoc(null);
        setGradeItems([]);
        toast.success("Your Certified Copy of Grades was verified and credited!");
        onSuccess();
      }
    };

    const handleDocumentChangesRequested = (payload: { documentId: number }) => {
      if (doc && doc.document_id === payload.documentId) {
        fetchActiveDraft();
        toast.warning("The coordinator requested adjustments to your submitted grades.");
      }
    };

    socket.on("document:ocr_completed", handleOcrFinished);
    socket.on("document:verified", handleDocumentVerified);
    socket.on("document:changes_requested", handleDocumentChangesRequested);

    return () => {
      socket.off("document:ocr_completed", handleOcrFinished);
      socket.off("document:verified", handleDocumentVerified);
      socket.off("document:changes_requested", handleDocumentChangesRequested);
    };
  }, [socket, doc, parseExtractedPayload, fetchActiveDraft, onSuccess]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUploadAndParse = async () => {
    if (!file) {
      toast.error("Please select a Certified Copy of Grades (CCG) file.");
      return;
    }
    try {
      setUploading(true);
      const res = await uploadDocuments([file], "CCG");
      setDoc(res);
      setAnalyzingOcr(true);
      toast.success("Document uploaded! Extracting course grades...");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload CCG.");
    } finally {
      setUploading(false);
    }
  };

  const handleDiscardDraft = async () => {
    if (!doc) return;
    try {
      setDiscarding(true);
      await deleteDocument(doc.document_id);
      toast.success("Draft discarded. You can now upload a new grade document.");
      setDoc(null);
      setFile(null);
      setGradeItems([]);
      setGeneralAvg(undefined);
      setAnalyzingOcr(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to discard draft.");
    } finally {
      setDiscarding(false);
    }
  };

  const handleConfirmAndSubmit = async () => {
    if (!doc) return;
    try {
      setConfirming(true);
      const updated = await confirmDocument(doc.document_id, {
        academic_year: academicYear,
        semester: semester,
        general_average: generalAvg,
        grade_items: gradeItems.length > 0 ? gradeItems : undefined,
      });
      toast.success("Certified Copy of Grades submitted for coordinator audit!");
      setDoc(updated);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to confirm CCG submission.");
    } finally {
      setConfirming(false);
    }
  };

  const handleAddSubject = () => {
    setGradeItems((prev) => [...prev, { subject_code: "", subject_name: "", units: 3, grade: 1.0 }]);
  };

  const previewGwa = () => {
    if (gradeItems.length === 0) return "0.00";
    let sum = 0;
    let unitsTotal = 0;
    for (const item of gradeItems) {
      const u = Number(item.units) || 1;
      const g = Number(item.grade);
      if (!Number.isNaN(g) && g > 0) {
        sum += g * u;
        unitsTotal += u;
      }
    }
    return unitsTotal > 0 ? (sum / unitsTotal).toFixed(2) : "0.00";
  };

  if (initialLoading) {
    return (
      <Card className="rounded-[18px]! border-line bg-white shadow-va-sm">
        <CardContent className="p-5 md:p-6">
          <CcgCardSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[18px]! border-line bg-white shadow-va-sm">
      <CardContent className="p-5 md:p-6 space-y-5">
        <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-navy flex items-center gap-2">
              <FileUp className="size-4 text-[#0a4f42]" />
              End-of-Term Certified Copy of Grades (CCG) Submission
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload your official registrar grade slip to record course credits and verify scholarship renewal.
            </p>
          </div>
          {doc && (
            <Badge
              variant="outline"
              className={
                doc.status === "STUDENT_CONFIRMED"
                  ? "bg-amber-50 text-amber-800 border-amber-300 text-xs font-bold"
                  : doc.status === "NEEDS_REUPLOAD"
                    ? "bg-rose-50 text-rose-800 border-rose-300 text-xs font-bold"
                    : "bg-[#0a4f42]/10 text-[#0a4f42] border-[#0a4f42]/30 text-xs font-bold"
              }
            >
              {doc.status === "STUDENT_CONFIRMED"
                ? `Submission #${doc.document_id} Under Audit`
                : doc.status === "NEEDS_REUPLOAD"
                  ? `Correction Requested on #${doc.document_id}`
                  : `Draft #${doc.document_id} Loaded`}
            </Badge>
          )}
        </div>

        {(() => {
          const isFlagged = latestReport && (!latestReport.is_eligible || latestReport.status === "FLAGGED");
          const hasPendingAppeal = latestReport?.appeal_status === "PENDING_GRANTOR";
          const appealApproved = latestReport?.appeal_status === "APPROVED";
          const appealDenied = latestReport?.appeal_status === "DENIED";
          const isAcademicLocked = (isFlagged && !appealApproved) || appealDenied;

          if (isAcademicLocked && !doc) {
            return (
              <div className="rounded-xl border border-amber-200/90 bg-linear-to-br from-amber-50/70 via-white to-orange-50/40 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      appealDenied
                        ? "bg-rose-100 text-rose-700"
                        : hasPendingAppeal
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {appealDenied ? (
                      <ShieldAlert className="size-5" />
                    ) : hasPendingAppeal ? (
                      <Clock className="size-5 animate-pulse" />
                    ) : (
                      <AlertTriangle className="size-5" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-navy">
                      {appealDenied
                        ? "Grade Slip Submission Unavailable"
                        : hasPendingAppeal
                          ? "Grade Submission Paused • Academic Appeal Under Review"
                          : "Grade Submission Paused • Academic Appeal Required"}
                    </h4>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {appealDenied
                        ? "Your scholarship agreement has ended following an appeal decision. Grade uploads are disabled."
                        : hasPendingAppeal
                          ? `Your second chance appeal for ${latestReport?.academic_year || "the previous term"} ${latestReport?.semester || ""} is currently awaiting Grantor review. Once the appeal is granted and probation is lifted, grade submissions will be automatically unlocked.`
                          : `Your previous semester's grades (${latestReport?.academic_year || ""} ${latestReport?.semester || ""}) were flagged for academic review. Please complete and submit your Second Chance Appeal above before uploading subsequent course records.`}
                    </p>
                  </div>
                </div>

                {!hasPendingAppeal && !appealDenied && onOpenAppeal && (
                  <div className="pt-2 border-t border-amber-200/60 flex justify-end">
                    <Button
                      type="button"
                      onClick={onOpenAppeal}
                      className="h-8.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3.5 gap-1.5 shadow-xs"
                    >
                      <FileText className="size-3.5" />
                      <span>Submit Second Chance Appeal</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          }

          if (!doc) {
            return (
              <CcgFileDropzone
                enrollmentDetected={enrollmentDetected}
                academicYear={academicYear}
                setAcademicYear={setAcademicYear}
                semester={semester}
                setSemester={setSemester}
                file={file}
                onFileSelect={handleFileSelect}
                uploading={uploading}
                onUpload={handleUploadAndParse}
              />
            );
          }

          if (analyzingOcr) {
            return <CcgOcrScanning fileName={doc.file_name} discarding={discarding} onDiscard={handleDiscardDraft} />;
          }

          if (doc.status === "NEEDS_REUPLOAD") {
            return (
              <CcgNeedsReuploadCard
                doc={doc}
                discarding={discarding}
                onDiscard={handleDiscardDraft}
              />
            );
          }

          if (doc.status === "STUDENT_CONFIRMED") {
            return (
              <CcgSubmittedStatusCard
                doc={doc}
                academicYear={academicYear}
                semester={semester}
                gradeItems={gradeItems}
                previewGwa={previewGwa()}
                discarding={discarding}
                onDiscard={handleDiscardDraft}
              />
            );
          }

          return (
            <CcgGradeReviewTable
              doc={doc}
              academicYear={academicYear}
              setAcademicYear={setAcademicYear}
              semester={semester}
              setSemester={setSemester}
              gradeItems={gradeItems}
              setGradeItems={setGradeItems}
              previewGwa={previewGwa()}
              discarding={discarding}
              confirming={confirming}
              onDiscard={handleDiscardDraft}
              onConfirm={handleConfirmAndSubmit}
              onAddSubject={handleAddSubject}
            />
          );
        })()}
      </CardContent>
    </Card>
  );
}

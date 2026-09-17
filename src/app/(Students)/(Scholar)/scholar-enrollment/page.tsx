"use client";

import { AlertCircle, AlertTriangle, BookOpen } from "lucide-react";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { SocketContext } from "@/contexts/SocketContext";
import {
  type BillingBreakdown,
  type CurrentEnrollmentState,
  type EnrolledSubjectItem,
  type EnrollmentAuditResult,
  getCurrentEnrollment,
  runPreAudit,
  submitTermEnrollment,
  uploadConsolidatedDocument,
  uploadCorDocument,
  uploadSoaDocument,
} from "@/lib/api/enrollment";
import { BillingAssessmentSummary } from "./components/BillingAssessmentSummary";
import { EnrolledSubjectsReview } from "./components/EnrolledSubjectsReview";
import { EnrollmentAuditSummaryCard } from "./components/EnrollmentAuditSummaryCard";
import { EnrollmentDropzone } from "./components/EnrollmentDropzone";
import { EnrollmentModeToggle } from "./components/EnrollmentModeToggle";
import { EnrollmentTopBar } from "./components/EnrollmentTopBar";

export default function ScholarEnrollmentPage() {
  const { socket } = useContext(SocketContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentState, setEnrollmentState] = useState<CurrentEnrollmentState | null>(null);

  // Upload & mode state
  const [isConsolidated, setIsConsolidated] = useState(false);
  const [isUploadingCor, setIsUploadingCor] = useState(false);
  const [isUploadingSoa, setIsUploadingSoa] = useState(false);
  const [isUploadingConsolidated, setIsUploadingConsolidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form & Extracted Data state
  const [corDocId, setCorDocId] = useState<number | undefined>();
  const [soaDocId, setSoaDocId] = useState<number | undefined>();
  const [corFile, setCorFile] = useState<{
    name: string;
    size?: string;
    url?: string;
  } | null>(null);
  const [soaFile, setSoaFile] = useState<{
    name: string;
    size?: string;
    url?: string;
  } | null>(null);
  const [consolidatedFile, setConsolidatedFile] = useState<{
    name: string;
    size?: string;
    url?: string;
  } | null>(null);

  const [enrolledSubjects, setEnrolledSubjects] = useState<EnrolledSubjectItem[]>([]);
  const [totalAssessment, setTotalAssessment] = useState<number>(0);
  const [assessmentDate, setAssessmentDate] = useState<string>("");
  const [billingBreakdown, setBillingBreakdown] = useState<BillingBreakdown>({});
  const [auditResult, setAuditResult] = useState<EnrollmentAuditResult | null>(null);

  const fetchState = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurrentEnrollment();
      setEnrollmentState(data);

      if (data.enrollment) {
        setIsConsolidated(data.enrollment.is_consolidated);
        setEnrolledSubjects(data.enrollment.enrolled_subjects || []);
        setTotalAssessment(Number(data.enrollment.total_assessment) || 0);
        setAssessmentDate(data.enrollment.assessment_date ? data.enrollment.assessment_date.slice(0, 10) : "");
        setBillingBreakdown(data.enrollment.billing_breakdown || {});
        setCorDocId(data.enrollment.cor_document_id ?? undefined);
        setSoaDocId(data.enrollment.soa_document_id ?? undefined);

        if (data.enrollment.is_consolidated && data.enrollment.cor_document) {
          setConsolidatedFile({
            name: data.enrollment.cor_document.file_name,
            size: data.enrollment.cor_document.file_size,
            url: data.enrollment.cor_document.file_url,
          });
        } else {
          if (data.enrollment.cor_document) {
            setCorFile({
              name: data.enrollment.cor_document.file_name,
              size: data.enrollment.cor_document.file_size,
              url: data.enrollment.cor_document.file_url,
            });
          }
          if (data.enrollment.soa_document) {
            setSoaFile({
              name: data.enrollment.soa_document.file_name,
              size: data.enrollment.soa_document.file_size,
              url: data.enrollment.soa_document.file_url,
            });
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load enrollment state.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // Real-time socket events
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      fetchState();
      toast.info("Enrollment status updated by coordinator.");
    };
    socket.on("enrollment:approved", handleUpdate);
    socket.on("enrollment:changes_requested", handleUpdate);
    socket.on("enrollment:rejected", handleUpdate);
    return () => {
      socket.off("enrollment:approved", handleUpdate);
      socket.off("enrollment:changes_requested", handleUpdate);
      socket.off("enrollment:rejected", handleUpdate);
    };
  }, [socket, fetchState]);

  // Trigger pre-audit when subjects or term details change
  useEffect(() => {
    if (enrolledSubjects.length === 0) {
      setAuditResult(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await runPreAudit({
          academic_year: enrollmentState?.scholar?.prospectus?.curriculum_year || "2026-2027",
          semester: "1st Semester",
          year_level: enrollmentState?.scholar?.current_year_level || 1,
          total_units: enrolledSubjects.reduce((sum, s) => sum + (Number(s.units) || 0), 0),
          total_assessment: totalAssessment,
          enrolled_subjects: enrolledSubjects,
        });
        setAuditResult(res);
      } catch (err) {
        console.error("Pre-audit check error:", err);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [enrolledSubjects, totalAssessment, enrollmentState]);

  const handleCorUpload = async (file: File) => {
    try {
      setIsUploadingCor(true);
      const res = await uploadCorDocument(file);
      setCorDocId(res.document_id);
      setCorFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: res.file_url,
      });

      if (res.extracted_data?.subjects?.length) {
        setEnrolledSubjects(res.extracted_data.subjects);
      }
      toast.success("Certificate of Registration parsed successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload COR.";
      toast.error(msg);
    } finally {
      setIsUploadingCor(false);
    }
  };

  const handleSoaUpload = async (file: File) => {
    try {
      setIsUploadingSoa(true);
      const res = await uploadSoaDocument(file);
      setSoaDocId(res.document_id);
      setSoaFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: res.file_url,
      });

      if (res.extracted_data?.total_assessment) {
        setTotalAssessment(res.extracted_data.total_assessment);
      }
      if (res.extracted_data?.assessment_date) {
        setAssessmentDate(res.extracted_data.assessment_date);
      }
      setBillingBreakdown({
        tuition_fee: res.extracted_data?.tuition_fee,
        lab_fees: res.extracted_data?.lab_fees,
        misc_fees: res.extracted_data?.misc_fees,
        other_fees: res.extracted_data?.other_fees,
        previous_balance: res.extracted_data?.previous_balance,
        discounts: res.extracted_data?.discounts,
      });
      toast.success("Statement of Account parsed successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload SOA.";
      toast.error(msg);
    } finally {
      setIsUploadingSoa(false);
    }
  };

  const handleConsolidatedUpload = async (file: File) => {
    try {
      setIsUploadingConsolidated(true);
      const res = await uploadConsolidatedDocument(file);
      setCorDocId(res.document_id);
      setConsolidatedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: res.file_url,
      });

      if (res.extracted_data?.subjects?.length) {
        setEnrolledSubjects(res.extracted_data.subjects);
      }
      if (res.extracted_data?.total_assessment) {
        setTotalAssessment(res.extracted_data.total_assessment);
      }
      if (res.extracted_data?.assessment_date) {
        setAssessmentDate(res.extracted_data.assessment_date);
      }
      setBillingBreakdown({
        tuition_fee: res.extracted_data?.tuition_fee,
        lab_fees: res.extracted_data?.lab_fees,
        misc_fees: res.extracted_data?.misc_fees,
        other_fees: res.extracted_data?.other_fees,
        previous_balance: res.extracted_data?.previous_balance,
        discounts: res.extracted_data?.discounts,
      });
      toast.success("Consolidated Matriculation parsed successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload consolidated form.";
      toast.error(msg);
    } finally {
      setIsUploadingConsolidated(false);
    }
  };

  const handleSubmit = async () => {
    if (enrolledSubjects.length === 0) {
      toast.error("Please upload or add your enrolled subjects before submitting.");
      return;
    }
    if (totalAssessment <= 0) {
      toast.error("Please provide your total tuition assessment balance.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        academic_year: enrollmentState?.scholar?.prospectus?.curriculum_year || "2026-2027",
        semester: "1st Semester",
        year_level: enrollmentState?.scholar?.current_year_level || 1,
        is_consolidated: isConsolidated,
        cor_document_id: corDocId,
        soa_document_id: isConsolidated ? corDocId : soaDocId,
        total_units: enrolledSubjects.reduce((sum, s) => sum + (Number(s.units) || 0), 0),
        total_assessment: totalAssessment,
        assessment_date: assessmentDate || undefined,
        enrolled_subjects: enrolledSubjects,
        billing_breakdown: billingBreakdown,
      };

      const res = await submitTermEnrollment(payload);
      toast.success(res.message);
      fetchState();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit term enrollment.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !enrollmentState) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Error Loading Enrollment</h2>
        <p className="text-sm text-slate-600">{error || "Could not retrieve enrollment state."}</p>
        <button
          type="button"
          onClick={fetchState}
          className="px-4 py-2 bg-[#0a4f42] text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!enrollmentState.prospectus_frozen) {
    return (
      <div className="md:p-8 max-w-2xl mx-auto text-center space-y-4 bg-white rounded-2xl border border-slate-200/80 p-8">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Academic Baseline Not Yet Frozen</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your coordinator must review and freeze your official academic prospectus baseline before start-of-term
          enrollment credentials can be audited.
        </p>
        <Link
          href="/scholarProspectus"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a4f42] text-white rounded-xl text-xs font-semibold hover:bg-[#083c32] transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Go to Scholar Prospectus</span>
        </Link>
      </div>
    );
  }

  const isReadOnly =
    enrollmentState.enrollment?.status === "APPROVED" || enrollmentState.enrollment?.status === "PENDING_REVIEW";
  const status = enrollmentState.enrollment?.status || "NOT_SUBMITTED";

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <EnrollmentTopBar
        studentName={`${enrollmentState.scholar.first_name} ${enrollmentState.scholar.last_name}`}
        schoolName={enrollmentState.scholar.school_name || "Enrolled University"}
        courseName={enrollmentState.scholar.course_of_study || "Degree Program"}
        academicYear={enrollmentState.scholar.prospectus?.curriculum_year || "2026-2027"}
        semester="1st Semester"
        yearLevel={enrollmentState.scholar.current_year_level || 1}
        status={status}
        isRefreshing={loading}
        onRefresh={fetchState}
      />

      {!isReadOnly && (
        <div className="flex justify-start">
          <EnrollmentModeToggle isConsolidated={isConsolidated} onChange={setIsConsolidated} disabled={isReadOnly} />
        </div>
      )}

      {/* Upload Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isConsolidated ? (
          <div className="md:col-span-2">
            <EnrollmentDropzone
              title="Official Consolidated Enrollment & Assessment Document"
              subtitle="Upload your Certificate of Matriculation containing both registered subject table and tuition assessment."
              fileTypeLabel="Consolidated Form"
              isUploading={isUploadingConsolidated}
              uploadedFile={consolidatedFile}
              onFileUpload={handleConsolidatedUpload}
              onClearFile={() => {
                setConsolidatedFile(null);
                setCorDocId(undefined);
              }}
              disabled={isReadOnly}
            />
          </div>
        ) : (
          <>
            <EnrollmentDropzone
              title="Proof of Enrolled Subjects (COR / Form 1)"
              subtitle="Upload your Certificate of Registration, Matriculation, or E-COR showing class schedule and credit units."
              fileTypeLabel="Proof of Subjects"
              isUploading={isUploadingCor}
              uploadedFile={corFile}
              onFileUpload={handleCorUpload}
              onClearFile={() => {
                setCorFile(null);
                setCorDocId(undefined);
              }}
              disabled={isReadOnly}
            />

            <EnrollmentDropzone
              title="Proof of Billing Assessment (SOA / Ledger)"
              subtitle="Upload your Statement of Account, Assessment Form, or Student Ledger displaying tuition balance due."
              fileTypeLabel="Proof of Billing"
              isUploading={isUploadingSoa}
              uploadedFile={soaFile}
              onFileUpload={handleSoaUpload}
              onClearFile={() => {
                setSoaFile(null);
                setSoaDocId(undefined);
              }}
              disabled={isReadOnly}
            />
          </>
        )}
      </div>

      {/* Enrolled Subjects Review */}
      <EnrolledSubjectsReview
        subjects={enrolledSubjects}
        onChangeSubjects={setEnrolledSubjects}
        isReadOnly={isReadOnly}
      />

      {/* Billing Assessment Summary */}
      <BillingAssessmentSummary
        totalAssessment={totalAssessment}
        assessmentDate={assessmentDate}
        billingBreakdown={billingBreakdown}
        onChangeTotalAssessment={setTotalAssessment}
        onChangeAssessmentDate={setAssessmentDate}
        onChangeBreakdown={setBillingBreakdown}
        isReadOnly={isReadOnly}
      />

      {/* Automated Audit Summary Card & Submit */}
      <EnrollmentAuditSummaryCard
        auditResult={auditResult}
        isSubmitting={isSubmitting}
        canSubmit={enrolledSubjects.length > 0 && totalAssessment > 0}
        status={status}
        coordinatorNotes={enrollmentState.enrollment?.coordinator_notes}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

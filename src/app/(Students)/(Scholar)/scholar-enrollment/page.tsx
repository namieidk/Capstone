"use client";

import { AlertCircle, AlertTriangle, BookOpen } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BillingAssessmentSummary } from "./components/BillingAssessmentSummary";
import { EnrolledSubjectsReview } from "./components/EnrolledSubjectsReview";
import { EnrollmentAuditSummaryCard } from "./components/EnrollmentAuditSummaryCard";
import { EnrollmentUploadSection } from "./components/EnrollmentUploadSection";
import { ScholarTermContextCard } from "./components/ScholarTermContextCard";
import { useScholarEnrollmentState } from "./hooks/useScholarEnrollmentState";

export default function ScholarEnrollmentPage() {
  const {
    loading,
    error,
    enrollmentState,
    fetchState,
    isConsolidated,
    setIsConsolidated,
    isUploadingCor,
    isUploadingSoa,
    isUploadingConsolidated,
    isSubmitting,
    isSavingDraft,
    corFile,
    setCorFile,
    soaFile,
    setSoaFile,
    consolidatedFile,
    setConsolidatedFile,
    setCorDocId,
    setSoaDocId,
    enrolledSubjects,
    setEnrolledSubjects,
    totalAssessment,
    setTotalAssessment,
    assessmentDate,
    setAssessmentDate,
    billingBreakdown,
    setBillingBreakdown,
    auditResult,
    handleCorUpload,
    handleSoaUpload,
    handleConsolidatedUpload,
    handleSaveDraft,
    handleDiscardDraft,
    handleSubmit,
    isReadOnly,
    status,
  } = useScholarEnrollmentState();

  const isDraft = status === "DRAFT";

  return (
    <div className="flex min-h-full flex-col bg-[#FAF9F7]">
      <PageHeader
        title="Start-of-Term Enrollment & SOA Audit"
        subtitle="Submit university Certificate of Registration (COR) and Statement of Account (SOA) for baseline compliance audit and tuition endorsement."
      />

      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {loading && !enrollmentState ? (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : error || !enrollmentState ? (
          <Card className="max-w-xl mx-auto text-center p-8 border-border">
            <AlertCircle className="size-12 text-destructive mx-auto mb-3" />
            <h2 className="text-lg font-bold text-foreground">Error Loading Enrollment</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{error || "Could not retrieve enrollment state."}</p>
            <Button onClick={fetchState} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              Try Again
            </Button>
          </Card>
        ) : !enrollmentState.prospectus_frozen ? (
          <Card className="max-w-2xl mx-auto text-center p-8 border-border">
            <AlertTriangle className="size-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-foreground">Academic Baseline Not Yet Frozen</h2>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1 mb-5">
              Your coordinator must review and freeze your official academic prospectus baseline before start-of-term
              enrollment credentials can be audited.
            </p>
            <Button asChild className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white">
              <Link href="/scholarProspectus">
                <BookOpen className="size-4" />
                <span>Go to Scholar Prospectus</span>
              </Link>
            </Button>
          </Card>
        ) : (
          <>
            {/* Header Scholar & Term Context Card */}
            <ScholarTermContextCard enrollmentState={enrollmentState} loading={loading} onRefresh={fetchState} />

            {/* Upload Dropzones & Mode Toggle */}
            <EnrollmentUploadSection
              isConsolidated={isConsolidated}
              onToggleConsolidated={setIsConsolidated}
              isReadOnly={isReadOnly}
              isUploadingConsolidated={isUploadingConsolidated}
              consolidatedFile={consolidatedFile}
              onUploadConsolidated={handleConsolidatedUpload}
              onClearConsolidated={() => {
                setConsolidatedFile(null);
                setCorDocId(undefined);
              }}
              isUploadingCor={isUploadingCor}
              corFile={corFile}
              onUploadCor={handleCorUpload}
              onClearCor={() => {
                setCorFile(null);
                setCorDocId(undefined);
              }}
              isUploadingSoa={isUploadingSoa}
              soaFile={soaFile}
              onUploadSoa={handleSoaUpload}
              onClearSoa={() => {
                setSoaFile(null);
                setSoaDocId(undefined);
              }}
            />

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

            {/* Automated Audit Summary Card & Actions */}
            <EnrollmentAuditSummaryCard
              auditResult={auditResult}
              isSubmitting={isSubmitting}
              isSavingDraft={isSavingDraft}
              canSubmit={enrolledSubjects.length > 0 && totalAssessment > 0}
              status={status}
              coordinatorNotes={enrollmentState.enrollment?.coordinator_notes}
              onSubmit={handleSubmit}
              onSaveDraft={handleSaveDraft}
              onDiscardDraft={handleDiscardDraft}
              hasDraft={isDraft || enrolledSubjects.length > 0 || totalAssessment > 0}
            />
          </>
        )}
      </div>
    </div>
  );
}

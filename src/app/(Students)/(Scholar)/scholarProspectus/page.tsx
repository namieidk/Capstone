"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CurriculumMetricsSummary } from "@/components/scholar/prospectus/CurriculumMetricsSummary";
import { EditSubjectsModal } from "@/components/scholar/prospectus/EditSubjectsModal";
import { GradingSystemCard } from "@/components/scholar/prospectus/GradingSystemCard";
import { ProspectusChecklistTable } from "@/components/scholar/prospectus/ProspectusChecklistTable";
import { ProspectusHeader } from "@/components/scholar/prospectus/ProspectusHeader";
import { SchoolSelectionModal } from "@/components/scholar/prospectus/SchoolSelectionModal";
import { UploadHistoricalCcgModal } from "@/components/scholar/prospectus/UploadHistoricalCcgModal";
import { UploadProspectusModal } from "@/components/scholar/prospectus/UploadProspectusModal";
import { Skeleton } from "@/components/ui/skeleton";
import { SocketContext } from "@/contexts/SocketContext";
import { getMyBaseline, type ScholarBaselineState, submitBaselineForReview } from "@/lib/api/baseline";

export default function ScholarProspectusPage() {
  const { socket } = useContext(SocketContext);
  const [data, setData] = useState<ScholarBaselineState | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Modals state
  const [openSchoolModal, setOpenSchoolModal] = useState(false);
  const [openProspectusModal, setOpenProspectusModal] = useState(false);
  const [openHistoricalCcgModal, setOpenHistoricalCcgModal] = useState(false);
  const [openEditSubjectsModal, setOpenEditSubjectsModal] = useState(false);

  const fetchBaseline = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyBaseline();
      setData(res);
    } catch (err) {
      console.error("Failed to load baseline state:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBaseline();
  }, [fetchBaseline]);

  // Real-time socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      fetchBaseline();
    };

    socket.on("baseline:prospectus_processed", handleRefresh);
    socket.on("baseline:submitted_for_review", handleRefresh);
    socket.on("baseline:frozen", handleRefresh);
    socket.on("baseline:unfrozen", handleRefresh);
    socket.on("baseline:school_selected", handleRefresh);
    socket.on("school_grading:verified", handleRefresh);

    return () => {
      socket.off("baseline:prospectus_processed", handleRefresh);
      socket.off("baseline:submitted_for_review", handleRefresh);
      socket.off("baseline:frozen", handleRefresh);
      socket.off("baseline:unfrozen", handleRefresh);
      socket.off("baseline:school_selected", handleRefresh);
      socket.off("school_grading:verified", handleRefresh);
    };
  }, [socket, fetchBaseline]);

  const handleSubmitForReview = async () => {
    try {
      setSubmittingReview(true);
      await submitBaselineForReview();
      fetchBaseline();
    } catch (err) {
      console.error("Failed to submit for review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const isFrozen = data?.metrics.is_baseline_frozen ?? false;
  const subjects = data?.prospectus?.subjects ?? [];

  return (
    <div className="flex min-h-full flex-col bg-[#FAF9F7]">
      <PageHeader
        title="Curriculum Prospectus"
        subtitle="Manage your degree curriculum baseline, verify completed subjects, and track retention."
      />

      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {loading && !data ? (
          <div className="space-y-6">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        ) : (
          <>
            {/* 1. Action Bar & Verification Status */}
            <ProspectusHeader
              baselineStatus={data?.academic_baseline_status || "PENDING_SCHOOL_SELECTION"}
              isFrozen={isFrozen}
              totalSubjects={subjects.length}
              onUploadProspectus={() => setOpenProspectusModal(true)}
              onUploadHistoricalCcg={() => setOpenHistoricalCcgModal(true)}
              onEditSubjects={() => setOpenEditSubjectsModal(true)}
              onSubmitForReview={handleSubmitForReview}
              submittingReview={submittingReview}
            />

            {/* 2. Institution Grading Scale Banner */}
            <GradingSystemCard
              schoolSystem={data?.school_grading_system}
              isFrozen={isFrozen}
              onOpenSelection={() => setOpenSchoolModal(true)}
            />

            {/* 3. Progress & Unit Metrics Summary */}
            {data && (
              <CurriculumMetricsSummary
                courseName={data.prospectus?.course_name || data.course_of_study}
                courseCode={data.prospectus?.course_code}
                curriculumYear={data.prospectus?.curriculum_year}
                metrics={data.metrics}
              />
            )}

            {/* 4. Curriculum Checklist Table */}
            <ProspectusChecklistTable subjects={subjects} />
          </>
        )}
      </div>

      {/* Modals */}
      <SchoolSelectionModal
        open={openSchoolModal}
        onOpenChange={setOpenSchoolModal}
        currentSchoolId={data?.school_grading_system?.school_id}
        onSuccess={fetchBaseline}
      />

      <UploadProspectusModal
        open={openProspectusModal}
        onOpenChange={setOpenProspectusModal}
        onSuccess={fetchBaseline}
      />

      <UploadHistoricalCcgModal
        open={openHistoricalCcgModal}
        onOpenChange={setOpenHistoricalCcgModal}
        onSuccess={fetchBaseline}
      />

      <EditSubjectsModal
        open={openEditSubjectsModal}
        onOpenChange={setOpenEditSubjectsModal}
        subjects={subjects}
        curriculumYear={data?.prospectus?.curriculum_year}
        courseName={data?.prospectus?.course_name}
        courseCode={data?.prospectus?.course_code}
        onSuccess={fetchBaseline}
      />
    </div>
  );
}

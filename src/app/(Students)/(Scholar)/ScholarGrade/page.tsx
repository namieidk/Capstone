"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "@/contexts/SocketContext";
import { type GradeReport, getGradeReportsMe } from "@/lib/api/documents";
import { getSettings } from "@/lib/api/settings";
import { AcademicAppealModal } from "./components/AcademicAppealModal";
import { AcademicStandingCard } from "./components/AcademicStandingCard";
import { CcgUploadCard } from "./components/CcgUploadCard";
import { ScholarGradeHeader } from "./components/ScholarGradeHeader";
import { TermGradesHistoryTable } from "./components/TermGradesHistoryTable";

export default function ScholarGradePage() {
  const { socket } = useContext(SocketContext);
  const [reports, setReports] = useState<GradeReport[]>([]);
  const [gradeThreshold, setGradeThreshold] = useState<number>(90);
  const [loading, setLoading] = useState(true);
  const [appealModalOpen, setAppealModalOpen] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const [data, settings] = await Promise.all([
        getGradeReportsMe(),
        getSettings().catch(() => ({ grade_threshold: 90 })),
      ]);
      setReports(data || []);
      if (settings?.grade_threshold) {
        setGradeThreshold(Number(settings.grade_threshold));
      }
    } catch (err) {
      console.error("Failed to load scholar grade reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Real-time socket updates
  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => fetchReports();

    socket.on("grade_report:verified", handleRefresh);
    socket.on("document:verified", handleRefresh);
    socket.on("grade_report:appeal_decided", handleRefresh);
    socket.on("settings:updated", handleRefresh);

    return () => {
      socket.off("grade_report:verified", handleRefresh);
      socket.off("document:verified", handleRefresh);
      socket.off("grade_report:appeal_decided", handleRefresh);
      socket.off("settings:updated", handleRefresh);
    };
  }, [socket, fetchReports]);

  const latestReport = reports.length > 0 ? reports[0] : null;

  return (
    <div className="min-h-full bg-[#faf8f5] pb-24">
      <ScholarGradeHeader />

      <div className="px-5 pt-6 md:px-10 space-y-6 max-w-6xl mx-auto">
        {/* Top: Academic Standing & Retention Evaluation Summary */}
        <AcademicStandingCard
          latestReport={latestReport}
          reportsCount={reports.length}
          onOpenAppeal={() => setAppealModalOpen(true)}
          loading={loading}
          gradeThreshold={gradeThreshold}
        />

        {/* Center: CCG Ingestion & OCR Precheck Card */}
        <CcgUploadCard
          onSuccess={fetchReports}
          latestReport={latestReport}
          onOpenAppeal={() => setAppealModalOpen(true)}
        />

        {/* Bottom: Semestral Credited Grades History */}
        <TermGradesHistoryTable reports={reports} loading={loading} />
      </div>

      {/* Appeal Dialog */}
      <AcademicAppealModal
        open={appealModalOpen}
        onOpenChange={setAppealModalOpen}
        report={latestReport}
        onSuccess={fetchReports}
      />
    </div>
  );
}

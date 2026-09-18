"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import type { ActiveScholar } from "@/components/Coordinatorshared";
import { SocketContext } from "@/contexts/SocketContext";
import {
  getCoordinatorActiveScholars,
  getCoordinatorPendingBaselines,
  type PendingBaselineItem,
} from "@/lib/api/baseline";
import { type GradeReport, getPendingAcademicAppeals } from "@/lib/api/documents";
import { getCoordinatorPendingEnrollments, type TermEnrollment } from "@/lib/api/enrollment";

export function useGrantorMonitorData() {
  const { socket } = useContext(SocketContext);

  const [activeScholars, setActiveScholars] = useState<ActiveScholar[]>([]);
  const [loadingActiveScholars, setLoadingActiveScholars] = useState(true);
  const [activeScholarsError, setActiveScholarsError] = useState("");

  const [baselineItems, setBaselineItems] = useState<PendingBaselineItem[]>([]);
  const [loadingBaselines, setLoadingBaselines] = useState(true);

  const [enrollmentItems, setEnrollmentItems] = useState<TermEnrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  const [appealItems, setAppealItems] = useState<GradeReport[]>([]);
  const [loadingAppeals, setLoadingAppeals] = useState(true);

  const fetchActiveScholars = useCallback(async () => {
    try {
      setLoadingActiveScholars(true);
      setActiveScholarsError("");
      const data = await getCoordinatorActiveScholars();
      setActiveScholars(data || []);
    } catch (err) {
      console.error("Failed to load active scholars for grantor:", err);
      setActiveScholarsError(err instanceof Error ? err.message : "Failed to load active scholars.");
    } finally {
      setLoadingActiveScholars(false);
    }
  }, []);

  const fetchPendingBaselines = useCallback(async () => {
    try {
      setLoadingBaselines(true);
      const data = await getCoordinatorPendingBaselines();
      setBaselineItems(data || []);
    } catch (err) {
      console.error("Failed to load grantor pending baselines:", err);
    } finally {
      setLoadingBaselines(false);
    }
  }, []);

  const fetchPendingEnrollments = useCallback(async () => {
    try {
      setLoadingEnrollments(true);
      const data = await getCoordinatorPendingEnrollments();
      setEnrollmentItems(data || []);
    } catch (err) {
      console.error("Failed to load pending enrollments for grantor:", err);
    } finally {
      setLoadingEnrollments(false);
    }
  }, []);

  const fetchPendingAppeals = useCallback(async () => {
    try {
      setLoadingAppeals(true);
      const data = await getPendingAcademicAppeals();
      setAppealItems(data || []);
    } catch (err) {
      console.error("Failed to load academic appeals for grantor:", err);
    } finally {
      setLoadingAppeals(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchActiveScholars();
    fetchPendingBaselines();
    fetchPendingEnrollments();
    fetchPendingAppeals();
  }, [fetchActiveScholars, fetchPendingBaselines, fetchPendingEnrollments, fetchPendingAppeals]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => refreshAll();

    socket.on("baseline:submitted_for_review", handleRefresh);
    socket.on("baseline:prospectus_processed", handleRefresh);
    socket.on("baseline:frozen", handleRefresh);
    socket.on("baseline:unfrozen", handleRefresh);
    socket.on("school_grading:verified", handleRefresh);
    socket.on("enrollment:submitted_for_review", handleRefresh);
    socket.on("enrollment:approved", handleRefresh);
    socket.on("enrollment:changes_requested", handleRefresh);
    socket.on("application:stage_updated", handleRefresh);
    socket.on("contract:signed", handleRefresh);
    socket.on("disbursement:created", handleRefresh);
    socket.on("disbursement:updated", handleRefresh);
    socket.on("grade_report:submitted", handleRefresh);
    socket.on("academic_appeal:submitted", handleRefresh);
    socket.on("academic_appeal:reviewed", handleRefresh);

    return () => {
      socket.off("baseline:submitted_for_review", handleRefresh);
      socket.off("baseline:prospectus_processed", handleRefresh);
      socket.off("baseline:frozen", handleRefresh);
      socket.off("baseline:unfrozen", handleRefresh);
      socket.off("school_grading:verified", handleRefresh);
      socket.off("enrollment:submitted_for_review", handleRefresh);
      socket.off("enrollment:approved", handleRefresh);
      socket.off("enrollment:changes_requested", handleRefresh);
      socket.off("application:stage_updated", handleRefresh);
      socket.off("contract:signed", handleRefresh);
      socket.off("disbursement:created", handleRefresh);
      socket.off("disbursement:updated", handleRefresh);
      socket.off("grade_report:submitted", handleRefresh);
      socket.off("academic_appeal:submitted", handleRefresh);
      socket.off("academic_appeal:reviewed", handleRefresh);
    };
  }, [socket, refreshAll]);

  return {
    activeScholars,
    loadingActiveScholars,
    activeScholarsError,
    fetchActiveScholars,
    baselineItems,
    loadingBaselines,
    enrollmentItems,
    loadingEnrollments,
    appealItems,
    loadingAppeals,
    refreshAll,
  };
}

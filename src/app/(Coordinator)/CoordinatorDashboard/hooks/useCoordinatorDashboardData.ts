"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { type CoordinatorDashboardResponse, getCoordinatorDashboardData } from "@/lib/api/coordinator-dashboard";

export function useCoordinatorDashboardData() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [data, setData] = useState<CoordinatorDashboardResponse | null>(null);

  const fetchDashboardData = useCallback(async (silent = false, forceRefresh = false) => {
    if (!silent) setLoading(true);
    if (forceRefresh) setRefreshing(true);
    setLoadError("");
    try {
      const [res] = await Promise.all([
        getCoordinatorDashboardData(forceRefresh),
        forceRefresh ? new Promise<void>((r) => setTimeout(r, 400)) : Promise.resolve(),
      ]);
      setData(res);
    } catch (err) {
      console.error("Failed to load coordinator dashboard data:", err);
      setLoadError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => fetchDashboardData(true, true), [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Comprehensive Real-time Socket.IO Subscriptions for Coordinator Dashboard
  useSocketEvent("application:stage_updated", () => fetchDashboardData(true));
  useSocketEvent("application:interview_scheduled", () => fetchDashboardData(true));
  useSocketEvent("application:reschedule_requested", () => fetchDashboardData(true));
  useSocketEvent("application:new_submission", () => fetchDashboardData(true));
  useSocketEvent("baseline:submitted_for_review", () => fetchDashboardData(true));
  useSocketEvent("baseline:frozen", () => fetchDashboardData(true));
  useSocketEvent("enrollment:submitted", () => fetchDashboardData(true));
  useSocketEvent("enrollment:submitted_for_review", () => fetchDashboardData(true));
  useSocketEvent("enrollment:approved", () => fetchDashboardData(true));
  useSocketEvent("enrollment:changes_requested", () => fetchDashboardData(true));
  useSocketEvent("enrollment:rejected", () => fetchDashboardData(true));
  useSocketEvent("enrollment:reviewed", () => fetchDashboardData(true));
  useSocketEvent("enrollment:updated", () => fetchDashboardData(true));
  useSocketEvent("document:verified", () => fetchDashboardData(true));
  useSocketEvent("grade_report:verified", () => fetchDashboardData(true));
  useSocketEvent("grade_report:evaluated", () => fetchDashboardData(true));
  useSocketEvent("scholar:archived", () => fetchDashboardData(true));
  useSocketEvent("scholar:restored", () => fetchDashboardData(true));
  useSocketEvent("appeal:submitted", () => fetchDashboardData(true));
  useSocketEvent("appeal:reviewed", () => fetchDashboardData(true));
  useSocketEvent("disbursement:updated", () => fetchDashboardData(true));
  useSocketEvent("disbursement:or_uploaded", () => fetchDashboardData(true));
  useSocketEvent("disbursement:settled", () => fetchDashboardData(true));
  useSocketEvent("meeting:scheduled", () => fetchDashboardData(true));
  useSocketEvent("meeting:cancelled", () => fetchDashboardData(true));
  useSocketEvent("meeting:rescheduled", () => fetchDashboardData(true));
  useSocketEvent("message:received", () => fetchDashboardData(true));
  useSocketEvent("chat:new_message", () => fetchDashboardData(true));
  useSocketEvent("announcement:created", () => fetchDashboardData(true));
  useSocketEvent("notification:received", () => fetchDashboardData(true));

  return {
    loading,
    refreshing,
    loadError,
    data,
    refetch: fetchDashboardData,
    refresh,
  };
}

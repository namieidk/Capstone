"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { getScholarDashboardSummary, type ScholarDashboardResponse } from "@/lib/api/scholar-dashboard";

export function useScholarDashboardData() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [data, setData] = useState<ScholarDashboardResponse | null>(null);

  const fetchDashboardData = useCallback(async (silent = false, forceRefresh = false) => {
    if (!silent) setLoading(true);
    if (forceRefresh) setRefreshing(true);
    setLoadError("");
    try {
      const [res] = await Promise.all([
        getScholarDashboardSummary(forceRefresh),
        forceRefresh ? new Promise<void>((r) => setTimeout(r, 400)) : Promise.resolve(),
      ]);
      setData(res);
    } catch (err) {
      console.error("Failed to load scholar dashboard data:", err);
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

  // Real-time socket events for live sync
  useSocketEvent("baseline:frozen", () => fetchDashboardData(true));
  useSocketEvent("grade_report:evaluated", () => fetchDashboardData(true));
  useSocketEvent("grade_report:verified", () => fetchDashboardData(true));
  useSocketEvent("grade_report:appeal_decided", () => fetchDashboardData(true));
  useSocketEvent("scholar:archived", () => fetchDashboardData(true));
  useSocketEvent("scholar:restored", () => fetchDashboardData(true));
  useSocketEvent("enrollment:updated", () => fetchDashboardData(true));
  useSocketEvent("disbursement:updated", () => fetchDashboardData(true));
  useSocketEvent("disbursement:settled", () => fetchDashboardData(true));
  useSocketEvent("message:received", () => fetchDashboardData(true));
  useSocketEvent("chat:new_message", () => fetchDashboardData(true));
  useSocketEvent("meeting:scheduled", () => fetchDashboardData(true));
  useSocketEvent("meeting:cancelled", () => fetchDashboardData(true));
  useSocketEvent("meeting:rescheduled", () => fetchDashboardData(true));
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

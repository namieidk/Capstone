"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { getScholarDashboardSummary, type ScholarDashboardResponse } from "@/lib/api/scholar-dashboard";

export function useScholarDashboardData() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [data, setData] = useState<ScholarDashboardResponse | null>(null);

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError("");
    try {
      const res = await getScholarDashboardSummary();
      setData(res);
    } catch (err) {
      console.error("Failed to load scholar dashboard data:", err);
      setLoadError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Real-time socket events for live sync
  useSocketEvent("baseline:frozen", () => fetchDashboardData(true));
  useSocketEvent("grade_report:evaluated", () => fetchDashboardData(true));
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
    loadError,
    data,
    refetch: fetchDashboardData,
  };
}

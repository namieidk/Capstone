"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { type GrantorDashboardResponse, getGrantorDashboardData } from "@/lib/api/grantor-dashboard";

export function useGrantorDashboardData() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [data, setData] = useState<GrantorDashboardResponse | null>(null);

  const fetchDashboardData = useCallback(async (silent = false, forceRefresh = false) => {
    if (!silent) setLoading(true);
    if (forceRefresh) setRefreshing(true);
    setLoadError("");
    try {
      const [res] = await Promise.all([
        getGrantorDashboardData(forceRefresh),
        forceRefresh ? new Promise<void>((r) => setTimeout(r, 400)) : Promise.resolve(),
      ]);
      setData(res);
    } catch (err) {
      console.error("Failed to load grantor dashboard data:", err);
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

  // Comprehensive Real-time Socket.IO Subscriptions for Grantor Dashboard
  useSocketEvent("application:stage_updated", () => fetchDashboardData(true));
  useSocketEvent("application:new_submission", () => fetchDashboardData(true));
  useSocketEvent("application:endorsed", () => fetchDashboardData(true));
  useSocketEvent("appeal:submitted", () => fetchDashboardData(true));
  useSocketEvent("appeal:reviewed", () => fetchDashboardData(true));
  useSocketEvent("academic_appeal:submitted", () => fetchDashboardData(true));
  useSocketEvent("academic_appeal:reviewed", () => fetchDashboardData(true));
  useSocketEvent("grade_report:appealed", () => fetchDashboardData(true));
  useSocketEvent("grade_report:appeal_decided", () => fetchDashboardData(true));
  useSocketEvent("disbursement:authorized", () => fetchDashboardData(true));
  useSocketEvent("disbursement:updated", () => fetchDashboardData(true));
  useSocketEvent("disbursement:settled", () => fetchDashboardData(true));
  useSocketEvent("baseline:frozen", () => fetchDashboardData(true));
  useSocketEvent("grade_report:evaluated", () => fetchDashboardData(true));
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

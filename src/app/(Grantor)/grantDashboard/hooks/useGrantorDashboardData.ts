"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { type GrantorDashboardResponse, getGrantorDashboardData } from "@/lib/api/grantor-dashboard";

export function useGrantorDashboardData() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [data, setData] = useState<GrantorDashboardResponse | null>(null);

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError("");
    try {
      const res = await getGrantorDashboardData();
      setData(res);
    } catch (err) {
      console.error("Failed to load grantor dashboard data:", err);
      setLoadError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Comprehensive Real-time Socket.IO Subscriptions for Grantor Dashboard
  useSocketEvent("application:stage_updated", () => fetchDashboardData(true));
  useSocketEvent("application:new_submission", () => fetchDashboardData(true));
  useSocketEvent("application:endorsed", () => fetchDashboardData(true));
  useSocketEvent("appeal:submitted", () => fetchDashboardData(true));
  useSocketEvent("appeal:reviewed", () => fetchDashboardData(true));
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
    loadError,
    data,
    refetch: fetchDashboardData,
  };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import type { StaffRow } from "@/app/(Admin)/AdminEmployee/components/employee-helpers";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import type { GlobalSettings, SchoolGrading } from "@/lib/api/settings";
import { type AuditLogEntry, getAdminDashboardData } from "@/lib/api/users";

export interface AdminDashboardMetrics {
  totalStaff: number;
  activeStaff: number;
  coordinatorCount: number;
  grantorCount: number;
  adminCount: number;
  totalStudents: number;
  activeScholarsCount: number;
  applicantCount: number;
  totalSchools: number;
  verifiedSchools: number;
  gradeThreshold: number;
}

const DEFAULT_METRICS: AdminDashboardMetrics = {
  totalStaff: 0,
  activeStaff: 0,
  coordinatorCount: 0,
  grantorCount: 0,
  adminCount: 0,
  totalStudents: 0,
  activeScholarsCount: 0,
  applicantCount: 0,
  totalSchools: 0,
  verifiedSchools: 0,
  gradeThreshold: 85,
};

export function useAdminDashboardData() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [metrics, setMetrics] = useState<AdminDashboardMetrics>(DEFAULT_METRICS);
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLogEntry[]>([]);
  const [schools, setSchools] = useState<SchoolGrading[]>([]);
  const [settings, setSettings] = useState<GlobalSettings | null>(null);

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError("");
    try {
      const data = await getAdminDashboardData();
      setMetrics(data.metrics);
      setStaff(data.staff as StaffRow[]);
      setRecentLogs(data.recentLogs || []);
      setSchools(data.schools);
      setSettings(data.settings);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
      setLoadError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Live real-time socket subscriptions
  const handleNewLog = useCallback((newLog: AuditLogEntry) => {
    if (!newLog) return;
    setRecentLogs((prev) => {
      if (prev.some((l) => l.log_id === newLog.log_id)) return prev;
      return [newLog, ...prev.slice(0, 5)];
    });
  }, []);

  useSocketEvent<AuditLogEntry>("audit:new_log", handleNewLog);
  useSocketEvent("staff:created", () => fetchDashboardData(true));
  useSocketEvent("user:status_updated", () => fetchDashboardData(true));
  useSocketEvent("user:password_reset", () => fetchDashboardData(true));
  useSocketEvent<GlobalSettings>("settings:updated", (updated) => {
    if (updated) {
      setSettings(updated);
      setMetrics((prev) => ({
        ...prev,
        gradeThreshold: Number(updated.grade_retention_threshold || 85),
      }));
    }
  });

  return {
    loading,
    loadError,
    metrics,
    staff,
    recentLogs,
    schools,
    settings,
    refetch: fetchDashboardData,
  };
}

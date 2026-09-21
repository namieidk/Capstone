"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { type AuditLogEntry as AuditLog, getAuditLogs } from "@/lib/api/users";
import { AuditLogsHeader } from "./components/AuditLogsHeader";
import { getDisplayName } from "./components/audit-helpers";
import { DetailDialog } from "./components/DetailDialog";
import { LogsTable } from "./components/LogsTable";

const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const [pageLogs, setPageLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [knownActions, setKnownActions] = useState<string[]>([]);
  const [knownRoles, setKnownRoles] = useState<string[]>([]);

  const fetchLogs = useCallback(async (p: number) => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await getAuditLogs({ page: p, limit: PAGE_SIZE });
      setPageLogs(res.logs);
      setTotal(res.total ?? res.logs.length);
      setKnownActions((prev) => Array.from(new Set([...prev, ...res.logs.map((l) => l.action)])).sort());
      setKnownRoles((prev) => Array.from(new Set([...prev, ...res.logs.map((l) => l.user.role)])).sort());
    } catch (err) {
      console.error("Failed to load audit logs:", err);
      setLoadError(err instanceof ApiError ? err.message : "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [fetchLogs, page]);

  // Real-time live updates when audit logs are generated across the system
  const handleNewLog = useCallback((newLog: AuditLog) => {
    if (!newLog) return;
    setKnownActions((prev) => Array.from(new Set([...prev, newLog.action])).sort());
    if (newLog.user?.role) {
      setKnownRoles((prev) => Array.from(new Set([...prev, newLog.user.role])).sort());
    }
    setTotal((t) => t + 1);
    setPageLogs((prev) => {
      if (prev.some((l) => l.log_id === newLog.log_id)) return prev;
      return [newLog, ...prev.slice(0, PAGE_SIZE - 1)];
    });
  }, []);

  useSocketEvent<AuditLog>("audit:new_log", handleNewLog);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pageLogs.filter((log) => {
      if (actionFilter !== "all" && log.action !== actionFilter) return false;
      if (roleFilter !== "all" && log.user.role !== roleFilter) return false;
      if (q === "") return true;
      return (
        log.details.toLowerCase().includes(q) ||
        log.user.email.toLowerCase().includes(q) ||
        getDisplayName(log).toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        String(log.log_id).includes(q) ||
        String(log.user_id).includes(q)
      );
    });
  }, [pageLogs, query, actionFilter, roleFilter]);

  const hasActiveFilters = query.trim() !== "" || actionFilter !== "all" || roleFilter !== "all";

  function resetFilters() {
    setQuery("");
    setActionFilter("all");
    setRoleFilter("all");
    setPage(1);
  }

  function handleFilterChange(setter: (v: string) => void) {
    return (v: string) => {
      setter(v);
      setPage(1);
    };
  }

  return (
    <div className="min-h-full bg-[#faf8f5]">
      <AuditLogsHeader
        searchQuery={query}
        onSearchChange={(v) => {
          setQuery(v);
          setPage(1);
        }}
      />

      <div className="px-5 pb-24 md:px-10">
        <LogsTable
          logs={filtered}
          totalEvents={total}
          hasActiveFilters={hasActiveFilters}
          loading={loading}
          loadError={loadError}
          onRetry={() => fetchLogs(page)}
          actions={knownActions}
          roles={knownRoles}
          actionFilter={actionFilter}
          roleFilter={roleFilter}
          onActionChange={handleFilterChange(setActionFilter)}
          onRoleChange={handleFilterChange(setRoleFilter)}
          onClearFilters={resetFilters}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onSelect={setSelected}
        />
      </div>

      <DetailDialog log={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

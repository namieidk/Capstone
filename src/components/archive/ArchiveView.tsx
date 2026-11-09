"use client";

import { Archive, Building2, GraduationCap, LibraryBig, ScrollText, Users } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import {
  APPLICANT_ARCHIVE_REASONS,
  type ArchivedApplicantProfile,
  type ArchivedProgram,
  type ArchivedScholarProfile,
  type ArchivedSchool,
  type ArchiveEntity,
  type ArchiveSummary,
  archiveReasonLabel,
  getArchiveSummary,
  listArchived,
  PROGRAM_ARCHIVE_REASONS,
  SCHOLAR_ARCHIVE_REASONS,
  SCHOOL_ARCHIVE_REASONS,
} from "@/lib/api/archive";
import { ApplicantArchiveTable } from "./ApplicantArchiveTable";
import { ArchiveDetailDrawer } from "./ArchiveDetailDrawer";
import { ArchivePagination } from "./ArchivePagination";
import { ProgramArchiveTable } from "./ProgramArchiveTable";
import { ScholarArchiveTable } from "./ScholarArchiveTable";
import { SchoolArchiveTable } from "./SchoolArchiveTable";
import type { ArchivedItem } from "./types";

const ENTITY_TABS: { value: ArchiveEntity; label: string; icon: ReactNode }[] = [
  { value: "scholar", label: "Scholars", icon: <GraduationCap className="size-4" /> },
  { value: "applicant", label: "Applicants", icon: <Users className="size-4" /> },
  { value: "school", label: "Schools", icon: <Building2 className="size-4" /> },
  { value: "program", label: "Programs", icon: <LibraryBig className="size-4" /> },
];

const REASONS_BY_ENTITY: Record<ArchiveEntity, readonly string[]> = {
  scholar: SCHOLAR_ARCHIVE_REASONS,
  applicant: APPLICANT_ARCHIVE_REASONS,
  school: SCHOOL_ARCHIVE_REASONS,
  program: PROGRAM_ARCHIVE_REASONS,
};

export function ArchiveView() {
  const [entity, setEntity] = useState<ArchiveEntity>("scholar");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [reason, setReason] = useState("ALL");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ArchivedItem[]>([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [summary, setSummary] = useState<ArchiveSummary | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<ArchivedItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounce the search box so we don't spam the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleEntityChange = (value: ArchiveEntity) => {
    setEntity(value);
    setPage(1);
    setReason("ALL");
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    setPage(1);
  };

  useEffect(() => {
    void refreshKey; // referenced so the effect re-runs when a refetch is requested
    let alive = true;
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const result = await listArchived({
          entity,
          reason,
          search: debouncedSearch,
          page,
          limit: 10,
        });
        if (!alive) return;
        setRows(result.data.map((row) => ({ kind: entity, row }) as ArchivedItem));
        setPagination({ total: result.total, totalPages: result.totalPages, page: result.page });
      } catch (err) {
        if (!alive) return;
        setRows([]);
        setPagination({ total: 0, totalPages: 1, page: 1 });
        setLoadError(err instanceof ApiError ? err.message : "Failed to load archived records.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    void load();
    return () => {
      alive = false;
    };
  }, [entity, debouncedSearch, reason, page, refreshKey]);

  useEffect(() => {
    void entity;
    void refreshKey; // referenced so the effect re-runs when a refetch is requested or tab changes
    let alive = true;
    const load = async () => {
      try {
        const result = await getArchiveSummary();
        if (alive) setSummary(result);
      } catch {
        if (alive) setSummary(null);
      }
    };
    void load();
    return () => {
      alive = false;
    };
  }, [entity, refreshKey]);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Real-time socket subscriptions so archive list & tab badge counts update immediately
  useSocketEvent("scholar:archived", triggerRefresh);
  useSocketEvent("scholar:restored", triggerRefresh);
  useSocketEvent("applicant:archived", triggerRefresh);
  useSocketEvent("applicant:restored", triggerRefresh);
  useSocketEvent("school:updated", triggerRefresh);
  useSocketEvent("school:deleted", triggerRefresh);
  useSocketEvent("school:created", triggerRefresh);
  useSocketEvent("program:updated", triggerRefresh);
  useSocketEvent("program:deleted", triggerRefresh);
  useSocketEvent("program:created", triggerRefresh);
  useSocketEvent("application:stage_updated", triggerRefresh);
  useSocketEvent("grade_report:appeal_decided", triggerRefresh);

  const tabCount = (value: ArchiveEntity): number | null => {
    if (!summary) return null;
    switch (value) {
      case "scholar":
        return summary.totals.scholars;
      case "applicant":
        return summary.totals.applicants;
      case "school":
        return summary.totals.schools;
      case "program":
        return summary.totals.programs;
    }
  };

  const entityLabel: Record<ArchiveEntity, string> = {
    scholar: "scholars",
    applicant: "applicants",
    school: "schools",
    program: "programs",
  };

  return (
    <div className="min-h-full bg-[#faf8f5]">
      <PageHeader
        title="Archive"
        subtitle="Records removed from active use. Nothing is deleted — archived data stays linked and auditable."
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search archived records..."
      />

      <div className="px-5 pt-4 pb-24 md:px-10 space-y-4">
        <Tabs
          value={entity}
          onValueChange={(value) => handleEntityChange(value as ArchiveEntity)}
          className="mt-5 w-full space-y-4"
        >
          <TabsList className="grid w-full sm:w-210 grid-cols-4">
            {ENTITY_TABS.map((tab) => {
              const count = tabCount(tab.value);
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs gap-1.5 font-semibold">
                  {tab.icon}
                  {tab.label}
                  {typeof count === "number" && (
                    <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-[10px]">
                      {count}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="scholar" className="space-y-4">
            <ArchiveToolbar
              total={pagination.total}
              entityLabel={entityLabel.scholar}
              reason={reason}
              onReasonChange={handleReasonChange}
              reasons={REASONS_BY_ENTITY.scholar}
            />
            <ScholarArchiveTable
              rows={rows.filter((r) => r.kind === "scholar").map((r) => r.row as ArchivedScholarProfile)}
              loading={loading}
              loadError={loadError}
              onRetry={() => setRefreshKey((k) => k + 1)}
              onSelect={(row) => {
                setSelected({ kind: "scholar", row });
                setDrawerOpen(true);
              }}
              searchQuery={search}
            />
            <ArchivePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={setPage}
              label="scholars"
            />
          </TabsContent>

          <TabsContent value="applicant" className="space-y-4">
            <ArchiveToolbar
              total={pagination.total}
              entityLabel={entityLabel.applicant}
              reason={reason}
              onReasonChange={handleReasonChange}
              reasons={REASONS_BY_ENTITY.applicant}
            />
            <ApplicantArchiveTable
              rows={rows.filter((r) => r.kind === "applicant").map((r) => r.row as ArchivedApplicantProfile)}
              loading={loading}
              loadError={loadError}
              onRetry={() => setRefreshKey((k) => k + 1)}
              onSelect={(row) => {
                setSelected({ kind: "applicant", row });
                setDrawerOpen(true);
              }}
              searchQuery={search}
            />
            <ArchivePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={setPage}
              label="applicants"
            />
          </TabsContent>

          <TabsContent value="school" className="space-y-4">
            <ArchiveToolbar
              total={pagination.total}
              entityLabel={entityLabel.school}
              reason={reason}
              onReasonChange={handleReasonChange}
              reasons={REASONS_BY_ENTITY.school}
            />
            <SchoolArchiveTable
              rows={rows.filter((r) => r.kind === "school").map((r) => r.row as ArchivedSchool)}
              loading={loading}
              loadError={loadError}
              onRetry={() => setRefreshKey((k) => k + 1)}
              onSelect={(row) => {
                setSelected({ kind: "school", row });
                setDrawerOpen(true);
              }}
              searchQuery={search}
            />
            <ArchivePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={setPage}
              label="schools"
            />
          </TabsContent>

          <TabsContent value="program" className="space-y-4">
            <ArchiveToolbar
              total={pagination.total}
              entityLabel={entityLabel.program}
              reason={reason}
              onReasonChange={handleReasonChange}
              reasons={REASONS_BY_ENTITY.program}
            />
            <ProgramArchiveTable
              rows={rows.filter((r) => r.kind === "program").map((r) => r.row as ArchivedProgram)}
              loading={loading}
              loadError={loadError}
              onRetry={() => setRefreshKey((k) => k + 1)}
              onSelect={(row) => {
                setSelected({ kind: "program", row });
                setDrawerOpen(true);
              }}
              searchQuery={search}
            />
            <ArchivePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={setPage}
              label="programs"
            />
          </TabsContent>
        </Tabs>
      </div>

      <ArchiveDetailDrawer
        item={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onRestored={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}

interface ArchiveToolbarProps {
  total: number;
  entityLabel: string;
  reason: string;
  onReasonChange: (reason: string) => void;
  reasons: readonly string[];
}

function ArchiveToolbar({ total, entityLabel, reason, onReasonChange, reasons }: ArchiveToolbarProps) {
  return (
    <Card className="rounded-2xl! border-line bg-white shadow-va-sm">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ScrollText className="size-4 text-navy" />
          <span>
            <span className="font-semibold text-navy">{total}</span> archived {entityLabel} · Nothing is deleted, only
            archived.
          </span>
        </div>

        <Select value={reason} onValueChange={onReasonChange}>
          <SelectTrigger
            aria-label="Filter by reason"
            className="h-9 w-48 rounded-full border-line bg-tint/50 text-xs font-medium text-navy data-[placeholder]:text-muted-foreground"
          >
            <Archive className="mr-1 size-3.5 text-navy" />
            <SelectValue placeholder="All reasons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">
              All reasons
            </SelectItem>
            {reasons.map((r) => (
              <SelectItem key={r} value={r} className="text-xs">
                {archiveReasonLabel(r)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

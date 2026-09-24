"use client";

import { Eye, RotateCcw, ScrollText } from "lucide-react";
import { ApplicantsPagination } from "@/app/(Coordinator)/CoordinatorApplicants/components/ApplicantsPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AuditLogEntry as AuditLog } from "@/lib/api/users";
import { formatActionLabel, formatDateTime, getActionColors, getDisplayName } from "./audit-helpers";

interface LogsTableProps {
  logs: AuditLog[];
  totalEvents: number;
  hasActiveFilters: boolean;
  loading: boolean;
  loadError: string;
  onRetry: () => void;
  onClearFilters: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelect: (log: AuditLog) => void;
}

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5", "row-6"];

const HEAD = "text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!";

function ActionBadge({ action }: { action: string }) {
  const colors = getActionColors(action);
  const label = formatActionLabel(action);
  return (
    <Badge
      className="h-6 max-w-48 gap-1.5 px-2.5 text-xs!"
      style={{ background: colors.background, color: colors.color }}
      title={label}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      <span className="truncate">{label}</span>
    </Badge>
  );
}

export function LogsTable({
  logs,
  totalEvents,
  hasActiveFilters,
  loading,
  loadError,
  onRetry,
  onClearFilters,
  currentPage,
  totalPages,
  onPageChange,
  onSelect,
}: LogsTableProps) {
  return (
    <Card className="mt-5 rounded-[18px]! shadow-va-sm">
      <CardHeader>
        <p className="text-sm text-muted-foreground">
          {!loading &&
            !loadError &&
            (hasActiveFilters
              ? `${logs.length} ${logs.length === 1 ? "match" : "matches"} on this page`
              : `${totalEvents} total ${totalEvents === 1 ? "event" : "events"}`)}
        </p>
      </CardHeader>

      <CardContent className="px-0!">
        {loading ? (
          <div className="divide-y divide-line px-6 py-2">
            {SKELETON_ROWS.map((key) => (
              <div key={key} className="flex items-center gap-4 py-4">
                <Skeleton className="h-3.5 w-10 shrink-0" />
                <Skeleton className="h-6 w-28 shrink-0 rounded-full" />
                <Skeleton className="h-3.5 w-40 shrink-0" />
                <Skeleton className="hidden h-3.5 flex-1 md:block" />
                <Skeleton className="ml-auto size-9 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <ScrollText className="size-10 text-muted-foreground" />
            <div>
              <p className="text-base font-semibold">Could not load audit logs</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
            </div>
            <Button type="button" className="h-11 px-5 text-sm!" onClick={onRetry}>
              <RotateCcw className="size-4" />
              Try again
            </Button>
          </div>
        ) : (
          <>
            <Table className="text-sm!">
              <TableHeader>
                <TableRow>
                  <TableHead className={`${HEAD} pl-6`}>ID</TableHead>
                  <TableHead className={HEAD}>Action</TableHead>
                  <TableHead className={HEAD}>User</TableHead>
                  <TableHead className={`${HEAD} hidden md:table-cell`}>Timestamp</TableHead>
                  <TableHead className={`${HEAD} pr-6`}>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.log_id} className="cursor-pointer" onClick={() => onSelect(log)}>
                    <TableCell className="py-3 pl-6 text-center! text-sm tabular-nums text-muted-foreground">
                      #{log.log_id}
                    </TableCell>
                    <TableCell className="py-3 text-center!">
                      <ActionBadge action={log.action} />
                    </TableCell>
                    <TableCell className="py-3 text-center!">
                      <p className="mx-auto max-w-52 truncate text-sm font-semibold" title={getDisplayName(log)}>
                        {getDisplayName(log)}
                      </p>
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap py-3 text-center! text-sm tabular-nums md:table-cell">
                      {formatDateTime(log.created_at)}
                    </TableCell>
                    <TableCell className="py-3 pr-6 text-center!">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`View log ${log.log_id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(log);
                        }}
                      >
                        <Eye className="size-4.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {logs.length === 0 && (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <ScrollText className="size-10 text-muted-foreground" />
                <div>
                  <p className="text-base font-semibold">No audit logs found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasActiveFilters
                      ? "Try a different search term or clear the filters."
                      : "Activity will show up here as people use the platform."}
                  </p>
                </div>
                {hasActiveFilters && (
                  <Button type="button" variant="outline" className="h-10 text-sm!" onClick={onClearFilters}>
                    <RotateCcw className="size-4" />
                    Clear filters
                  </Button>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <ApplicantsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

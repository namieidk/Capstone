"use client";

import { ChevronLeft, ChevronRight, Eye, RotateCcw, ScrollText } from "lucide-react";
import type { CSSProperties } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AuditLogEntry as AuditLog } from "@/lib/api/users";
import { formatActionLabel, formatDateTime, getActionVariant, getDisplayName } from "./audit-helpers";

interface LogsTableProps {
  logs: AuditLog[];
  totalEvents: number;
  hasActiveFilters: boolean;
  loading: boolean;
  loadError: string;
  onRetry: () => void;
  actions: string[];
  roles: string[];
  actionFilter: string;
  roleFilter: string;
  onActionChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onClearFilters: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelect: (log: AuditLog) => void;
}

// Explicit navy/white styling so the active page is unmistakable
// regardless of the active button variant tokens.
const ACTIVE_PAGE_STYLE: CSSProperties = {
  background: "var(--navy)",
  borderColor: "var(--navy)",
  color: "#ffffff",
};

const CONTROL_CLASSES = "h-11 border-line bg-card! text-sm shadow-xs";
const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5", "row-6"];

function pageWindow(current: number, total: number): number[] {
  return Array.from({ length: total }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === total || Math.abs(n - current) <= 1,
  );
}

export function LogsTable({
  logs,
  totalEvents,
  hasActiveFilters,
  loading,
  loadError,
  onRetry,
  actions,
  roles,
  actionFilter,
  roleFilter,
  onActionChange,
  onRoleChange,
  onClearFilters,
  currentPage,
  totalPages,
  onPageChange,
  onSelect,
}: LogsTableProps) {
  const pages = pageWindow(currentPage, totalPages);

  return (
    <Card className="mt-5 rounded-[18px]! shadow-va-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {!loading &&
              !loadError &&
              (hasActiveFilters ? (
                <>
                  {logs.length} {logs.length === 1 ? "match" : "matches"} on this page
                </>
              ) : (
                <>{totalEvents} total events</>
              ))}
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <Select value={actionFilter} onValueChange={onActionChange}>
              <SelectTrigger size="lg" className={`${CONTROL_CLASSES} w-full sm:w-44`} aria-label="Filter by action">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {actions.map((a) => (
                  <SelectItem key={a} value={a} className="text-sm!">
                    {formatActionLabel(a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={onRoleChange}>
              <SelectTrigger size="lg" className={`${CONTROL_CLASSES} w-full sm:w-36`} aria-label="Filter by role">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r} value={r} className="text-sm!">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button type="button" variant="ghost" className="h-11 px-3 text-sm!" onClick={onClearFilters}>
                <RotateCcw className="size-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
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
                <Skeleton className="h-3.5 w-32 shrink-0" />
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
                  <TableHead className="pl-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    ID
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Action
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    User
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Details
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Timestamp
                  </TableHead>
                  <TableHead className="pr-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.log_id} className="cursor-pointer" onClick={() => onSelect(log)}>
                    <TableCell className="py-3 pl-6 text-center! font-semibold tabular-nums">#{log.log_id}</TableCell>
                    <TableCell className="py-3 text-center!">
                      <Badge
                        variant={getActionVariant(log.action)}
                        className="h-6 w-48 justify-center truncate px-2.5 text-xs!"
                        title={formatActionLabel(log.action)}
                      >
                        {formatActionLabel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-center!">
                      <p className="mx-auto max-w-52 truncate text-sm font-medium" title={getDisplayName(log)}>
                        {getDisplayName(log)}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 text-center!">
                      <p className="mx-auto max-w-72 truncate text-sm text-muted-foreground md:max-w-96">
                        {log.details}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 text-center! text-sm whitespace-nowrap tabular-nums">
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
                  <p className="text-base font-semibold">No audit logs on this page match your filters</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different search term, clear the filters, or turn the page.
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
              <div className="flex flex-wrap items-center justify-end gap-2 px-6 pt-4 pb-5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 gap-1.5 px-3.5 text-sm!"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                  Prev
                </Button>
                {pages.map((n, idx) => (
                  <span key={n} className="flex items-center gap-2">
                    {idx > 0 && pages[idx - 1] !== n - 1 && (
                      <span className="px-1 text-sm text-muted-foreground">…</span>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 min-w-9 text-sm!"
                      style={n === currentPage ? ACTIVE_PAGE_STYLE : undefined}
                      onClick={() => onPageChange(n)}
                      aria-label={`Go to page ${n}`}
                      aria-current={n === currentPage ? "page" : undefined}
                    >
                      {n}
                    </Button>
                  </span>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 gap-1.5 px-3.5 text-sm!"
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

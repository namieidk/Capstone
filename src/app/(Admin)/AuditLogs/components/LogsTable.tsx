"use client";

import { Check, ChevronLeft, ChevronRight, Eye, ListFilter, RotateCcw, ScrollText, Users } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5", "row-6"];

// Same shape as EmployeeTable's RoleBadge/StatusBadge — fixed-width,
// centered, colored via explicit background/color rather than a shadcn
// Badge variant, so it reads as the same badge language site-wide.
function ActionBadge({ action }: { action: string }) {
  const colors = getActionColors(action);
  return (
    <Badge
      className="mx-auto h-6 w-fit max-w-48 justify-center truncate px-3 text-xs! font-medium!"
      style={{ background: colors.background, color: colors.color }}
      title={formatActionLabel(action)}
    >
      {formatActionLabel(action)}
    </Badge>
  );
}

interface FilterDropdownProps {
  label: string;
  icon: React.ElementType;
  value: string;
  options: string[];
  formatOption?: (option: string) => string;
  onChange: (value: string) => void;
}

// Same round amber icon-button + checklist pattern as EmployeeTable's role
// filter, reused here for both the Action and Role filters.
function FilterDropdown({ label, icon: Icon, value, options, formatOption, onChange }: FilterDropdownProps) {
  const isActive = value !== "all";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-full bg-amber shadow-xs hover:bg-[#d9a316]"
          aria-label={label}
        >
          <Icon className="size-4 text-navy" />
          {isActive && <span className="absolute -top-0.5 -right-0.5 size-2.25 rounded-full border-2 border-white bg-navy" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56!">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => onChange("all")}
          className={`text-sm! ${value === "all" ? "bg-tint font-semibold text-navy" : "text-[#4a4a45]"}`}
        >
          <span className="flex-1">All</span>
          {value === "all" && <Check className="size-4 text-navy" />}
        </DropdownMenuItem>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <DropdownMenuItem
              key={opt}
              onSelect={() => onChange(opt)}
              className={`text-sm! ${active ? "bg-tint font-semibold text-navy" : "text-[#4a4a45]"}`}
            >
              <span className="flex-1">{formatOption ? formatOption(opt) : opt}</span>
              {active && <Check className="size-4 text-navy" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
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
            <FilterDropdown
              label="Filter by action"
              icon={ListFilter}
              value={actionFilter}
              options={actions}
              formatOption={formatActionLabel}
              onChange={onActionChange}
            />
            <FilterDropdown
              label="Filter by role"
              icon={Users}
              value={roleFilter}
              options={roles}
              onChange={onRoleChange}
            />
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
              <p className="mt-1 text-sm font-medium text-[#8a3a2e]">{loadError}</p>
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
                  <TableHead className="pl-6 text-center! text-xs font-semibold! tracking-wide text-[#8a8a84]!">
                    ID
                  </TableHead>
                  <TableHead className="text-center! text-xs font-semibold! tracking-wide text-[#8a8a84]!">
                    Action
                  </TableHead>
                  <TableHead className="text-center! text-xs font-semibold! tracking-wide text-[#8a8a84]!">
                    User
                  </TableHead>
                  <TableHead className="text-center! text-xs font-semibold! tracking-wide text-[#8a8a84]!">
                    Details
                  </TableHead>
                  <TableHead className="text-center! text-xs font-semibold! tracking-wide text-[#8a8a84]!">
                    Timestamp
                  </TableHead>
                  <TableHead className="pr-6 text-center! text-xs font-semibold! tracking-wide text-[#8a8a84]!">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow
                    key={log.log_id}
                    className="cursor-pointer transition-colors hover:bg-tint/70"
                    onClick={() => onSelect(log)}
                  >
                    <TableCell className="py-3 pl-6 text-center! text-xs font-medium tabular-nums text-muted-foreground">
                      #{log.log_id}
                    </TableCell>
                    <TableCell className="py-3 text-center!">
                      <ActionBadge action={log.action} />
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
                        variant="outline"
                        size="icon"
                        className="size-9 rounded-full"
                        aria-label={`View log ${log.log_id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(log);
                        }}
                      >
                        <Eye className="size-4 text-[#7a7a74]" />
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
              <div className="flex items-center justify-end gap-4 px-6 pt-4 pb-5">
                <p className="text-sm text-muted-foreground tabular-nums">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
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
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
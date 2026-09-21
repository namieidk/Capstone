"use client";

import { ChevronLeft, ChevronRight, Clock, Eye, FileUp, History, Lock, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PendingBaselineItem } from "@/lib/api/baseline";

interface BaselinePendingQueueProps {
  items: PendingBaselineItem[];
  loading: boolean;
  onSelectScholar: (scholarProfileId: number) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

type FilterStatus = "ALL" | "PENDING_COORDINATOR_REVIEW" | "PENDING_PROSPECTUS" | "BASELINE_FROZEN";

const PAGE_SIZE = 8;
const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export function BaselinePendingQueue({
  items,
  loading,
  onSelectScholar,
  searchQuery = "",
  onSearchChange,
}: BaselinePendingQueueProps) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const q = searchQuery.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !q ||
        `${item.first_name} ${item.last_name}`.toLowerCase().includes(q) ||
        item.student_number?.toLowerCase().includes(q) ||
        item.course_of_study?.toLowerCase().includes(q) ||
        item.school_name?.toLowerCase().includes(q);

      const matchesFilter = filter === "ALL" || item.academic_baseline_status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [items, q, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getStatusBadge = (status: string, item?: PendingBaselineItem) => {
    switch (status) {
      case "BASELINE_FROZEN": {
        const frozenBy = item?.prospectus?.frozen_by_employee;
        const roleLabel = frozenBy?.user?.role
          ? ` (${frozenBy.user.role.charAt(0) + frozenBy.user.role.slice(1).toLowerCase()})`
          : "";
        return (
          <div className="flex flex-col items-center">
            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 gap-1 text-xs font-semibold py-0.5">
              <Lock className="w-3 h-3 text-emerald-600" /> Frozen & Verified
            </Badge>
            {frozenBy && (
              <span className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
                by {frozenBy.first_name} {frozenBy.last_name}
                {roleLabel}
              </span>
            )}
          </div>
        );
      }
      case "PENDING_COORDINATOR_REVIEW":
        return (
          <Badge className="bg-amber-50 text-amber-900 border-amber-300 gap-1 text-xs font-semibold py-0.5 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" /> Ready for Audit
          </Badge>
        );
      case "PENDING_HISTORICAL_CCG":
        return (
          <Badge className="bg-blue-50 text-blue-900 border-blue-300 gap-1 text-xs font-semibold py-0.5">
            <History className="w-3 h-3 text-blue-600" /> Awaiting CCG
          </Badge>
        );
      case "PENDING_PROSPECTUS":
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-300 gap-1 text-xs font-medium py-0.5">
            <FileUp className="w-3 h-3 text-slate-500" /> Draft Ingestion
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs font-medium py-0.5">
            {status}
          </Badge>
        );
    }
  };

  const pendingCount = items.filter((i) => i.academic_baseline_status === "PENDING_COORDINATOR_REVIEW").length;

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {onSearchChange ? (
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search scholar, course, school..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 w-full rounded-xl border-line bg-white pl-9 pr-8 text-xs placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
            <SelectTrigger className="h-9 w-48 sm:w-52 rounded-xl border-line bg-white text-xs font-semibold">
              <SelectValue placeholder="Filter Baseline Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Baselines ({items.length})</SelectItem>
              <SelectItem value="PENDING_COORDINATOR_REVIEW">Ready for Audit ({pendingCount})</SelectItem>
              <SelectItem value="PENDING_PROSPECTUS">Draft Ingestion</SelectItem>
              <SelectItem value="BASELINE_FROZEN">Locked Baselines</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table Card matching ActiveScholars styling */}
      <Card className="rounded-[18px]! border-line bg-white shadow-va-sm">
        <CardContent className="px-0!">
          {loading ? (
            <div className="divide-y divide-line px-6 py-2">
              {SKELETON_ROWS.map((key) => (
                <div key={key} className="flex items-center gap-4 py-4">
                  <div className="w-48 shrink-0">
                    <Skeleton className="mb-2 h-3.5" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-4 w-28 shrink-0" />
                  <Skeleton className="h-4 w-32 shrink-0" />
                  <Skeleton className="h-4 w-20 shrink-0" />
                  <Skeleton className="h-6 w-28 shrink-0 rounded-full" />
                  <Skeleton className="ml-auto size-9 shrink-0 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <Table className="text-sm!">
                <TableHeader>
                  <TableRow className="border-b border-line hover:bg-transparent">
                    <TableHead className="pl-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Scholar
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Institution
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Degree Program
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Curriculum Units
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Status
                    </TableHead>
                    <TableHead className="pr-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-36 text-center text-sm text-muted-foreground">
                        {q ? `No scholars match "${searchQuery}".` : "No prospectus audit records found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((item) => {
                      const fullName = `${item.first_name} ${item.last_name}`;
                      const totalUnits = item.prospectus?.total_units || 0;

                      return (
                        <TableRow
                          key={item.profile_id}
                          onClick={() => onSelectScholar(item.profile_id)}
                          className="cursor-pointer transition-colors hover:bg-[#faf8f5]"
                        >
                          <TableCell className="whitespace-normal! py-4 pl-6 text-center!">
                            <p className="text-[0.92rem] font-bold text-navy">{fullName}</p>
                            <p className="mt-0.5 text-xs text-[#9a9a94] font-mono">ID: {item.student_number || "—"}</p>
                          </TableCell>

                          <TableCell className="py-4 text-center! text-xs font-medium text-navy/80">
                            {item.school_name || "Unassigned"}
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            <p className="text-xs font-medium text-navy/80">{item.course_of_study || "—"}</p>
                            {item.current_year_level && (
                              <p className="mt-0.5 text-[10px] text-[#9a9a94]">Year {item.current_year_level}</p>
                            )}
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            <span className="font-semibold text-navy tabular-nums">
                              {totalUnits > 0 ? `${totalUnits} Units` : "—"}
                            </span>
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            {getStatusBadge(item.academic_baseline_status, item)}
                          </TableCell>

                          <TableCell className="py-4 pr-6 text-center!">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="size-9 rounded-full border-line bg-white hover:bg-tint"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectScholar(item.profile_id);
                              }}
                              aria-label={`Audit ${fullName}`}
                            >
                              <Eye className="size-4 text-[#7a7a74]" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {filteredItems.length > 0 && (
                <div className="flex items-center justify-between border-t border-line px-6 py-3.5 text-xs text-muted-foreground">
                  <span>
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                    {Math.min(currentPage * PAGE_SIZE, filteredItems.length)} of {filteredItems.length} prospectus
                    audits
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="size-8 rounded-lg"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                      <Button
                        key={num}
                        variant={num === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(num)}
                        className={`size-8 p-0 text-xs ${
                          num === currentPage ? "bg-navy text-white hover:bg-navy/90" : ""
                        }`}
                      >
                        {num}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="size-8 rounded-lg"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

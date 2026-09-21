"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  HeartHandshake,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GradeReport } from "@/lib/api/documents";

interface GrantorAppealsTabProps {
  items: GradeReport[];
  loading: boolean;
  onSelectAppeal: (report: GradeReport) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

const PAGE_SIZE = 8;
const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export function GrantorAppealsTab({
  items,
  loading,
  onSelectAppeal,
  searchQuery = "",
  onSearchChange,
}: GrantorAppealsTabProps) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("PENDING");

  const q = searchQuery.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const scholar = item.scholar_profile;
      const name = `${scholar?.first_name || ""} ${scholar?.last_name || ""}`.toLowerCase();
      const school = (scholar?.school_name || "").toLowerCase();
      const studentNum = (scholar?.student_number || "").toLowerCase();
      const course = (scholar?.course_of_study || "").toLowerCase();

      const matchesSearch =
        !q || name.includes(q) || school.includes(q) || studentNum.includes(q) || course.includes(q);

      if (filter === "PENDING") return matchesSearch && item.appeal_status === "PENDING_GRANTOR";
      if (filter === "APPROVED") return matchesSearch && item.appeal_status === "APPROVED";
      if (filter === "DENIED") return matchesSearch && item.appeal_status === "DENIED";
      return matchesSearch;
    });
  }, [items, q, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs gap-1 font-semibold py-0.5">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Probation Granted
          </Badge>
        );
      case "DENIED":
        return (
          <Badge className="bg-rose-50 text-rose-800 border-rose-300 text-xs gap-1 font-semibold py-0.5">
            <AlertTriangle className="size-3 text-rose-600" />
            Disqualified
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-xs gap-1 font-semibold py-0.5">
            <Clock className="size-3 text-amber-600" />
            Awaiting Grantor Verdict
          </Badge>
        );
    }
  };

  const pendingCount = items.filter((i) => i.appeal_status === "PENDING_GRANTOR").length;

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {onSearchChange ? (
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search scholar, course, or school..."
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
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-48 sm:w-52 rounded-xl border-line bg-white text-xs font-semibold">
              <SelectValue placeholder="Filter Appeals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending Appeals ({pendingCount})</SelectItem>
              <SelectItem value="ALL">All Appeals ({items.length})</SelectItem>
              <SelectItem value="APPROVED">Probation Approved</SelectItem>
              <SelectItem value="DENIED">Disqualified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table Card */}
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
                  <Skeleton className="h-4 w-24 shrink-0" />
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
                      Academic Term
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Recorded GWA
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Appeal Status
                    </TableHead>
                    <TableHead className="pr-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-36 text-center text-sm text-muted-foreground">
                        {q ? `No appeals match "${searchQuery}".` : "No second chance academic appeals found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((item) => {
                      const scholar = item.scholar_profile;
                      const fullName = `${scholar?.first_name || ""} ${scholar?.last_name || ""}`;
                      const gwa = Number(item.gpa || item.general_average || 0);

                      return (
                        <TableRow
                          key={item.report_id || item.id}
                          onClick={() => onSelectAppeal(item)}
                          className="cursor-pointer transition-colors hover:bg-[#faf8f5]"
                        >
                          <TableCell className="whitespace-normal! py-4 pl-6 text-center!">
                            <div className="flex items-center justify-center gap-2">
                              <HeartHandshake className="size-4 text-[#0a4f42]" />
                              <p className="text-[0.92rem] font-bold text-navy">{fullName}</p>
                            </div>
                            <p className="mt-0.5 text-xs text-[#9a9a94]">
                              {scholar?.school_name} • {scholar?.course_of_study || "Scholar"}
                            </p>
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            <p className="text-xs font-semibold text-navy">
                              AY {item.academic_year} • {item.semester}
                            </p>
                            <p className="mt-0.5 text-[10px] text-[#9a9a94]">
                              Submitted{" "}
                              {item.appeal_submitted_at
                                ? new Date(item.appeal_submitted_at).toLocaleDateString()
                                : "Recently"}
                            </p>
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            <span className="font-bold text-rose-600 text-sm tabular-nums">
                              {gwa > 0 ? gwa.toFixed(2) : "—"}
                            </span>
                            <p className="mt-0.5 text-[10px] text-amber-700 font-semibold">
                              {item.evaluation_flag || "Below Threshold"}
                            </p>
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            <div className="flex flex-col items-center gap-1">{getStatusBadge(item.appeal_status)}</div>
                          </TableCell>

                          <TableCell className="py-4 pr-6 text-center!">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="size-9 rounded-full border-line bg-white hover:bg-tint"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectAppeal(item);
                              }}
                              aria-label={`Review appeal for ${fullName}`}
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
                    {Math.min(currentPage * PAGE_SIZE, filteredItems.length)} of {filteredItems.length} appeals
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

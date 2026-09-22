"use client";

import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock, Eye, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TermEnrollment } from "@/lib/api/enrollment";

interface EnrollmentAuditsTabProps {
  items: TermEnrollment[];
  loading: boolean;
  onSelectAudit: (enrollmentId: number) => void;
  searchQuery?: string;
  filter?: string;
}

const PAGE_SIZE = 8;
const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export function EnrollmentAuditsTab({
  items,
  loading,
  onSelectAudit,
  searchQuery = "",
  filter = "ALL",
}: EnrollmentAuditsTabProps) {
  const [page, setPage] = useState(1);

  const q = searchQuery.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const name = `${item.scholar_profile?.first_name || ""} ${item.scholar_profile?.last_name || ""}`.toLowerCase();
      const school = (item.scholar_profile?.school_name || "").toLowerCase();
      const studentNum = (item.scholar_profile?.student_number || "").toLowerCase();
      const course = (item.scholar_profile?.course_of_study || "").toLowerCase();

      const matchesSearch =
        !q || name.includes(q) || school.includes(q) || studentNum.includes(q) || course.includes(q);

      if (filter === "PENDING")
        return matchesSearch && (item.status === "PENDING_REVIEW" || item.status === "SUBMITTED");
      if (filter === "CHANGES_REQUESTED") return matchesSearch && item.status === "CHANGES_REQUESTED";
      if (filter === "APPROVED") return matchesSearch && item.status === "APPROVED";
      if (filter === "COMPLETED") return matchesSearch && item.status === "COMPLETED";
      if (filter === "REJECTED") return matchesSearch && item.status === "REJECTED";
      return matchesSearch;
    });
  }, [items, q, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs gap-1 font-semibold py-0.5">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Completed
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-blue-50 text-blue-800 border-blue-300 text-xs gap-1 font-semibold py-0.5">
            <CheckCircle2 className="size-3 text-blue-600" />
            Endorsed to Grantor
          </Badge>
        );
      case "CHANGES_REQUESTED":
        return (
          <Badge className="bg-orange-50 text-orange-900 border-orange-300 text-xs gap-1 font-semibold py-0.5">
            <AlertTriangle className="size-3 text-orange-600" />
            Changes Requested
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-50 text-rose-900 border-rose-300 text-xs gap-1 font-semibold py-0.5">
            <X className="size-3 text-rose-600" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-xs gap-1 font-semibold py-0.5">
            <Clock className="size-3 text-amber-600" />
            Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
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
                  <Skeleton className="h-4 w-28 shrink-0" />
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
                      Enrolled Units
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Tuition Balance
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Audit Status
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
                        {q ? `No enrollments match "${searchQuery}".` : "No term enrollment submissions found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((item) => {
                      const fullName = `${item.scholar_profile?.first_name || ""} ${item.scholar_profile?.last_name || ""}`;
                      const hasFlags = item.audit_flags && item.audit_flags.length > 0;

                      return (
                        <TableRow
                          key={item.enrollment_id}
                          onClick={() => onSelectAudit(item.enrollment_id)}
                          className="cursor-pointer transition-colors hover:bg-[#faf8f5]"
                        >
                          <TableCell className="whitespace-normal! py-4 pl-6 text-center!">
                            <p className="text-[0.92rem] font-bold text-navy">{fullName}</p>
                            <p className="mt-0.5 text-xs text-[#9a9a94]">
                              ID: {item.scholar_profile?.student_number || "—"} • {item.scholar_profile?.school_name}
                            </p>
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            <p className="text-xs font-semibold text-navy">
                              AY {item.academic_year} • {item.semester}
                            </p>
                            <p className="mt-0.5 text-[10px] text-[#9a9a94]">Year Level {item.year_level}</p>
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            <span className="font-semibold text-navy tabular-nums">
                              {Number(item.total_units).toFixed(1)} Units
                            </span>
                            <p className="mt-0.5 text-[10px] text-[#9a9a94]">
                              {item.enrolled_subjects?.length || 0} enrolled courses
                            </p>
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            <span className="font-black text-[#0a4f42] tabular-nums">
                              {formatCurrency(Number(item.total_assessment))}
                            </span>
                            {item.assessment_date && (
                              <p className="mt-0.5 text-[10px] text-[#9a9a94]">
                                {new Date(item.assessment_date).toLocaleDateString()}
                              </p>
                            )}
                          </TableCell>

                          <TableCell className="py-4 text-center!">
                            <div className="flex flex-col items-center gap-1">
                              {getStatusBadge(item.status)}
                              {hasFlags && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-900 border-amber-300 text-[10px] gap-1 font-medium"
                                >
                                  <AlertTriangle className="size-2.5 text-amber-600" />
                                  {item.audit_flags?.length} advisory
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-4 pr-6 text-center!">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="size-9 rounded-full border-line bg-white hover:bg-tint"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectAudit(item.enrollment_id);
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
                    {Math.min(currentPage * PAGE_SIZE, filteredItems.length)} of {filteredItems.length} term enrollments
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
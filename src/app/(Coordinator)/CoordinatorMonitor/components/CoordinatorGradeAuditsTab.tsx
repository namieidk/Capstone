"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ScholarDocument } from "@/lib/api/documents";
import { CoordinatorGradeAuditsTableRow } from "./CoordinatorGradeAuditsTableRow";

interface CoordinatorGradeAuditsTabProps {
  items: ScholarDocument[];
  loading: boolean;
  onSelectAudit: (documentId: number) => void;
  searchQuery?: string;
  filter?: string;
}

const PAGE_SIZE = 8;
const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export function CoordinatorGradeAuditsTab({
  items,
  loading,
  onSelectAudit,
  searchQuery = "",
  filter = "ALL",
}: CoordinatorGradeAuditsTabProps) {
  const [page, setPage] = useState(1);

  const q = searchQuery.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const scholar = item.scholar_profile;
      const studentName = `${scholar?.first_name || ""} ${scholar?.last_name || ""}`.toLowerCase();
      const studentNumber = String(scholar?.student_number || "").toLowerCase();
      const course = String(scholar?.course_of_study || "").toLowerCase();
      const school = String(scholar?.school_name || "").toLowerCase();
      const docType = (item.document_type || "").toLowerCase();
      const label = (item.label || "").toLowerCase();
      const confirmed = (item.confirmed_data || item.extracted_data || {}) as Record<string, unknown>;
      const ay = String(confirmed.academic_year || "").toLowerCase();
      const sem = String(confirmed.semester || "").toLowerCase();

      const matchesSearch =
        !q ||
        studentName.includes(q) ||
        studentNumber.includes(q) ||
        course.includes(q) ||
        school.includes(q) ||
        docType.includes(q) ||
        label.includes(q) ||
        ay.includes(q) ||
        sem.includes(q);

      if (filter === "PENDING") {
        return (
          matchesSearch &&
          (item.status === "PENDING" || item.status === "STUDENT_CONFIRMED" || item.status === "PASSED_PRECHECK")
        );
      }
      if (filter === "VERIFIED") return matchesSearch && item.status === "VERIFIED";
      if (filter === "NEEDS_REUPLOAD") return matchesSearch && item.status === "NEEDS_REUPLOAD";
      return matchesSearch;
    });
  }, [items, q, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <Card className="rounded-[18px]! border-line bg-white shadow-va-sm">
        <CardContent className="px-0!">
          {loading ? (
            <div className="divide-y divide-line px-6 py-2">
              {SKELETON_ROWS.map((key) => (
                <div key={key} className="flex items-center gap-4 py-4">
                  <div className="w-56 shrink-0">
                    <Skeleton className="mb-2 h-3.5" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-4 w-28 shrink-0" />
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
                    <TableHead className="pl-6 text-left text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Scholar Name
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Document
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Academic Term
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Upload Date
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
                        {q ? `No grade documents match "${searchQuery}".` : "No pending grade documents found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((item) => (
                      <CoordinatorGradeAuditsTableRow
                        key={item.document_id}
                        item={item}
                        onSelectAudit={onSelectAudit}
                      />
                    ))
                  )}
                </TableBody>
              </Table>

              {filteredItems.length > 0 && (
                <div className="flex items-center justify-between border-t border-line px-6 py-3.5 text-xs text-muted-foreground">
                  <span>
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                    {Math.min(currentPage * PAGE_SIZE, filteredItems.length)} of {filteredItems.length} documents
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
                        size="icon"
                        onClick={() => setPage(num)}
                        className={`size-8 rounded-lg text-xs ${
                          num === currentPage ? "bg-[#0a4f42] text-white" : "border-line"
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
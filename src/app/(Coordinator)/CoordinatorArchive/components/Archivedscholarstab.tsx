"use client";

import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import type { ArchivedScholar } from "@/components/Coordinatorshared";
import { ARCHIVE_STATUS_STYLE } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ArchivedScholarsTabProps {
  scholars: ArchivedScholar[];
  loading: boolean;
  loadError?: string;
  onRetry?: () => void;
  searchQuery?: string;
  statusFilter?: string;
  onSelectScholar: (scholar: ArchivedScholar) => void;
}

const PAGE_SIZE = 8;
const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export function ArchivedScholarsTab({
  scholars,
  loading,
  loadError,
  onRetry,
  searchQuery = "",
  statusFilter = "ALL",
  onSelectScholar,
}: ArchivedScholarsTabProps) {
  const [page, setPage] = useState(1);

  const query = searchQuery.trim().toLowerCase();

  const filtered = useMemo(() => {
    return scholars.filter((a) => {
      const matchesSearch =
        !query ||
        a.name.toLowerCase().includes(query) ||
        a.course.toLowerCase().includes(query) ||
        a.track.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [scholars, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
                  <Skeleton className="h-4 w-24 shrink-0" />
                  <Skeleton className="h-4 w-20 shrink-0" />
                  <Skeleton className="h-4 w-20 shrink-0" />
                  <Skeleton className="h-6 w-24 shrink-0 rounded-full" />
                  <Skeleton className="ml-auto size-9 shrink-0 rounded-full" />
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
              <p className="text-sm font-medium text-[#8a3a2e]">{loadError}</p>
              {onRetry && (
                <Button type="button" variant="outline" className="h-9 px-4 text-xs text-navy" onClick={onRetry}>
                  Retry loading scholars
                </Button>
              )}
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
                      Track
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Joined
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Exited
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
                        {query ? `No scholars match "${searchQuery}".` : "No archived scholars yet."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((a) => (
                      <TableRow
                        key={a.id}
                        onClick={() => onSelectScholar(a)}
                        className="cursor-pointer transition-colors hover:bg-[#faf8f5]"
                      >
                        <TableCell className="whitespace-normal! py-4 pl-6 text-center!">
                          <p className="text-[0.92rem] font-bold text-navy">{a.name}</p>
                          <p className="mt-0.5 text-xs text-[#9a9a94]">{a.course}</p>
                        </TableCell>

                        <TableCell className="py-4 text-center! text-xs font-medium text-navy/80">{a.track}</TableCell>

                        <TableCell className="py-4 text-center! text-xs font-medium text-navy/80">{a.joined}</TableCell>

                        <TableCell className="py-4 text-center! text-xs font-medium text-navy/80">{a.exited}</TableCell>

                        <TableCell className="py-4 text-center!">
                          <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{
                              backgroundColor: ARCHIVE_STATUS_STYLE[a.status]?.bg ?? "#f0fdf4",
                              color: ARCHIVE_STATUS_STYLE[a.status]?.text ?? "#166534",
                              borderColor: `${ARCHIVE_STATUS_STYLE[a.status]?.text ?? "#166534"}33`,
                            }}
                          >
                            <span
                              className="size-1.5 rounded-full"
                              style={{ backgroundColor: ARCHIVE_STATUS_STYLE[a.status]?.text ?? "#166534" }}
                            />
                            {a.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-4 pr-6 text-center!">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-9 rounded-full border-line bg-white hover:bg-tint"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectScholar(a);
                            }}
                            aria-label={`View ${a.name}`}
                          >
                            <Eye className="size-4 text-[#7a7a74]" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {filtered.length > 0 && (
                <div className="flex items-center justify-between border-t border-line px-6 py-3.5 text-xs text-muted-foreground">
                  <span>
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filtered.length)}{" "}
                    of {filtered.length} scholars
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

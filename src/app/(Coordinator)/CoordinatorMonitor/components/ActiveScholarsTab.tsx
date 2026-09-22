"use client";

import { ChevronLeft, ChevronRight, Eye, Search, TrendingDown, TrendingUp, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { ActiveScholar } from "@/components/Coordinatorshared";
import { HEALTH_TAG } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ActiveScholarsTabProps {
  scholars: ActiveScholar[];
  loading: boolean;
  loadError?: string;
  onRetry?: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSelectScholar: (scholar: ActiveScholar) => void;
}

const PAGE_SIZE = 8;
const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export function ActiveScholarsTab({
  scholars,
  loading,
  loadError,
  onRetry,
  searchQuery = "",
  onSearchChange,
  onSelectScholar,
}: ActiveScholarsTabProps) {
  const [page, setPage] = useState(1);
  const [healthFilter, setHealthFilter] = useState<string>("ALL");

  const query = searchQuery.trim().toLowerCase();

  const filtered = useMemo(() => {
    return scholars.filter((sch) => {
      const matchesSearch =
        !query ||
        sch.name.toLowerCase().includes(query) ||
        sch.course.toLowerCase().includes(query) ||
        sch.docs.toLowerCase().includes(query);

      const matchesHealth = healthFilter === "ALL" || sch.health === healthFilter;
      return matchesSearch && matchesHealth;
    });
  }, [scholars, query, healthFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {onSearchChange ? (
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search scholar, course, or ID..."
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
          <Select value={healthFilter} onValueChange={setHealthFilter}>
            <SelectTrigger className="h-9 w-48 sm:w-52 rounded-xl border-line bg-white text-xs font-semibold">
              <SelectValue placeholder="Health Standing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Standings ({scholars.length})</SelectItem>
              <SelectItem value="good">On Track</SelectItem>
              <SelectItem value="warn">Needs Attention / Probation</SelectItem>
              <SelectItem value="bad">Action Required</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
                  <Skeleton className="h-4 w-16 shrink-0" />
                  <Skeleton className="h-4 w-24 shrink-0" />
                  <Skeleton className="h-4 w-28 shrink-0" />
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
                      GWA
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Documents
                    </TableHead>
                    <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                      Disbursement
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
                        {query ? `No scholars match "${searchQuery}".` : "No active scholars enrolled yet."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((sch) => (
                      <TableRow
                        key={sch.id}
                        onClick={() => onSelectScholar(sch)}
                        className="cursor-pointer transition-colors hover:bg-[#faf8f5]"
                      >
                        <TableCell className="whitespace-normal! py-4 pl-6 text-center!">
                          <p className="text-[0.92rem] font-bold text-navy">{sch.name}</p>
                          <p className="mt-0.5 text-xs text-[#9a9a94]">{sch.course}</p>
                        </TableCell>

                        <TableCell className="py-4 text-center!">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-navy tabular-nums">
                            {sch.gwa}%
                            {sch.trend === "up" ? (
                              <TrendingUp className="size-4 text-emerald-600" />
                            ) : (
                              <TrendingDown className="size-4 text-rose-500" />
                            )}
                          </span>
                        </TableCell>

                        <TableCell className="py-4 text-center! text-xs font-medium text-navy/80">{sch.docs}</TableCell>

                        <TableCell className="py-4 text-center! text-xs font-medium text-navy/80">
                          {sch.disbursement}
                        </TableCell>

                        <TableCell className="py-4 text-center!">
                          <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{
                              backgroundColor: HEALTH_TAG[sch.health]?.bg ?? "#f0fdf4",
                              color: HEALTH_TAG[sch.health]?.text ?? "#166534",
                              borderColor: `${HEALTH_TAG[sch.health]?.text ?? "#166534"}33`,
                            }}
                          >
                            <span
                              className="size-1.5 rounded-full"
                              style={{ backgroundColor: HEALTH_TAG[sch.health]?.text ?? "#166534" }}
                            />
                            {HEALTH_TAG[sch.health]?.label ?? "Good"}
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
                              onSelectScholar(sch);
                            }}
                            aria-label={`View ${sch.name}`}
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

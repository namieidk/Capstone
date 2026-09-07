"use client";

import { Eye, RotateCcw, Users } from "lucide-react";
import type { Applicant } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApplicantsPagination } from "./ApplicantsPagination";
import { getStageVariant, STAGE_FILTERS, type StageFilter } from "./applicant-helpers";

interface ApplicantsTableProps {
  applicants: Applicant[];
  totalFiltered: number;
  loading: boolean;
  stageFilter: StageFilter;
  onStageChange: (value: StageFilter) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelect: (applicant: Applicant) => void;
}

const CONTROL_CLASSES = "h-11 border-line bg-card! text-sm shadow-xs";
const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5", "row-6"];

export function ApplicantsTable({
  applicants,
  totalFiltered,
  loading,
  stageFilter,
  onStageChange,
  hasActiveFilters,
  onClearFilters,
  currentPage,
  totalPages,
  onPageChange,
  onSelect,
}: ApplicantsTableProps) {
  return (
    <Card className="mt-5 rounded-[18px]! shadow-va-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {!loading && (hasActiveFilters ? `${totalFiltered} matches` : `${totalFiltered} total applicants`)}
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <Select value={stageFilter} onValueChange={(v) => onStageChange(v as StageFilter)}>
              <SelectTrigger size="lg" className={`${CONTROL_CLASSES} w-full sm:w-44`} aria-label="Filter by stage">
                <SelectValue placeholder="All stages" />
              </SelectTrigger>
              <SelectContent>
                {STAGE_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="text-sm!">
                    {f.label}
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
                <Skeleton className="h-3.5 w-32 shrink-0" />
                <Skeleton className="h-3.5 w-24 shrink-0" />
                <Skeleton className="h-6 w-24 shrink-0 rounded-full" />
                <Skeleton className="hidden h-3.5 flex-1 md:block" />
                <Skeleton className="ml-auto size-9 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <Table className="text-sm!">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Applicant
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Track
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    GWA
                  </TableHead>
                  <TableHead className="hidden text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]! md:table-cell">
                    Applied
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Stage
                  </TableHead>
                  <TableHead className="pr-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((a) => (
                  <TableRow key={a.id} className="cursor-pointer" onClick={() => onSelect(a)}>
                    <TableCell className="py-3 pl-6 text-center!">
                      <p className="text-sm font-semibold">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.course} · {a.year}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 text-center! text-sm">{a.track}</TableCell>
                    <TableCell className="py-3 text-center! text-sm tabular-nums">{a.gwa}%</TableCell>
                    <TableCell className="hidden py-3 text-center! text-sm whitespace-nowrap md:table-cell">
                      {a.applied}
                    </TableCell>
                    <TableCell className="py-3 text-center!">
                      <Badge variant={getStageVariant(a.stage)} className="h-6 px-2.5 text-xs!">
                        {a.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 pr-6 text-center!">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${a.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(a);
                        }}
                      >
                        <Eye className="size-4.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {applicants.length === 0 && (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <Users className="size-10 text-muted-foreground" />
                <div>
                  <p className="text-base font-semibold">No applicants match your filters</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different search term or clear the filters.
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

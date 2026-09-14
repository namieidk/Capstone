"use client";

import { Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SchoolGrading } from "@/lib/api/settings";

interface GradingTableProps {
  schools: SchoolGrading[];
  totalCount: number;
  loading: boolean;
  loadError: string;
  onRetry: () => void;
  onAdd: () => void;
  onSelect: (school: SchoolGrading) => void;
}

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5", "row-6"];

export function GradingTable({ schools, totalCount, loading, loadError, onRetry, onAdd, onSelect }: GradingTableProps) {
  return (
    <Card className="mt-5 rounded-[18px]! shadow-va-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {!loading && !loadError && (
              <>
                {totalCount} {totalCount === 1 ? "grading system" : "grading systems"}
              </>
            )}
          </p>
          <Button
            type="button"
            className="h-11 rounded-full bg-navy px-5 text-sm! text-white shadow-xs hover:bg-navy/90"
            onClick={onAdd}
          >
            <Plus className="size-4" strokeWidth={2.5} />
            Add System
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0!">
        {loading ? (
          <div className="divide-y divide-line px-6 py-2">
            {SKELETON_ROWS.map((key) => (
              <div key={key} className="flex items-center gap-4 py-4">
                <div className="w-44 shrink-0">
                  <Skeleton className="mb-2 h-3.5" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-6 w-32 shrink-0 rounded-full" />
                <Skeleton className="h-3.5 w-16 shrink-0" />
                <Skeleton className="h-3.5 w-16 shrink-0" />
                <Skeleton className="h-3.5 w-16 shrink-0" />
                <Skeleton className="ml-auto size-9 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <p className="text-sm font-medium text-[#8a3a2e]">{loadError}</p>
            <Button type="button" className="h-10 px-5 text-sm!" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <Table className="text-sm!">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    School
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Scale
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Passing
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Highest
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Failing
                  </TableHead>
                  <TableHead className="pr-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.school_id} className="cursor-pointer" onClick={() => onSelect(school)}>
                    <TableCell className="whitespace-normal! py-4 pl-6 text-center!">
                      <p className="text-[0.92rem] font-bold text-navy">{school.school_name}</p>
                      <p className="mt-0.5 text-xs text-[#9a9a94]">
                        {Object.keys(school.special_codes ?? {}).length} special{" "}
                        {Object.keys(school.special_codes ?? {}).length === 1 ? "code" : "codes"}
                      </p>
                    </TableCell>
                    <TableCell className="py-4 text-center!">
                      <Badge
                        variant="outline"
                        className="h-6 px-2.5 text-xs font-semibold text-navy border-line bg-white"
                        title={school.grading_scale}
                      >
                        {school.grading_scale === "NUMERIC_4_POINT"
                          ? "4.0 Scale (UM)"
                          : school.grading_scale === "NUMERIC_5_POINT"
                            ? "5.0 Scale (USEP/UP)"
                            : school.grading_scale === "PERCENTAGE_100"
                              ? "100% (SHS/DepEd)"
                              : school.grading_scale}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-normal! py-4 text-center! text-sm tabular-nums">
                      {school.passing_grade.toFixed(2)}
                    </TableCell>
                    <TableCell className="whitespace-normal! py-4 text-center! text-sm tabular-nums">
                      {school.highest_grade.toFixed(2)}
                    </TableCell>
                    <TableCell className="whitespace-normal! py-4 text-center! text-sm tabular-nums">
                      {school.failing_grade.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-center!">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-9 rounded-full"
                        aria-label={`View ${school.school_name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(school);
                        }}
                      >
                        <Eye className="size-4 text-[#7a7a74]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {schools.length === 0 && (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                {totalCount === 0 ? "No grading systems configured yet." : "No grading systems match your search."}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

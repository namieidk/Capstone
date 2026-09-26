"use client";

import { Eye, GraduationCap, RotateCcw } from "lucide-react";
import { TINT } from "@/components/Adminshared";
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
  onSelect: (school: SchoolGrading) => void;
}

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5", "row-6"];

const HEAD = "text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!";

const SCALE_LABELS: Record<string, string> = {
  NUMERIC_4_POINT: "4.0 Scale (UM)",
  NUMERIC_5_POINT: "5.0 Scale (USEP/UP)",
  PERCENTAGE_100: "100% (SHS/DepEd)",
};

function ScaleBadge({ scale }: { scale: string }) {
  const label = SCALE_LABELS[scale] ?? scale;
  return (
    <Badge className="h-6 px-2.5 text-xs!" style={{ background: TINT, color: "#55554f" }} title={scale}>
      {label}
    </Badge>
  );
}

export function GradingTable({ schools, totalCount, loading, loadError, onRetry, onSelect }: GradingTableProps) {
  return (
    <Card className="mt-5 rounded-[18px]! shadow-va-sm">
      <CardHeader>
        <p className="text-sm text-muted-foreground">
          {!loading && !loadError && `${totalCount} ${totalCount === 1 ? "grading system" : "grading systems"}`}
        </p>
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
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <GraduationCap className="size-10 text-muted-foreground" />
            <div>
              <p className="text-base font-semibold">Could not load grading systems</p>
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
                  <TableHead className={`${HEAD} pl-6`}>School</TableHead>
                  <TableHead className={HEAD}>Scale</TableHead>
                  <TableHead className={HEAD}>Passing</TableHead>
                  <TableHead className={HEAD}>Highest</TableHead>
                  <TableHead className={HEAD}>Failing</TableHead>
                  <TableHead className={`${HEAD} pr-6`}>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => {
                  const codeCount = Object.keys(school.special_codes ?? {}).length;
                  return (
                    <TableRow key={school.school_id} className="cursor-pointer" onClick={() => onSelect(school)}>
                      <TableCell className="whitespace-normal! py-3 pl-6 text-center!">
                        <p className="text-sm font-semibold">{school.school_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {codeCount} special {codeCount === 1 ? "code" : "codes"}
                        </p>
                      </TableCell>
                      <TableCell className="py-3 text-center!">
                        <ScaleBadge scale={school.grading_scale} />
                      </TableCell>
                      <TableCell className="py-3 text-center! text-sm tabular-nums">
                        {school.passing_grade.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-3 text-center! text-sm tabular-nums">
                        {school.highest_grade.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-3 text-center! text-sm tabular-nums">
                        {school.failing_grade.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-center!">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`View ${school.school_name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(school);
                          }}
                        >
                          <Eye className="size-4.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {schools.length === 0 && (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <GraduationCap className="size-10 text-muted-foreground" />
                <div>
                  <p className="text-base font-semibold">No grading systems found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {totalCount === 0
                      ? "Grading systems will show up here once they are set up."
                      : "Try a different search term."}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

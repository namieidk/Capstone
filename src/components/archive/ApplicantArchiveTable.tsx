"use client";

import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ArchivedApplicantProfile } from "@/lib/api/archive";
import { ArchiveReasonBadge } from "./ArchiveReasonBadge";
import { formatArchiveDate } from "./types";

interface ApplicantArchiveTableProps {
  rows: ArchivedApplicantProfile[];
  loading: boolean;
  loadError?: string;
  onRetry?: () => void;
  onSelect: (row: ArchivedApplicantProfile) => void;
  searchQuery?: string;
}

const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export function ApplicantArchiveTable({
  rows,
  loading,
  loadError,
  onRetry,
  onSelect,
  searchQuery = "",
}: ApplicantArchiveTableProps) {
  return (
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
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <p className="text-sm font-medium text-[#8a3a2e]">{loadError}</p>
            {onRetry && (
              <Button type="button" variant="outline" className="h-9 px-4 text-xs text-navy" onClick={onRetry}>
                Retry loading applicants
              </Button>
            )}
          </div>
        ) : (
          <Table className="text-sm!">
            <TableHeader>
              <TableRow className="border-b border-line hover:bg-transparent">
                <TableHead className="pl-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                  Applicant
                </TableHead>
                <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                  Latest Decision
                </TableHead>
                <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                  School
                </TableHead>
                <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                  Archived
                </TableHead>
                <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                  Reason
                </TableHead>
                <TableHead className="pr-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-36 text-center text-sm text-muted-foreground">
                    {searchQuery.trim()
                      ? `No archived applicants match "${searchQuery}".`
                      : "No archived applicants yet."}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const latest = row.applications?.[0];
                  return (
                    <TableRow
                      key={row.profile_id}
                      onClick={() => onSelect(row)}
                      className="cursor-pointer transition-colors hover:bg-[#faf8f5]"
                    >
                      <TableCell className="whitespace-normal! py-4 pl-6 text-center!">
                        <p className="text-[0.92rem] font-bold text-navy">
                          {row.first_name} {row.last_name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#9a9a94]">
                          {row.course_of_study || "—"} · {row.user.email}
                        </p>
                      </TableCell>
                      <TableCell className="py-4 text-center!">
                        {latest ? (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-semibold rounded-full px-2.5 py-0.5 border-red-200 bg-red-50 text-red-700"
                          >
                            {latest.status} · {latest.stage}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-normal! py-4 text-center! text-xs font-medium text-navy/80">
                        {row.school_name || "—"}
                      </TableCell>
                      <TableCell className="py-4 text-center! text-xs font-medium text-navy/80">
                        {formatArchiveDate(row.archived_at)}
                      </TableCell>
                      <TableCell className="py-4 text-center!">
                        <ArchiveReasonBadge reason={row.archive_reason} />
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-center!">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-9 rounded-full border-line bg-white hover:bg-tint"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(row);
                          }}
                          aria-label="View archived applicant"
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
        )}
      </CardContent>
    </Card>
  );
}

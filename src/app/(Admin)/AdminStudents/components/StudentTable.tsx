"use client";

import { Eye, RotateCcw, User, Users } from "lucide-react";
import { ApplicantsPagination } from "@/app/(Coordinator)/CoordinatorApplicants/components/ApplicantsPagination";
import { GOOD, GOOD_BG, TINT, WARN, WARN_BG } from "@/components/Adminshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { StudentRow } from "./student-helpers";

interface StudentTableProps {
  students: StudentRow[];
  totalFiltered: number;
  loading: boolean;
  loadError: string;
  onRetry: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelect: (student: StudentRow) => void;
}

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5", "row-6"];

const HEAD = "text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!";

function RoleBadge({ type }: { type: StudentRow["type"] }) {
  const isScholar = type === "Scholar";
  return (
    <Badge
      className="h-6 px-2.5 text-xs!"
      style={{
        background: isScholar ? "#e0f2fe" : TINT,
        color: isScholar ? "#0369a1" : "#55554f",
      }}
    >
      {type}
    </Badge>
  );
}

function StatusBadge({ status }: { status: StudentRow["status"] }) {
  const isActive = status === "Active";
  return (
    <Badge
      className="h-6 gap-1.5 px-2.5 text-xs!"
      style={{
        background: isActive ? GOOD_BG : WARN_BG,
        color: isActive ? GOOD : WARN,
      }}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      {status}
    </Badge>
  );
}

export function StudentTable({
  students,
  totalFiltered,
  loading,
  loadError,
  onRetry,
  hasActiveFilters,
  onClearFilters,
  currentPage,
  totalPages,
  onPageChange,
  onSelect,
}: StudentTableProps) {
  return (
    <Card className="mt-5 rounded-[18px]! shadow-va-sm">
      <CardHeader>
        <p className="text-sm text-muted-foreground">
          {!loading &&
            !loadError &&
            (hasActiveFilters
              ? `${totalFiltered} matches`
              : `${totalFiltered} total ${totalFiltered === 1 ? "account" : "accounts"}`)}
        </p>
      </CardHeader>

      <CardContent className="px-0!">
        {loading ? (
          <div className="divide-y divide-line px-6 py-2">
            {SKELETON_ROWS.map((key) => (
              <div key={key} className="flex items-center gap-4 py-4">
                <Skeleton className="h-3.5 w-40 shrink-0" />
                <Skeleton className="h-6 w-24 shrink-0 rounded-full" />
                <Skeleton className="hidden h-3.5 flex-1 md:block" />
                <Skeleton className="ml-auto size-9 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <User className="size-10 text-muted-foreground" />
            <div>
              <p className="text-base font-semibold">Could not load student accounts</p>
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
                  <TableHead className={`${HEAD} pl-6`}>Student</TableHead>
                  <TableHead className={HEAD}>Type</TableHead>
                  <TableHead className={HEAD}>Status</TableHead>
                  <TableHead className={`${HEAD} hidden md:table-cell`}>University</TableHead>
                  <TableHead className={`${HEAD} hidden lg:table-cell`}>Joined</TableHead>
                  <TableHead className={`${HEAD} pr-6`}>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer" onClick={() => onSelect(s)}>
                    <TableCell className="py-3 pl-6 text-center!">
                      <p className="truncate text-sm font-semibold">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.email}</p>
                    </TableCell>
                    <TableCell className="py-3 text-center!">
                      <RoleBadge type={s.type} />
                    </TableCell>
                    <TableCell className="py-3 text-center!">
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="hidden py-3 text-center! md:table-cell">
                      <p className="truncate text-sm">{s.university || "—"}</p>
                      {s.degree && <p className="truncate text-xs text-muted-foreground">{s.degree}</p>}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap py-3 text-center! text-sm lg:table-cell">
                      {s.joined}
                    </TableCell>
                    <TableCell className="py-3 pr-6 text-center!">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${s.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(s);
                        }}
                      >
                        <Eye className="size-4.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {students.length === 0 && (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <Users className="size-10 text-muted-foreground" />
                <div>
                  <p className="text-base font-semibold">No student accounts found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasActiveFilters
                      ? "Try a different search term or clear the filters."
                      : "No applicants or scholars have registered yet."}
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

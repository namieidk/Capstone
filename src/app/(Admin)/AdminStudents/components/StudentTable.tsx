"use client";

import { Check, ChevronLeft, ChevronRight, Eye, GraduationCap, ListFilter, User } from "lucide-react";
import type { CSSProperties } from "react";
import { GOOD, GOOD_BG, TINT, WARN, WARN_BG } from "@/components/Adminshared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentTableSkeleton } from "./StudentSkeleton";
import { STUDENT_FILTERS, type StudentFilter, type StudentRow } from "./student-helpers";

interface StudentTableProps {
  students: StudentRow[];
  totalFiltered: number;
  loading: boolean;
  loadError: string;
  onRetry: () => void;
  filter: StudentFilter;
  counts: Record<StudentFilter, number>;
  onFilterChange: (filter: StudentFilter) => void;
  onSelect: (student: StudentRow) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ACTIVE_PAGE_STYLE: CSSProperties = {
  background: "var(--navy)",
  borderColor: "var(--navy)",
  color: "#ffffff",
};

function RoleBadge({ type }: { type: string }) {
  const isScholar = type === "Scholar";
  return (
    <Badge
      className="h-6 w-28 justify-center px-3 text-xs!"
      style={{
        background: isScholar ? "#e0f2fe" : TINT,
        color: isScholar ? "#0369a1" : "#55554f",
      }}
    >
      <GraduationCap className="size-3 mr-1.5" />
      {type}
    </Badge>
  );
}

function StatusBadge({ status }: { status: StudentRow["status"] }) {
  const isActive = status === "Active";
  return (
    <Badge
      className="h-6 w-28 justify-center gap-1.5 px-3 text-xs!"
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
  filter,
  counts,
  onFilterChange,
  onSelect,
  currentPage,
  totalPages,
  onPageChange,
}: StudentTableProps) {
  return (
    <Card className="mt-5 rounded-[18px]! shadow-va-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {!loading && !loadError && (
              <>
                {totalFiltered} {totalFiltered === 1 ? "account" : "accounts"}
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* Desktop filter pills */}
            <div className="hidden items-center gap-1 rounded-full border border-line bg-tint/60 p-1 md:flex">
              {STUDENT_FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    type="button"
                    key={f}
                    onClick={() => onFilterChange(f)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                      active ? "bg-navy text-white shadow-xs" : "text-muted-foreground hover:text-navy"
                    }`}
                  >
                    <span>{f}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        active ? "bg-white/20 text-white" : "bg-white text-muted-foreground"
                      }`}
                    >
                      {counts[f]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile filter dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2 text-xs">
                    <ListFilter className="size-3.5" />
                    <span>{filter}</span>
                    <span className="rounded-full bg-tint px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {counts[filter]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Filter by type</DropdownMenuLabel>
                  {STUDENT_FILTERS.map((f) => (
                    <DropdownMenuItem
                      key={f}
                      onClick={() => onFilterChange(f)}
                      className="flex items-center justify-between text-xs"
                    >
                      <span>{f}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">({counts[f]})</span>
                        {filter === f && <Check className="size-3.5 text-navy" />}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <StudentTableSkeleton />
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-semibold text-destructive">{loadError}</p>
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
              Try again
            </Button>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <User className="size-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-semibold text-foreground">No student accounts found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {filter === "All"
                ? "No applicants or scholars have registered yet."
                : `No student accounts found under "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="w-36 text-center">Type</TableHead>
                  <TableHead className="w-36 text-center">Status</TableHead>
                  <TableHead className="w-44">University</TableHead>
                  <TableHead className="w-36">Joined</TableHead>
                  <TableHead className="w-16 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer transition-colors hover:bg-muted/40"
                    onClick={() => onSelect(student)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 border border-border">
                          {student.avatarUrl ? <AvatarImage src={student.avatarUrl} alt={student.name} /> : null}
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {student.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{student.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <RoleBadge type={student.type} />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={student.status} />
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-medium text-foreground truncate">{student.university || "—"}</p>
                      {student.degree && <p className="text-[11px] text-muted-foreground truncate">{student.degree}</p>}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{student.joined}</span>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs font-medium"
                        onClick={() => onSelect(student)}
                      >
                        <Eye className="size-3.5 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination controls */}
        {!loading && !loadError && totalPages > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <Button
                    key={pageNum}
                    variant={isCurrent ? "default" : "outline"}
                    size="sm"
                    className="size-8 p-0 text-xs"
                    style={isCurrent ? ACTIVE_PAGE_STYLE : undefined}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

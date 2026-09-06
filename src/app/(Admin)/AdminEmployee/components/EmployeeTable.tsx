"use client";

import { Check, ChevronLeft, ChevronRight, Eye, ListFilter, Plus } from "lucide-react";
import type { CSSProperties } from "react";
import { AMBER_BG, GOOD, GOOD_BG, TINT, WARN, WARN_BG } from "@/components/Adminshared";
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
import { EmployeeTableSkeleton } from "./EmployeeSkeleton";
import { EMPLOYEE_FILTERS, type EmployeeFilter, type StaffRow } from "./employee-helpers";

interface EmployeeTableProps {
  employees: StaffRow[];
  totalFiltered: number;
  loading: boolean;
  loadError: string;
  onRetry: () => void;
  filter: EmployeeFilter;
  counts: Record<EmployeeFilter, number>;
  onFilterChange: (filter: EmployeeFilter) => void;
  onAdd: () => void;
  onSelect: (employee: StaffRow) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Explicit navy/white styling so the active page is unmistakable
// regardless of the active button variant tokens.
const ACTIVE_PAGE_STYLE: CSSProperties = {
  background: "var(--navy)",
  borderColor: "var(--navy)",
  color: "#ffffff",
};

function RoleBadge({ type }: { type: string }) {
  const isCoordinator = type === "Coordinator";
  return (
    <Badge
      className="h-6 w-28 justify-center px-3 text-xs!"
      style={{
        background: isCoordinator ? AMBER_BG : TINT,
        color: isCoordinator ? "#6b5220" : "#55554f",
      }}
    >
      {type}
    </Badge>
  );
}

function StatusBadge({ status }: { status: StaffRow["status"] }) {
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

export function EmployeeTable({
  employees,
  totalFiltered,
  loading,
  loadError,
  onRetry,
  filter,
  counts,
  onFilterChange,
  onAdd,
  onSelect,
  currentPage,
  totalPages,
  onPageChange,
}: EmployeeTableProps) {
  return (
    <Card className="mt-5 rounded-[18px]! shadow-va-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {!loading && !loadError && (
              <>
                {totalFiltered} {totalFiltered === 1 ? "employee" : "employees"}
              </>
            )}
          </p>
          <div className="flex items-center gap-2.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative size-9 rounded-full bg-amber shadow-xs hover:bg-[#d9a316]"
                  aria-label="Filter by role"
                >
                  <ListFilter className="size-4 text-navy" />
                  {filter !== "All" && (
                    <span className="absolute -top-0.5 -right-0.5 size-2.25 rounded-full border-2 border-white bg-navy" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52!">
                <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
                {EMPLOYEE_FILTERS.map((f) => {
                  const isActive = filter === f;
                  return (
                    <DropdownMenuItem
                      key={f}
                      onSelect={() => onFilterChange(f)}
                      className={`text-sm! ${isActive ? "bg-tint font-semibold text-navy" : "text-[#4a4a45]"}`}
                    >
                      <span className="flex flex-1 items-center gap-2">
                        {f}
                        <span className="text-xs text-muted-foreground tabular-nums">({counts[f]})</span>
                      </span>
                      {isActive && <Check className="size-4 text-navy" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              type="button"
              className="h-11 rounded-full bg-navy px-5 text-sm! text-white shadow-xs hover:bg-navy/90"
              onClick={onAdd}
            >
              <Plus className="size-4" strokeWidth={2.5} />
              Add Employee
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0!">
        {loading ? (
          <EmployeeTableSkeleton />
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
                    Employee
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Title
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Department / Company
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Role
                  </TableHead>
                  <TableHead className="text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    Status
                  </TableHead>
                  <TableHead className="pr-6 text-center! text-xs font-bold! uppercase tracking-wider text-[#8a8a84]!">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id} className="cursor-pointer" onClick={() => onSelect(emp)}>
                    <TableCell className="whitespace-normal! py-4 pl-6 text-center!">
                      <p className="text-[0.92rem] font-bold text-navy">{emp.name}</p>
                      <p className="mt-0.5 truncate text-xs text-[#9a9a94]">{emp.email}</p>
                    </TableCell>
                    <TableCell className="whitespace-normal! py-4 text-center! text-sm text-[#4a4a45]">
                      {emp.title}
                    </TableCell>
                    <TableCell className="whitespace-normal! py-4 text-center! text-sm text-[#4a4a45]">
                      {emp.department}
                    </TableCell>
                    <TableCell className="py-4 text-center!">
                      <RoleBadge type={emp.type} />
                    </TableCell>
                    <TableCell className="py-4 text-center!">
                      <StatusBadge status={emp.status} />
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-center!">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-9 rounded-full"
                        aria-label={`View ${emp.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(emp);
                        }}
                      >
                        <Eye className="size-4 text-[#7a7a74]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalFiltered === 0 && (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">No employees match this filter.</p>
            )}

            {totalFiltered > 0 && (
              <div className="flex flex-wrap items-center justify-end gap-2 px-6 pt-4 pb-5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 gap-1.5 px-3.5 text-sm!"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                  <Button
                    type="button"
                    key={num}
                    variant="outline"
                    className="h-9 min-w-9 text-sm!"
                    style={num === currentPage ? ACTIVE_PAGE_STYLE : undefined}
                    onClick={() => onPageChange(num)}
                    aria-label={`Go to page ${num}`}
                    aria-current={num === currentPage ? "page" : undefined}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 gap-1.5 px-3.5 text-sm!"
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

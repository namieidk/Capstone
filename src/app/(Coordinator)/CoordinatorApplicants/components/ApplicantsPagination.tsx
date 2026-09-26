"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicantsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ApplicantsPagination({ currentPage, totalPages, onPageChange }: ApplicantsPaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-end gap-2 px-6 pt-4 pb-5">
      <Button
        variant="outline"
        size="icon"
        className="size-9"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <span
        aria-current="page"
        className="flex size-9 items-center justify-center rounded-md border text-sm font-semibold tabular-nums"
      >
        {currentPage}
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

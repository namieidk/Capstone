"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";

interface ApplicantsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ACTIVE_PAGE_STYLE: CSSProperties = {
  background: "var(--navy)",
  borderColor: "var(--navy)",
  color: "#ffffff",
};

export function ApplicantsPagination({ currentPage, totalPages, onPageChange }: ApplicantsPaginationProps) {
  if (totalPages <= 1) return null;
  return (
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
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          type="button"
          variant="outline"
          className="h-9 min-w-9 text-sm!"
          style={n === currentPage ? ACTIVE_PAGE_STYLE : undefined}
          onClick={() => onPageChange(n)}
          aria-label={`Go to page ${n}`}
          aria-current={n === currentPage ? "page" : undefined}
        >
          {n}
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
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArchivePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export function ArchivePagination({
  page,
  totalPages,
  total,
  onPageChange,
  label = "records",
}: ArchivePaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="border-t border-line px-6 py-3.5 text-xs text-muted-foreground">
        Showing {total} {label}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3.5 text-xs text-muted-foreground">
      <span>
        {total} {label} · Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
          <Button
            key={num}
            type="button"
            variant={num === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(num)}
            className={`size-8 p-0 text-xs ${num === page ? "bg-navy text-white hover:bg-navy/90" : ""}`}
          >
            {num}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

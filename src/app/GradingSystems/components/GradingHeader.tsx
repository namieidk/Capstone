"use client";

import { PageHeader } from "@/components/PageHeader";

interface GradingHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function GradingHeader({ searchQuery, onSearchChange }: GradingHeaderProps) {
  return (
    <PageHeader
      title="Grading Systems"
      subtitle="Per-school grading scales used to evaluate grades."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search schools..."
    />
  );
}

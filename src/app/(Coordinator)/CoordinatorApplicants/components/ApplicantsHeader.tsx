// ApplicantsHeader.tsx

"use client";

import { type HeaderFilterProps, PageHeader } from "@/components/PageHeader";

interface ApplicantsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter?: HeaderFilterProps;
}

export function ApplicantsHeader({ searchQuery, onSearchChange, filter }: ApplicantsHeaderProps) {
  return (
    <PageHeader
      title="Applicants"
      subtitle="Everyone who has applied to ViaScholar."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search name, track, stage..."
      filter={filter}
    />
  );
}

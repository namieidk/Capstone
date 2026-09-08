"use client";

import { PageHeader } from "@/components/PageHeader";

interface ApplicantsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ApplicantsHeader({ searchQuery, onSearchChange }: ApplicantsHeaderProps) {
  return (
    <PageHeader
      title="Applicants"
      subtitle="Everyone who has applied to ViaScholar."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search name, track, stage..."
    />
  );
}

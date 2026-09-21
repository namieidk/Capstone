"use client";

import { PageHeader } from "@/components/PageHeader";

interface GrantApplicantsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function GrantApplicantsHeader({ searchQuery, onSearchChange }: GrantApplicantsHeaderProps) {
  return (
    <PageHeader
      title="Applicants"
      subtitle="Review applicants and schedule interviews."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search name, track, stage..."
    />
  );
}

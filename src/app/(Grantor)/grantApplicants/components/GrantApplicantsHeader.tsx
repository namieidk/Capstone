"use client";

import { type HeaderFilterProps, PageHeader } from "@/components/PageHeader";

interface GrantApplicantsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter?: HeaderFilterProps;
}

export function GrantApplicantsHeader({ searchQuery, onSearchChange, filter }: GrantApplicantsHeaderProps) {
  return (
    <PageHeader
      title="Applicants"
      subtitle="Review applicants and schedule interviews."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search name, track, stage..."
      filter={filter}
    />
  );
}

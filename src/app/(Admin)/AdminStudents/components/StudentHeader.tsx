"use client";

import { type HeaderFilterProps, PageHeader } from "@/components/PageHeader";

interface StudentHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter?: HeaderFilterProps;
}

export function StudentHeader({ searchQuery, onSearchChange, filter }: StudentHeaderProps) {
  return (
    <PageHeader
      title="Student Accounts"
      subtitle="Manage applicant and scholar accounts, credentials, and statuses."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search name, email, university..."
      filter={filter}
    />
  );
}

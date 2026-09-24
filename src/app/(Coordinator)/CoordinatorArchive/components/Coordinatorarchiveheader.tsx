"use client";

import { type HeaderFilterProps, PageHeader } from "@/components/PageHeader";

interface CoordinatorArchiveHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter?: HeaderFilterProps;
}

export function CoordinatorArchiveHeader({ searchQuery, onSearchChange, filter }: CoordinatorArchiveHeaderProps) {
  return (
    <PageHeader
      title="Archive"
      subtitle="Review scholars who have graduated, withdrawn, or been terminated."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search scholar name or course..."
      filter={filter}
    />
  );
}

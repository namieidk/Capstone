"use client";

import { PageHeader, type HeaderFilterProps } from "@/components/PageHeader";

interface CoordinatorMonitorHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter?: HeaderFilterProps;
}

export function CoordinatorMonitorHeader({
  searchQuery,
  onSearchChange,
  filter,
}: CoordinatorMonitorHeaderProps) {
  return (
    <PageHeader
      title="Monitor"
      subtitle="Track scholar progress and review academic audits."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search scholars and audits..."
      filter={filter}
    />
  );
}

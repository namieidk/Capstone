"use client";

import { PageHeader } from "@/components/PageHeader";

interface StudentHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function StudentHeader({ searchQuery, onSearchChange }: StudentHeaderProps) {
  return (
    <PageHeader
      title="Student Accounts"
      subtitle="Manage applicant and active scholar accounts, credentials, and account statuses."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search by name, email, university..."
    />
  );
}

"use client";

import { PageHeader } from "@/components/PageHeader";

interface AdminDashboardHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function AdminDashboardHeader({ searchValue, onSearchChange }: AdminDashboardHeaderProps) {
  return (
    <PageHeader
      title="Admin Dashboard"
      subtitle="System administration, employee accounts, security logs, and platform settings."
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search staff, actions, or schools..."
    />
  );
}

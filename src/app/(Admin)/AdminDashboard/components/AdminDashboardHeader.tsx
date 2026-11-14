"use client";

import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminDashboardHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminDashboardHeader({
  searchValue,
  onSearchChange,
  onRefresh,
  isRefreshing,
}: AdminDashboardHeaderProps) {
  return (
    <PageHeader
      title="Dashboard"
      subtitle="System administration, employee accounts, security logs, and platform settings."
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search staff, actions, or schools..."
      actions={
        onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-9 rounded-full border-line/80 bg-white px-3.5 text-xs font-semibold text-navy hover:bg-tint hover:text-navy shadow-2xs"
            title="Refresh admin dashboard"
          >
            <RefreshCw className={cn("mr-1.5 size-3.5 text-[#0a4f42]", isRefreshing && "animate-spin")} />
            <span>Refresh</span>
          </Button>
        )
      }
    />
  );
}

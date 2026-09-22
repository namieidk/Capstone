"use client";

import { BaselinePendingQueue } from "@/components/coordinator/baseline/BaselinePendingQueue";
import type { PendingBaselineItem } from "@/lib/api/baseline";

interface BaselineAuditsTabProps {
  items: PendingBaselineItem[];
  loading: boolean;
  onSelectScholar: (scholarProfileId: number) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export function BaselineAuditsTab({
  items,
  loading,
  onSelectScholar,
  searchQuery,
  onSearchChange,
}: BaselineAuditsTabProps) {
  return (
    <div className="space-y-4">
      <BaselinePendingQueue
        items={items}
        loading={loading}
        onSelectScholar={onSelectScholar}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </div>
  );
}

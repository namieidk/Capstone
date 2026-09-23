"use client";

import { BaselinePendingQueue } from "@/components/coordinator/baseline/BaselinePendingQueue";
import type { PendingBaselineItem } from "@/lib/api/baseline";

interface BaselineAuditsTabProps {
  items: PendingBaselineItem[];
  loading: boolean;
  onSelectScholar: (scholarProfileId: number) => void;
  searchQuery?: string;
  filter?: string;
}

export function BaselineAuditsTab({ items, loading, onSelectScholar, searchQuery, filter }: BaselineAuditsTabProps) {
  return (
    <div className="space-y-4">
      <BaselinePendingQueue
        items={items}
        loading={loading}
        onSelectScholar={onSelectScholar}
        searchQuery={searchQuery}
        filter={filter}
      />
    </div>
  );
}

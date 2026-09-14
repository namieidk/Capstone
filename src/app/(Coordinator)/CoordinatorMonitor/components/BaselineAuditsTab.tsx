"use client";

import { BaselinePendingQueue } from "@/components/coordinator/baseline/BaselinePendingQueue";
import type { PendingBaselineItem } from "@/lib/api/baseline";

interface BaselineAuditsTabProps {
  items: PendingBaselineItem[];
  loading: boolean;
  onSelectScholar: (scholarProfileId: number) => void;
}

export function BaselineAuditsTab({ items, loading, onSelectScholar }: BaselineAuditsTabProps) {
  return (
    <div className="mt-4 space-y-4">
      <BaselinePendingQueue items={items} loading={loading} onSelectScholar={onSelectScholar} />
    </div>
  );
}

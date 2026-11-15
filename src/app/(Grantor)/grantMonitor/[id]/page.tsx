"use client";

import { useParams } from "next/navigation";
import { ScholarFullDetailsView } from "@/components/coordinator/monitor/ScholarFullDetailsView";

export default function GrantorScholarDetailPage() {
  const params = useParams<{ id: string }>();
  const scholarProfileId = Number(params?.id);

  return (
    <ScholarFullDetailsView
      scholarProfileId={scholarProfileId}
      backHref="/grantMonitor"
      backLabel="Back to Scholar Monitor"
    />
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Application } from "@/lib/api/applications";
import type { ScholarDocument } from "@/lib/api/documents";

interface ProfileStatsProps {
  application: Application | null;
  documents: ScholarDocument[];
}

export function ProfileStats({ application, documents }: ProfileStatsProps) {
  const verifiedDocsCount = documents.filter((d) => d.status === "VERIFIED").length;
  const submittedDate = application?.submitted_at
    ? new Date(application.submitted_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not submitted";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <Card className="rounded-xl border border-line bg-white shadow-xs">
        <CardContent className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Application Stage</p>
          <p className="text-lg font-bold text-navy truncate">
            {application?.stage ? application.stage.replace(/_/g, " ") : "Drafting"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Status: <span className="font-medium text-navy">{application?.status || "In Progress"}</span>
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-line bg-white shadow-xs">
        <CardContent className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Documents Verified</p>
          <p className="text-lg font-bold text-navy">
            {verifiedDocsCount}/{documents.length}
          </p>
          <p className="text-[11px] text-muted-foreground">Uploaded requirements</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-line bg-white shadow-xs">
        <CardContent className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Application Submitted</p>
          <p className="text-lg font-bold text-navy">{submittedDate}</p>
          <p className="text-[11px] text-muted-foreground">Scholarship cycle</p>
        </CardContent>
      </Card>
    </div>
  );
}

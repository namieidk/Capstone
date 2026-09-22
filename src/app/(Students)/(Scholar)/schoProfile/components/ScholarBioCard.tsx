"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ScholarBioCardProps {
  bio?: string | null;
}

export function ScholarBioCard({ bio }: ScholarBioCardProps) {
  return (
    <Card className="rounded-xl border border-line bg-white shadow-xs">
      <CardContent className="p-5 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About &amp; Bio</p>
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {bio ||
            "No bio added yet. Click 'Edit profile' to share a brief background about your academic interests, career goals, or scholarship journey."}
        </p>
      </CardContent>
    </Card>
  );
}

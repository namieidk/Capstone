"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ProfileBioCardProps {
  bio?: string;
}

export function ProfileBioCard({ bio }: ProfileBioCardProps) {
  return (
    <Card className="rounded-xl border border-line bg-white shadow-xs">
      <CardContent className="p-5 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</p>
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {bio || "No bio added yet. Click 'Edit profile' to share a brief background."}
        </p>
      </CardContent>
    </Card>
  );
}

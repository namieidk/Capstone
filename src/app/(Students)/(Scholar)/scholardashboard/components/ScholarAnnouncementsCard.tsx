"use client";

import { ArrowRight, Megaphone } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ScholarAnnouncementItem } from "@/lib/api/scholar-dashboard";

interface ScholarAnnouncementsCardProps {
  announcements: ScholarAnnouncementItem[];
}

export function ScholarAnnouncementsCard({ announcements }: ScholarAnnouncementsCardProps) {
  return (
    <Card className="flex flex-col justify-between rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-[#f1b71e]/15 text-[#8a6410]">
            <Megaphone className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Announcements & Forum</h2>
            <p className="text-xs text-muted-foreground">Official notifications & scholar community</p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
        >
          <Link href="/SchoForum" className="flex items-center gap-1">
            <span>View Forum</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {announcements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
            <Megaphone className="mx-auto mb-1.5 size-5 text-muted-foreground/50" />
            <p>No active announcements at this time.</p>
          </div>
        ) : (
          announcements.map((post) => (
            <Link
              key={post.post_id}
              href="/SchoForum"
              className="group block rounded-xl border border-line/60 bg-[#FAF8F5] p-3.5 hover:border-[#0a4f42]/30 hover:bg-white transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {post.is_pinned && (
                    <Badge className="h-4.5 rounded-full border-[#f1b71e]/50 bg-[#fceec4] px-1.5 text-[9px] font-bold text-[#8a6410]">
                      PINNED
                    </Badge>
                  )}
                  <Badge className="h-4.5 rounded-full border-line bg-white px-1.5 text-[9px] font-semibold text-muted-foreground uppercase">
                    {post.category}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <p className="mt-1.5 text-xs font-bold text-[#14213a] group-hover:text-[#0a4f42] transition-colors line-clamp-1">
                {post.title}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{post.content}</p>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

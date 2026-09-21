"use client";

import { Loader2, Send, Sparkles, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ForumComposerProps {
  userInitials: string;
  isComposing: boolean;
  onOpenCompose: () => void;
  onCloseCompose: () => void;
  draftTitle: string;
  onTitleChange: (value: string) => void;
  draftContent: string;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function ForumComposer({
  userInitials,
  isComposing,
  onOpenCompose,
  onCloseCompose,
  draftTitle,
  onTitleChange,
  draftContent,
  onContentChange,
  onSubmit,
  submitting,
}: ForumComposerProps) {
  return (
    <Card className="py-0 gap-0 rounded-2xl border-border/70 bg-white shadow-2xs transition-shadow hover:shadow-xs">
      {!isComposing ? (
        <CardContent className="p-0 px-3.5 py-2">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 shrink-0 ring-1 ring-amber/30">
              <AvatarFallback className="bg-amber-100 text-amber-900 font-bold text-xs">{userInitials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={onOpenCompose}
              className="flex-1 rounded-full border border-line bg-[#F8F9FA] px-3.5 py-1.5 text-left text-xs font-medium text-muted-foreground transition-all hover:border-border hover:bg-white hover:text-navy hover:shadow-2xs"
            >
              Start a discussion, ask a question, or share an update...
            </button>
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber" />
              <span className="text-xs font-bold uppercase tracking-wider text-navy">Create Discussion</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 rounded-full text-muted-foreground"
              onClick={onCloseCompose}
            >
              <X className="size-4" />
            </Button>
          </div>

          <Input
            value={draftTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Thread title (e.g. Tips for maintaining 90%+ GWA?)"
            className="h-10 rounded-xl border-line bg-[#F9FBFB] font-semibold text-navy placeholder:text-muted-foreground/70"
          />

          <Textarea
            value={draftContent}
            onChange={(e) => onContentChange(e.target.value)}
            rows={3}
            placeholder="Share details, context, questions, or resources for other scholars..."
            className="min-h-22.5 resize-y rounded-xl border-line bg-[#F9FBFB] text-xs leading-relaxed text-navy placeholder:text-muted-foreground/70"
          />

          <div className="flex items-center justify-between pt-1">
            <p className="text-[0.7rem] text-muted-foreground">
              Keep posts respectful and aligned with scholarship guidelines.
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-line px-3 text-xs font-medium"
                onClick={onCloseCompose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSubmit}
                disabled={!draftContent.trim() || submitting}
                className="h-8 gap-1.5 rounded-full bg-navy px-4 text-xs font-semibold text-white hover:bg-navy/90 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <>
                    Post <Send className="size-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

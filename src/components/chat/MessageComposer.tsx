"use client";

import { Loader2, Send } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageComposerProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
}

export function MessageComposer({ draft, onDraftChange, onSend, sending }: MessageComposerProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-line bg-white p-3 md:p-4">
      <Input
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message (press Enter to send)..."
        className="h-10 flex-1 rounded-full border-line bg-[#F8F9FA] px-4 text-xs placeholder:text-muted-foreground focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-navy"
      />
      <Button
        type="button"
        size="icon"
        onClick={onSend}
        disabled={!draft.trim() || sending}
        className="size-10 shrink-0 rounded-full bg-navy text-white hover:bg-navy/90 shadow-xs disabled:opacity-40"
        aria-label="Send message"
      >
        {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
      </Button>
    </div>
  );
}

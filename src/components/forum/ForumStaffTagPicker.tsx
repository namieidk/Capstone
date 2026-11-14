"use client";

import { AtSign, Check, ChevronDown, Search, X } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ForumTaggedUser } from "@/lib/api/forum";
import { getInitials, getRoleBadgeVariant } from "./forum-utils";

export function extractMentionQuery(text: string, cursorPos: number | null): { query: string; startIndex: number } | null {
  const pos = cursorPos ?? text.length;
  const beforeCursor = text.slice(0, pos);
  const match = /(?:^|\s)@([^\s@]{0,40})$/.exec(beforeCursor);
  if (!match) return null;
  const atOffset = beforeCursor.lastIndexOf("@");
  if (atOffset < 0) return null;
  return {
    query: match[1],
    startIndex: atOffset,
  };
}

export function applyMentionReplacement(
  text: string,
  startIndex: number,
  cursorPos: number | null,
  staffName: string,
): { nextText: string; nextCursorPos: number } {
  const endPos = cursorPos ?? text.length;
  const insertion = `@${staffName} `;
  const nextText = `${text.slice(0, startIndex)}${insertion}${text.slice(endPos)}`;
  return {
    nextText,
    nextCursorPos: startIndex + insertion.length,
  };
}

interface ForumTaggedBadgesProps {
  taggedUsers?: ForumTaggedUser[];
  compact?: boolean;
}

export function ForumTaggedBadges({ taggedUsers, compact = false }: ForumTaggedBadgesProps) {
  if (!taggedUsers || taggedUsers.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground mr-0.5">
        Tagged:
      </span>
      {taggedUsers.map((person) => {
        const badge = getRoleBadgeVariant(person.role);
        return (
          <Badge
            key={`tagged-badge-${person.user_id}`}
            variant="outline"
            className={`gap-1 rounded-full font-semibold ${badge.className} ${
              compact ? "px-2 py-0 text-[0.65rem]" : "px-2.5 py-0.5 text-[0.7rem]"
            }`}
          >
            <AtSign className="size-2.5 shrink-0" />
            <span>{person.name}</span>
            <span className="opacity-75 font-normal">({badge.label})</span>
          </Badge>
        );
      })}
    </div>
  );
}

interface ForumStaffTagPickerProps {
  staff: ForumTaggedUser[];
  selectedIds: number[];
  onToggleStaff: (userId: number) => void;
  disabled?: boolean;
}

export function ForumStaffTagPicker({
  staff,
  selectedIds,
  onToggleStaff,
  disabled = false,
}: ForumStaffTagPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedStaff = useMemo(() => {
    const idSet = new Set(selectedIds);
    return staff.filter((member) => idSet.has(member.user_id));
  }, [staff, selectedIds]);

  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (member) =>
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        (member.email || "").toLowerCase().includes(q) ||
        (member.title || "").toLowerCase().includes(q),
    );
  }, [staff, search]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <PopoverPrimitive.Root
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) setSearch("");
          }}
        >
          <PopoverPrimitive.Trigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || staff.length === 0}
              className="h-7 gap-1.5 rounded-full border-dashed border-border bg-white px-2.5 text-[0.72rem] font-medium text-navy hover:bg-tint/60"
            >
              <AtSign className="size-3 text-amber-700" />
              <span>Tag Coordinator / Grantor</span>
              <ChevronDown
                className={`size-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
              />
            </Button>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              side="bottom"
              sideOffset={6}
              collisionPadding={12}
              className="z-50 w-72 sm:w-80 rounded-xl border border-border bg-white p-2 shadow-lg outline-hidden"
            >
              <div className="relative mb-2">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search coordinators or grantors..."
                  className="h-8 rounded-lg border-line bg-[#F9FBFB] pl-8 text-xs placeholder:text-muted-foreground/70"
                />
              </div>

              <div className="max-h-56 space-y-1 overflow-y-auto pr-0.5">
                {filteredStaff.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No matching coordinators or grantors found.
                  </p>
                ) : (
                  filteredStaff.map((member) => {
                    const isSelected = selectedIds.includes(member.user_id);
                    const roleBadge = getRoleBadgeVariant(member.role);
                    return (
                      <button
                        key={`picker-staff-${member.user_id}`}
                        type="button"
                        onClick={() => onToggleStaff(member.user_id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors ${
                          isSelected ? "bg-tint/80" : "hover:bg-[#F8F9FA]"
                        }`}
                      >
                        <Avatar className="size-7 shrink-0">
                          <AvatarFallback className="bg-amber-100 text-[0.65rem] font-bold text-amber-900">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-xs font-semibold text-navy">{member.name}</span>
                            <Badge
                              variant="outline"
                              className={`shrink-0 rounded-md px-1.5 py-0 text-[0.6rem] font-semibold ${roleBadge.className}`}
                            >
                              {roleBadge.label}
                            </Badge>
                          </div>
                          <p className="truncate text-[0.68rem] text-muted-foreground">
                            {member.title || member.email}
                          </p>
                        </div>
                        {isSelected && <Check className="size-3.5 shrink-0 text-navy" />}
                      </button>
                    );
                  })
                )}
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        {selectedStaff.map((member) => {
          const roleBadge = getRoleBadgeVariant(member.role);
          return (
            <span
              key={`selected-tag-${member.user_id}`}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold ${roleBadge.className}`}
            >
              <AtSign className="size-2.5 shrink-0" />
              <span>{member.name}</span>
              <span className="opacity-75 font-normal">({roleBadge.label})</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onToggleStaff(member.user_id)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 focus:outline-hidden"
                  aria-label={`Remove ${member.name} tag`}
                >
                  <X className="size-2.5" />
                </button>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

interface ForumMentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  staff: ForumTaggedUser[];
  onSelectMention: (userId: number) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

export function ForumMentionTextarea({
  value,
  onChange,
  staff,
  onSelectMention,
  placeholder,
  rows = 3,
  className,
  disabled = false,
}: ForumMentionTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPos, setCursorPos] = useState<number | null>(null);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const mentionMatch = useMemo(() => extractMentionQuery(value, cursorPos), [value, cursorPos]);

  const suggestions = useMemo(() => {
    if (!mentionMatch || staff.length === 0 || dismissedAt === mentionMatch.startIndex) {
      return [];
    }
    const q = mentionMatch.query.toLowerCase();
    return staff
      .filter(
        (member) =>
          member.name.toLowerCase().includes(q) ||
          member.role.toLowerCase().includes(q) ||
          (member.email || "").toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [mentionMatch, staff, dismissedAt]);

  const pickSuggestion = (member: ForumTaggedUser) => {
    if (!mentionMatch) return;
    const { nextText, nextCursorPos } = applyMentionReplacement(
      value,
      mentionMatch.startIndex,
      cursorPos,
      member.name,
    );
    onChange(nextText);
    onSelectMention(member.user_id);
    setDismissedAt(null);
    setHighlightIndex(0);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(nextCursorPos, nextCursorPos);
        setCursorPos(nextCursorPos);
      }
    });
  };

  return (
    <PopoverPrimitive.Root
      open={suggestions.length > 0}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && mentionMatch) {
          setDismissedAt(mentionMatch.startIndex);
        }
      }}
    >
      <PopoverPrimitive.Anchor asChild>
        <Textarea
          ref={textareaRef}
          value={value}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          className={className}
          onChange={(e) => {
            setDismissedAt(null);
            setHighlightIndex(0);
            setCursorPos(e.target.selectionStart);
            onChange(e.target.value);
          }}
          onClick={(e) => setCursorPos(e.currentTarget.selectionStart)}
          onKeyUp={(e) => {
            if (["ArrowDown", "ArrowUp", "Escape", "Enter", "Tab"].includes(e.key)) return;
            setCursorPos(e.currentTarget.selectionStart);
          }}
          onKeyDown={(e) => {
            if (suggestions.length === 0 || !mentionMatch) return;

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightIndex((prev) => (prev + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
            } else if (e.key === "Escape") {
              e.preventDefault();
              setDismissedAt(mentionMatch.startIndex);
            } else if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              const chosen = suggestions[highlightIndex] || suggestions[0];
              if (chosen) pickSuggestion(chosen);
            }
          }}
        />
      </PopoverPrimitive.Anchor>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          side="bottom"
          sideOffset={6}
          collisionPadding={12}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="z-50 w-72 rounded-xl border border-border bg-white p-1.5 shadow-lg outline-hidden"
        >
          <p className="px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Mention Coordinator or Grantor
          </p>
          <div className="space-y-0.5">
            {suggestions.map((member, index) => {
              const roleBadge = getRoleBadgeVariant(member.role);
              const isHighlighted = index === highlightIndex;
              return (
                <button
                  key={`mention-opt-${member.user_id}`}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pickSuggestion(member);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                    isHighlighted ? "bg-tint" : "hover:bg-[#F8F9FA]"
                  }`}
                >
                  <Avatar className="size-6 shrink-0">
                    <AvatarFallback className="bg-amber-100 text-[0.6rem] font-bold text-amber-900">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs font-semibold text-navy flex-1">{member.name}</span>
                  <Badge
                    variant="outline"
                    className={`shrink-0 rounded-md px-1.5 py-0 text-[0.6rem] font-semibold ${roleBadge.className}`}
                  >
                    {roleBadge.label}
                  </Badge>
                </button>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

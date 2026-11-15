"use client";

import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ForumComment } from "@/lib/api/forum";
import {
  formatTime,
  getAuthorName,
  getInitials,
  getRoleBadgeVariant,
  getScholarPublicProfileHref,
} from "./forum-utils";

interface ForumCommentItemProps {
  comment: ForumComment;
  currentUserRole?: string;
  isCommentAuthor?: boolean;
  onUpdateComment?: (commentId: number, content: string) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
}

export function ForumCommentItem({
  comment,
  currentUserRole,
  isCommentAuthor = false,
  onUpdateComment,
  onDeleteComment,
}: ForumCommentItemProps) {
  const authorName = getAuthorName(comment.author);
  const roleBadge = getRoleBadgeVariant(comment.author.role);
  const profileHref = getScholarPublicProfileHref(comment.author, currentUserRole);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStartEdit = () => {
    setDraft(comment.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraft(comment.content);
  };

  const handleSaveEdit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !onUpdateComment || submitting) return;
    setSubmitting(true);
    try {
      await onUpdateComment(comment.comment_id, trimmed);
      setIsEditing(false);
    } catch {
      // Error toast is handled by the container; keep the edit input open so the draft is preserved.
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteComment || deleting) return;
    setDeleting(true);
    try {
      await onDeleteComment(comment.comment_id);
    } catch {
      // Error toast is handled by the container.
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-xl bg-white border border-border/50 p-3 shadow-2xs">
      <Avatar className="size-7 shrink-0 ring-1 ring-border/40 mt-0.5">
        <AvatarImage src={comment.author.avatar_url || undefined} alt={authorName} />
        <AvatarFallback className="bg-tint text-[0.65rem] font-bold text-navy">
          {getInitials(authorName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            {profileHref ? (
              <Link href={profileHref} className="text-xs font-bold text-navy truncate hover:underline">
                {authorName}
              </Link>
            ) : (
              <span className="text-xs font-bold text-navy truncate">{authorName}</span>
            )}
            <Badge
              variant="outline"
              className={`rounded-sm px-1 py-0 text-[0.6rem] font-semibold ${roleBadge.className}`}
            >
              {roleBadge.label}
            </Badge>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[0.65rem] text-muted-foreground">{formatTime(comment.created_at)}</span>

            {isCommentAuthor && (
              <>
                {onUpdateComment && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleStartEdit}
                    disabled={isEditing || deleting}
                    className="size-6 rounded-full text-muted-foreground hover:text-navy hover:bg-tint"
                    title="Edit comment"
                  >
                    <Pencil className="size-3" />
                  </Button>
                )}

                {onDeleteComment && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={deleting}
                        className="size-6 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50"
                        title="Delete comment"
                      >
                        {deleting ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-line bg-white sm:max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base font-bold text-navy">Delete Comment?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
                          This will permanently delete your comment from this discussion. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="h-8 rounded-full border-line px-4 text-xs font-medium">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => void handleDelete()}
                          className="h-8 rounded-full bg-red-600 px-4 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Delete Comment
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSaveEdit();
                } else if (e.key === "Escape") {
                  handleCancelEdit();
                }
              }}
              placeholder="Edit your comment..."
              className="h-8 flex-1 rounded-full border-line bg-[#F9FBFB] text-xs px-3 text-navy focus-visible:ring-1 focus-visible:ring-navy"
              disabled={submitting}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancelEdit}
              disabled={submitting}
              className="size-7 shrink-0 rounded-full text-muted-foreground hover:text-navy hover:bg-tint"
              title="Cancel editing"
            >
              <X className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={() => void handleSaveEdit()}
              disabled={submitting || !draft.trim()}
              className="size-7 shrink-0 rounded-full bg-navy text-white hover:bg-navy/90 disabled:opacity-40"
              title="Save changes"
            >
              {submitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3.5" />}
            </Button>
          </div>
        ) : (
          <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{comment.content}</p>
        )}
      </div>
    </div>
  );
}

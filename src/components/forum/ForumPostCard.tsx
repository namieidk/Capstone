"use client";

import { Eye, Loader2, MessageCircle, Pencil, Pin, Save, Send, Trash2, X } from "lucide-react";
import Link from "next/link";
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
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ForumComment, ForumPost, ForumTaggedUser } from "@/lib/api/forum";
import { ForumCommentItem } from "./ForumCommentItem";
import { ForumMentionTextarea, ForumStaffTagPicker, ForumTaggedBadges } from "./ForumStaffTagPicker";
import {
  formatTime,
  getAuthorName,
  getInitials,
  getRoleBadgeVariant,
  getScholarPublicProfileHref,
} from "./forum-utils";

interface ForumPostCardProps {
  post: ForumPost;
  currentUserId?: number;
  currentUserRole?: string;
  taggableStaff: ForumTaggedUser[];
  isSelected: boolean;
  isAuthor: boolean;
  isStaff: boolean;
  isReplying: boolean;
  isEditing: boolean;
  editTitle: string;
  editContent: string;
  editTagIds: number[];
  submittingEdit: boolean;
  deleting?: boolean;
  comments: ForumComment[];
  replyDraft: string;
  submittingReply: boolean;
  onSelect: () => void;
  onToggleReply: () => void;
  onReplyDraftChange: (value: string) => void;
  onSubmitReply: () => void;
  onTogglePin: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onEditTitleChange: (value: string) => void;
  onEditContentChange: (value: string) => void;
  onToggleEditTag: (userId: number) => void;
  onSelectEditMention: (userId: number) => void;
  onSubmitEdit: () => void;
  onDelete: () => void;
  onUpdateComment: (commentId: number, content: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

export function ForumPostCard({
  post,
  currentUserId,
  currentUserRole,
  taggableStaff,
  isSelected,
  isAuthor,
  isStaff,
  isReplying,
  isEditing,
  editTitle,
  editContent,
  editTagIds,
  submittingEdit,
  deleting = false,
  comments,
  replyDraft,
  submittingReply,
  onSelect,
  onToggleReply,
  onReplyDraftChange,
  onSubmitReply,
  onTogglePin,
  onStartEdit,
  onCancelEdit,
  onEditTitleChange,
  onEditContentChange,
  onToggleEditTag,
  onSelectEditMention,
  onSubmitEdit,
  onDelete,
  onUpdateComment,
  onDeleteComment,
}: ForumPostCardProps) {
  const authorName = getAuthorName(post.author);
  const initials = getInitials(authorName);
  const roleBadge = getRoleBadgeVariant(post.author.role);
  const profileHref = getScholarPublicProfileHref(post.author, currentUserRole);

  return (
    <Card
      className={`group overflow-visible py-0 gap-0 rounded-2xl transition-all duration-200 ${
        isSelected
          ? "border-amber/50 bg-white ring-2 ring-amber/20 shadow-md"
          : "border-border/70 bg-white shadow-xs hover:border-border hover:shadow-sm"
      }`}
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 text-left">
            <button type="button" onClick={onSelect} className="shrink-0 rounded-full focus:outline-hidden">
              <Avatar className="size-10 ring-1 ring-border/50">
                <AvatarImage src={post.author.avatar_url || undefined} alt={authorName} />
                <AvatarFallback className="bg-tint font-bold text-navy text-xs">{initials}</AvatarFallback>
              </Avatar>
            </button>
            <div>
              <div className="flex items-center gap-2">
                {profileHref ? (
                  <Link href={profileHref} className="text-sm font-bold text-navy hover:underline focus:outline-hidden">
                    {authorName}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={onSelect}
                    className="text-sm font-bold text-navy hover:underline text-left focus:outline-hidden"
                  >
                    {authorName}
                  </button>
                )}
                <Badge
                  variant="outline"
                  className={`rounded-md px-1.5 py-0 text-[0.65rem] font-semibold ${roleBadge.className}`}
                >
                  {roleBadge.label}
                </Badge>
              </div>
              <button
                type="button"
                onClick={onSelect}
                className="text-[0.7rem] text-muted-foreground hover:text-foreground focus:outline-hidden"
              >
                {formatTime(post.created_at)}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {post.is_pinned && (
              <Badge className="gap-1 rounded-full bg-amber/15 text-amber-900 border-amber/30 text-[0.65rem] font-bold px-2 py-0.5">
                <Pin className="size-2.5" /> Pinned
              </Badge>
            )}

            {isStaff && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onTogglePin}
                className={`size-7 rounded-full ${
                  post.is_pinned ? "text-amber" : "text-muted-foreground hover:text-navy"
                }`}
                title={post.is_pinned ? "Unpin thread" : "Pin thread to top"}
              >
                <Pin className="size-3.5" />
              </Button>
            )}

            {isAuthor && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onStartEdit}
                  disabled={isEditing || deleting}
                  className="size-7 rounded-full text-muted-foreground hover:text-navy hover:bg-tint"
                  title="Edit thread"
                >
                  <Pencil className="size-3.5" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={deleting}
                      className="size-7 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      title="Delete thread"
                    >
                      {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border-line bg-white sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-base font-bold text-navy">Delete Forum Post?</AlertDialogTitle>
                      <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
                        This will permanently delete this post and all of its comments. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-8 rounded-full border-line px-4 text-xs font-medium">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDelete}
                        className="h-8 rounded-full bg-red-600 px-4 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Delete Post
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Title & Body Preview or Inline Edit Form */}
        {isEditing ? (
          <div className="mt-3 space-y-2.5 rounded-xl border border-line bg-[#F9FBFB] p-3">
            <Input
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
              placeholder="Thread title (min 3 characters)"
              className="h-9 rounded-lg border-line bg-white font-semibold text-navy text-sm placeholder:text-muted-foreground/70"
            />
            <ForumMentionTextarea
              value={editContent}
              onChange={onEditContentChange}
              staff={taggableStaff}
              onSelectMention={onSelectEditMention}
              rows={3}
              placeholder="Update post details (min 5 characters), or type @ to tag staff..."
              className="min-h-20 resize-y rounded-lg border-line bg-white text-xs leading-relaxed text-navy placeholder:text-muted-foreground/70"
            />
            <ForumStaffTagPicker
              staff={taggableStaff}
              selectedIds={editTagIds}
              onToggleStaff={onToggleEditTag}
              disabled={submittingEdit}
            />
            <div className="flex items-center justify-end gap-2 pt-0.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancelEdit}
                disabled={submittingEdit}
                className="h-8 gap-1 rounded-full border-line px-3 text-xs font-medium"
              >
                <X className="size-3.5" />
                <span>Cancel</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSubmitEdit}
                disabled={submittingEdit || editTitle.trim().length < 3 || editContent.trim().length < 5}
                className="h-8 gap-1.5 rounded-full bg-navy px-4 text-xs font-semibold text-white hover:bg-navy/90 disabled:opacity-50"
              >
                {submittingEdit ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <>
                    <Save className="size-3" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-2.5">
            <button type="button" onClick={onSelect} className="w-full cursor-pointer text-left focus:outline-hidden">
              <h2 className="text-base font-bold text-navy leading-snug tracking-tight hover:text-navy/90">
                {post.title}
              </h2>
              <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{post.content}</p>
            </button>
            <ForumTaggedBadges taggedUsers={post.tagged_users} compact />
          </div>
        )}
      </CardHeader>

      {/* Footer Actions */}
      <CardFooter className="flex items-center justify-between border-t border-border/40 px-5 py-3 text-xs">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isReplying ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleReply}
            className={`h-7.5 gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
              isReplying ? "bg-amber-100 text-amber-900 border-amber-300" : "border-border/60 hover:bg-tint"
            }`}
          >
            <MessageCircle className="size-3.5" />
            <span>Reply ({post.comments_count || comments.length})</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground text-[0.72rem]">
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" /> {post.views_count}
          </span>
        </div>
      </CardFooter>

      {/* Threaded Comments Section */}
      {isSelected && comments.length > 0 && (
        <div className="border-t border-border/50 bg-[#FCFBFA] p-5 space-y-3">
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
            Replies ({comments.length})
          </p>
          <div className="space-y-3">
            {comments.map((c) => {
              const isCommentAuthor = Boolean(
                currentUserId && (c.author_user_id ?? c.author?.user_id) === currentUserId,
              );
              return (
                <ForumCommentItem
                  key={`forum-comment-${c.comment_id}`}
                  comment={c}
                  currentUserRole={currentUserRole}
                  isCommentAuthor={isCommentAuthor}
                  onUpdateComment={onUpdateComment}
                  onDeleteComment={onDeleteComment}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Inline Reply Composer */}
      {isReplying && (
        <div className="border-t border-border/50 bg-[#FCFBFA] p-4">
          <div className="flex items-center gap-2">
            <Input
              value={replyDraft}
              onChange={(e) => onReplyDraftChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmitReply();
                }
              }}
              placeholder="Write a constructive response (press Enter to send)..."
              className="h-9 flex-1 rounded-full border-line bg-white text-xs px-4 placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-navy"
            />
            <Button
              type="button"
              size="icon"
              onClick={onSubmitReply}
              disabled={submittingReply || !replyDraft.trim()}
              className="size-9 shrink-0 rounded-full bg-navy text-white hover:bg-navy/90 disabled:opacity-40"
              aria-label="Send response"
            >
              {submittingReply ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

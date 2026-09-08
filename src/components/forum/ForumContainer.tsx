"use client";

import {
  Eye,
  Loader2,
  Menu,
  MessageCircle,
  Pin,
  Plus,
  Search,
  Send,
  Shield,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ForumSkeleton } from "@/components/forum/ForumSkeleton";
import { useSidebar } from "@/components/SidebarContext";
import { useToast } from "@/components/ToastContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import {
  addComment,
  createPost,
  deletePost,
  type ForumComment,
  type ForumPost,
  getPostById,
  getPosts,
  togglePin,
} from "@/lib/api/forum";

interface ForumContainerProps {
  title?: string;
  subtitle?: string;
}

function getInitials(name: string): string {
  if (!name.trim()) return "VS";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 2) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function getRoleBadgeVariant(role?: string): {
  className: string;
  label: string;
} {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return {
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Admin",
      };
    case "COORDINATOR":
      return {
        className: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Coordinator",
      };
    case "GRANTOR":
      return {
        className: "bg-purple-50 text-purple-700 border-purple-200",
        label: "Grantor",
      };
    default:
      return {
        className: "bg-amber-50 text-amber-800 border-amber-200",
        label: "Scholar",
      };
  }
}

// Map-based deduplication helper
function dedupePosts(list: ForumPost[]): ForumPost[] {
  const map = new Map<number, ForumPost>();
  for (const post of list) {
    if (post && typeof post.post_id === "number") {
      map.set(post.post_id, post);
    }
  }
  return Array.from(map.values());
}

function dedupeComments(list: ForumComment[]): ForumComment[] {
  const map = new Map<number, ForumComment>();
  for (const c of list) {
    if (c && typeof c.comment_id === "number") {
      map.set(c.comment_id, c);
    }
  }
  return Array.from(map.values());
}

export function ForumContainer({
  title = "Community Forum",
  subtitle = "Threads and discussions from scholars, staff, and partners.",
}: ForumContainerProps) {
  const { toggleMobile } = useSidebar();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedPostDetails, setSelectedPostDetails] =
    useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Composer state
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Per-post reply draft state
  const [openReplyId, setOpenReplyId] = useState<number | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [submittingReply, setSubmittingReply] = useState<
    Record<number, boolean>
  >({});

  const isStaff = ["ADMIN", "COORDINATOR", "GRANTOR"].includes(
    user?.role || "",
  );

  // 1. Fetch posts with safe deduplication
  const fetchPosts = useCallback(async () => {
    try {
      const res = await getPosts({ search: searchQuery.trim() });
      const unique = dedupePosts(res.posts || []);
      setPosts(unique);
      if (unique.length > 0 && selectedId === null) {
        setSelectedId(unique[0].post_id);
      }
    } catch (err) {
      console.error("Failed to load forum posts:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 2. Fetch full post details when selectedId changes
  const loadPostDetails = useCallback(async (id: number) => {
    try {
      const details = await getPostById(id);
      if (details) {
        setSelectedPostDetails({
          ...details,
          comments: dedupeComments(details.comments || []),
        });
      }
    } catch (err) {
      console.error("Failed to load post details:", err);
    }
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      loadPostDetails(selectedId);
    } else {
      setSelectedPostDetails(null);
    }
  }, [selectedId, loadPostDetails]);

  // 3. Real-time WebSocket subscriptions
  useEffect(() => {
    if (!socket) return;

    const handleNewPost = (newPost: ForumPost) => {
      setPosts((prev) => {
        const map = new Map<number, ForumPost>();
        map.set(newPost.post_id, newPost);
        for (const p of prev) {
          if (!map.has(p.post_id)) {
            map.set(p.post_id, p);
          }
        }
        return Array.from(map.values());
      });
    };

    socket.on("forum:new_post", handleNewPost);

    return () => {
      socket.off("forum:new_post", handleNewPost);
    };
  }, [socket]);

  // Real-time comments for active thread
  useEffect(() => {
    if (!socket || selectedId === null) return;

    socket.emit("forum:join_post", { postId: selectedId });

    const handleNewComment = (comment: ForumComment) => {
      if (comment.post_id === selectedId) {
        setSelectedPostDetails((prev) => {
          if (!prev) return prev;
          const current = prev.comments || [];
          const map = new Map<number, ForumComment>();
          for (const c of current) {
            map.set(c.comment_id, c);
          }
          map.set(comment.comment_id, comment);
          const unique = Array.from(map.values());
          return {
            ...prev,
            comments: unique,
            comments_count: unique.length,
          };
        });

        setPosts((prev) =>
          prev.map((p) =>
            p.post_id === selectedId
              ? { ...p, comments_count: (p.comments_count || 0) + 1 }
              : p,
          ),
        );
      }
    };

    socket.on("forum:new_comment", handleNewComment);

    return () => {
      socket.emit("forum:leave_post", { postId: selectedId });
      socket.off("forum:new_comment", handleNewComment);
    };
  }, [socket, selectedId]);

  // 4. Actions
  const handleCreatePost = async () => {
    const titleText = draftTitle.trim();
    const contentText = draftContent.trim();
    if (!contentText || submittingPost) return;

    setSubmittingPost(true);
    try {
      const finalTitle =
        titleText ||
        (contentText.length > 50
          ? `${contentText.slice(0, 48)}...`
          : contentText);
      const created = await createPost({
        title: finalTitle,
        content: contentText,
      });

      setPosts((prev) => {
        const map = new Map<number, ForumPost>();
        map.set(created.post_id, created);
        for (const p of prev) {
          if (!map.has(p.post_id)) {
            map.set(p.post_id, p);
          }
        }
        return Array.from(map.values());
      });

      setSelectedId(created.post_id);
      setDraftTitle("");
      setDraftContent("");
      setIsComposing(false);
      showToast("Discussion posted successfully!", "success");
    } catch (err) {
      console.error("Failed to create post:", err);
      showToast("Failed to publish discussion. Please try again.", "error");
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleAddReply = async (postId: number) => {
    const text = (replyDrafts[postId] || "").trim();
    if (!text || submittingReply[postId]) return;

    setSubmittingReply((prev) => ({ ...prev, [postId]: true }));
    try {
      const comment = await addComment(postId, { content: text });
      if (selectedId === postId) {
        setSelectedPostDetails((prev) => {
          if (!prev) return prev;
          const current = prev.comments || [];
          const map = new Map<number, ForumComment>();
          for (const c of current) {
            map.set(c.comment_id, c);
          }
          map.set(comment.comment_id, comment);
          const unique = Array.from(map.values());
          return {
            ...prev,
            comments: unique,
            comments_count: unique.length,
          };
        });
      }
      setPosts((prev) =>
        prev.map((p) =>
          p.post_id === postId
            ? { ...p, comments_count: (p.comments_count || 0) + 1 }
            : p,
        ),
      );
      setReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
      showToast("Response posted!", "success");
    } catch (err) {
      console.error("Failed to add comment:", err);
      showToast("Failed to post response. Please try again.", "error");
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Are you sure you want to delete this discussion?"))
      return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.post_id !== postId));
      if (selectedId === postId) {
        const remaining = posts.filter((p) => p.post_id !== postId);
        setSelectedId(remaining.length > 0 ? remaining[0].post_id : null);
      }
      showToast("Discussion deleted.", "success");
    } catch (err) {
      console.error("Failed to delete post:", err);
      showToast("Failed to delete discussion.", "error");
    }
  };

  const handleTogglePin = async (postId: number) => {
    try {
      const updated = await togglePin(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.post_id === postId ? { ...p, is_pinned: updated.is_pinned } : p,
        ),
      );
      if (selectedPostDetails?.post_id === postId) {
        setSelectedPostDetails((prev) =>
          prev ? { ...prev, is_pinned: updated.is_pinned } : prev,
        );
      }
      showToast(
        updated.is_pinned ? "Thread pinned to top!" : "Thread unpinned.",
        "success",
      );
    } catch (err) {
      console.error("Failed to pin post:", err);
      showToast("Failed to toggle pin.", "error");
    }
  };

  const activePost = useMemo(() => {
    return (
      selectedPostDetails || posts.find((p) => p.post_id === selectedId) || null
    );
  }, [selectedPostDetails, posts, selectedId]);

  const otherPosts = useMemo(() => {
    return posts.filter((p) => p.post_id !== activePost?.post_id);
  }, [posts, activePost]);

  const authorDisplayName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "Scholar";
  const userInitials = getInitials(authorDisplayName);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FAF8F5]">
      {/* Topbar Header */}
      <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-4 border-b border-line bg-white/95 px-4 py-3.5 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleMobile}
            className="size-9 rounded-lg border-line bg-tint/60 text-navy md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="size-4.5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-navy sm:text-xl">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Search Bar & New Thread Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-44 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border-line bg-tint/40 pl-9 pr-8 text-xs placeholder:text-muted-foreground/80 focus-visible:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Button
            type="button"
            onClick={() => {
              setIsComposing(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="h-9 gap-1.5 rounded-full bg-navy px-3 text-xs font-semibold text-white shadow-xs hover:bg-navy/90 sm:px-4"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Thread</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <ForumSkeleton />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* LEFT COLUMN: Discussion Feed & Composer */}
              <div className="space-y-4 lg:col-span-8">
                {/* Composer Card */}
                <Card className="rounded-2xl border-border/70 bg-white shadow-xs transition-shadow hover:shadow-md">
                  {!isComposing ? (
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 ring-1 ring-amber/30">
                          <AvatarFallback className="bg-amber-100 text-amber-900 font-bold text-xs">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          type="button"
                          onClick={() => setIsComposing(true)}
                          className="flex-1 rounded-full border border-line bg-[#F8F9FA] px-4 py-2.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-white hover:text-navy"
                        >
                          Start a discussion, ask a question, or share an
                          update...
                        </button>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-4 text-amber" />
                          <span className="text-xs font-bold uppercase tracking-wider text-navy">
                            Create Discussion
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-full text-muted-foreground"
                          onClick={() => {
                            setIsComposing(false);
                            setDraftTitle("");
                            setDraftContent("");
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>

                      <Input
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        placeholder="Thread title (e.g. Tips for maintaining 90%+ GWA?)"
                        className="h-10 rounded-xl border-line bg-[#F9FBFB] font-semibold text-navy placeholder:text-muted-foreground/70"
                      />

                      <Textarea
                        value={draftContent}
                        onChange={(e) => setDraftContent(e.target.value)}
                        rows={3}
                        placeholder="Share details, context, questions, or resources for other scholars..."
                        className="min-h-22.5 resize-y rounded-xl border-line bg-[#F9FBFB] text-xs leading-relaxed text-navy placeholder:text-muted-foreground/70"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <p className="text-[0.7rem] text-muted-foreground">
                          Keep posts respectful and aligned with scholarship
                          guidelines.
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full border-line px-3 text-xs font-medium"
                            onClick={() => {
                              setIsComposing(false);
                              setDraftTitle("");
                              setDraftContent("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleCreatePost}
                            disabled={!draftContent.trim() || submittingPost}
                            className="h-8 gap-1.5 rounded-full bg-navy px-4 text-xs font-semibold text-white hover:bg-navy/90 disabled:opacity-50"
                          >
                            {submittingPost ? (
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

                {/* Feed Header info */}
                <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-navy">
                    {searchQuery
                      ? `Search results for "${searchQuery}"`
                      : "All Discussions"}{" "}
                    ({posts.length})
                  </span>
                  <span>Real-time sync active</span>
                </div>

                {/* Empty State */}
                {posts.length === 0 && (
                  <Card className="rounded-2xl border-dashed border-border/80 bg-white p-12 text-center shadow-xs">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-tint text-muted-foreground">
                      <MessageCircle className="size-6" />
                    </div>
                    <CardTitle className="text-base text-navy">
                      No discussions yet
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {searchQuery
                        ? "Try clearing your search keyword to view all threads."
                        : "Be the first to ask a question or initiate an open conversation."}
                    </CardDescription>
                  </Card>
                )}

                {/* Posts List */}
                {posts.map((post) => {
                  const isSelected = post.post_id === selectedId;
                  const isAuthor = post.author_user_id === user?.user_id;
                  const authorName =
                    `${post.author.first_name} ${post.author.last_name}`.trim() ||
                    post.author.email;
                  const initials = getInitials(authorName);
                  const isReplying = openReplyId === post.post_id;
                  const roleBadge = getRoleBadgeVariant(post.author.role);

                  // Fetch latest comments from details if selected
                  const rawComments =
                    isSelected && selectedPostDetails?.comments
                      ? selectedPostDetails.comments
                      : post.comments || [];
                  const comments = dedupeComments(rawComments);

                  return (
                    <Card
                      key={`forum-post-${post.post_id}`}
                      className={`group rounded-2xl transition-all duration-200 ${
                        isSelected
                          ? "border-amber/50 bg-white ring-2 ring-amber/20 shadow-md"
                          : "border-border/70 bg-white shadow-xs hover:border-border hover:shadow-sm"
                      }`}
                    >
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedId(post.post_id)}
                            className="flex items-center gap-3 text-left focus:outline-hidden"
                          >
                            <Avatar className="size-10 ring-1 ring-border/50">
                              <AvatarFallback className="bg-tint font-bold text-navy text-xs">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-navy hover:underline">
                                  {authorName}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`rounded-md px-1.5 py-0 text-[0.65rem] font-semibold ${roleBadge.className}`}
                                >
                                  {roleBadge.label}
                                </Badge>
                              </div>
                              <span className="text-[0.7rem] text-muted-foreground">
                                {formatTime(post.created_at)}
                              </span>
                            </div>
                          </button>

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
                                onClick={() => handleTogglePin(post.post_id)}
                                className={`size-7 rounded-full ${
                                  post.is_pinned
                                    ? "text-amber"
                                    : "text-muted-foreground hover:text-navy"
                                }`}
                                title={
                                  post.is_pinned
                                    ? "Unpin thread"
                                    : "Pin thread to top"
                                }
                              >
                                <Pin className="size-3.5" />
                              </Button>
                            )}

                            {(isAuthor || isStaff) && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePost(post.post_id)}
                                className="size-7 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                title="Delete thread"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Title & Body Preview */}
                        <button
                          type="button"
                          onClick={() => setSelectedId(post.post_id)}
                          className="mt-3 w-full cursor-pointer text-left focus:outline-hidden"
                        >
                          <h2 className="text-base font-bold text-navy leading-snug tracking-tight hover:text-navy/90">
                            {post.title}
                          </h2>
                          <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                            {post.content}
                          </p>
                        </button>
                      </CardHeader>

                      {/* Footer Actions */}
                      <CardFooter className="flex items-center justify-between border-t border-border/40 px-5 py-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant={isReplying ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSelectedId(post.post_id);
                              setOpenReplyId(isReplying ? null : post.post_id);
                            }}
                            className={`h-7.5 gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
                              isReplying
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : "border-border/60 hover:bg-tint"
                            }`}
                          >
                            <MessageCircle className="size-3.5" />
                            <span>
                              Reply ({post.comments_count || comments.length})
                            </span>
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
                              const cAuthor =
                                `${c.author.first_name} ${c.author.last_name}`.trim() ||
                                c.author.email;
                              const cBadge = getRoleBadgeVariant(c.author.role);

                              return (
                                <div
                                  key={`forum-comment-${c.comment_id}`}
                                  className="flex items-start gap-3 rounded-xl bg-white border border-border/50 p-3 shadow-2xs"
                                >
                                  <Avatar className="size-7 shrink-0 ring-1 ring-border/40 mt-0.5">
                                    <AvatarFallback className="bg-tint text-[0.65rem] font-bold text-navy">
                                      {getInitials(cAuthor)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-navy truncate">
                                          {cAuthor}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className={`rounded-sm px-1 py-0 text-[0.6rem] font-semibold ${cBadge.className}`}
                                        >
                                          {cBadge.label}
                                        </Badge>
                                      </div>
                                      <span className="text-[0.65rem] text-muted-foreground shrink-0">
                                        {formatTime(c.created_at)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                                      {c.content}
                                    </p>
                                  </div>
                                </div>
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
                              value={replyDrafts[post.post_id] || ""}
                              onChange={(e) =>
                                setReplyDrafts((prev) => ({
                                  ...prev,
                                  [post.post_id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddReply(post.post_id);
                                }
                              }}
                              placeholder="Write a constructive response (press Enter to send)..."
                              className="h-9 flex-1 rounded-full border-line bg-white text-xs px-4 placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-navy"
                            />
                            <Button
                              type="button"
                              size="icon"
                              onClick={() => handleAddReply(post.post_id)}
                              disabled={
                                submittingReply[post.post_id] ||
                                !(replyDrafts[post.post_id] || "").trim()
                              }
                              className="size-9 shrink-0 rounded-full bg-navy text-white hover:bg-navy/90 disabled:opacity-40"
                              aria-label="Send response"
                            >
                              {submittingReply[post.post_id] ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Send className="size-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* RIGHT COLUMN: Active Thread Spotlight & Community Guidelines */}
              <div className="hidden lg:col-span-4 lg:block sticky top-20 space-y-4">
                {activePost ? (
                  <Card className="rounded-2xl border-border/70 bg-white p-6 shadow-xs">
                    <CardHeader className="p-0 pb-4 border-b border-border/40">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
                          Thread Overview
                        </span>
                        {activePost.is_pinned && (
                          <Badge className="rounded-full bg-amber/15 text-amber-900 border-amber/30 text-[0.65rem] font-bold">
                            <Pin className="size-2.5 mr-1" /> Pinned
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm font-bold text-navy leading-snug line-clamp-2 mt-1">
                        {activePost.title}
                      </CardTitle>
                    </CardHeader>

                    {/* Author Spotlight */}
                    <CardContent className="p-0 py-5 flex flex-col items-center text-center">
                      <div className="relative mb-3">
                        <Avatar className="size-16 ring-4 ring-amber/20 shadow-sm">
                          <AvatarFallback className="bg-amber-100 text-amber-900 font-bold text-lg">
                            {getInitials(
                              `${activePost.author.first_name} ${activePost.author.last_name}`.trim() ||
                                activePost.author.email,
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <p className="font-bold text-navy text-sm">
                        {activePost.author.first_name}{" "}
                        {activePost.author.last_name}
                      </p>
                      <p className="text-[0.72rem] text-muted-foreground mb-2 truncate max-w-full">
                        {activePost.author.email}
                      </p>

                      <Badge
                        variant="outline"
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          getRoleBadgeVariant(activePost.author.role).className
                        }`}
                      >
                        {getRoleBadgeVariant(activePost.author.role).label}
                      </Badge>
                    </CardContent>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 border-y border-border/50 py-3.5 text-center">
                      <div>
                        <p className="text-base font-bold text-navy leading-none">
                          {activePost.views_count}
                        </p>
                        <p className="text-[0.68rem] text-muted-foreground mt-1">
                          Total Views
                        </p>
                      </div>
                      <div>
                        <p className="text-base font-bold text-navy leading-none">
                          {activePost.comments_count ||
                            activePost.comments?.length ||
                            0}
                        </p>
                        <p className="text-[0.68rem] text-muted-foreground mt-1">
                          Total Replies
                        </p>
                      </div>
                    </div>

                    {/* Other Discussions Quick Links */}
                    {otherPosts.length > 0 && (
                      <div className="pt-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-navy">
                          <span>Other Discussions</span>
                          <span className="text-[0.7rem] text-muted-foreground font-normal">
                            {otherPosts.length} more
                          </span>
                        </div>
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {otherPosts.slice(0, 6).map((other) => (
                            <button
                              key={`sidebar-thread-${other.post_id}`}
                              type="button"
                              onClick={() => setSelectedId(other.post_id)}
                              className="group flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-tint/60"
                            >
                              <Avatar className="size-6 shrink-0">
                                <AvatarFallback className="bg-tint text-[0.6rem] font-bold text-navy">
                                  {getInitials(
                                    `${other.author.first_name} ${other.author.last_name}`.trim() ||
                                      other.author.email,
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span className="flex-1 truncate text-xs font-medium text-foreground/80 group-hover:text-navy">
                                {other.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ) : null}

                {/* Guidelines Card */}
                <Card className="rounded-2xl border-border/60 bg-white/60 p-5 shadow-2xs">
                  <div className="flex items-center gap-2 text-navy mb-2">
                    <Shield className="size-4 text-emerald-600" />
                    <span className="text-xs font-bold">
                      Community Guidelines
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-[0.72rem] text-muted-foreground leading-relaxed">
                    <li>
                      • Keep conversations professional, inclusive, and
                      supportive.
                    </li>
                    <li>
                      • Protect personal identifiable and financial information.
                    </li>
                    <li>
                      • Tag coordinators or grantors for official inquiries.
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

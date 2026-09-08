"use client";

import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ForumComposer } from "@/components/forum/ForumComposer";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { ForumPostCard } from "@/components/forum/ForumPostCard";
import { ForumSkeleton } from "@/components/forum/ForumSkeleton";
import { ForumThreadOverview } from "@/components/forum/ForumThreadOverview";
import { dedupeComments, dedupePosts, getInitials } from "@/components/forum/forum-utils";
import { useSidebar } from "@/components/SidebarContext";
import { useToast } from "@/components/ToastContext";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
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
  const [selectedPostDetails, setSelectedPostDetails] = useState<ForumPost | null>(null);
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
  const [submittingReply, setSubmittingReply] = useState<Record<number, boolean>>({});

  const isStaff = ["ADMIN", "COORDINATOR", "GRANTOR"].includes(user?.role || "");

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
        // Real-time sync of updated views and comments count into the posts feed list
        setPosts((prev) =>
          prev.map((p) =>
            p.post_id === id
              ? {
                  ...p,
                  views_count: details.views_count,
                  comments_count: details.comments?.length ?? p.comments_count,
                }
              : p,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to load post details:", err);
    }
  }, []);

  const handleSelectPost = useCallback(
    (id: number) => {
      setSelectedId(id);
      loadPostDetails(id);
    },
    [loadPostDetails],
  );

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
          prev.map((p) => (p.post_id === selectedId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p)),
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
      const finalTitle = titleText || (contentText.length > 50 ? `${contentText.slice(0, 48)}...` : contentText);
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
        prev.map((p) => (p.post_id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p)),
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
    if (!window.confirm("Are you sure you want to delete this discussion?")) return;
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
      setPosts((prev) => prev.map((p) => (p.post_id === postId ? { ...p, is_pinned: updated.is_pinned } : p)));
      if (selectedPostDetails?.post_id === postId) {
        setSelectedPostDetails((prev) => (prev ? { ...prev, is_pinned: updated.is_pinned } : prev));
      }
      showToast(updated.is_pinned ? "Thread pinned to top!" : "Thread unpinned.", "success");
    } catch (err) {
      console.error("Failed to pin post:", err);
      showToast("Failed to toggle pin.", "error");
    }
  };

  const activePost = useMemo(() => {
    return selectedPostDetails || posts.find((p) => p.post_id === selectedId) || posts[0] || null;
  }, [selectedPostDetails, posts, selectedId]);

  const otherPosts = useMemo(() => {
    return posts.filter((p) => p.post_id !== activePost?.post_id);
  }, [posts, activePost]);

  const authorDisplayName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email?.split("@")[0] || "Scholar"
    : "Scholar";
  const userInitials = getInitials(authorDisplayName);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FAF8F5]">
      <ForumHeader
        title={title}
        subtitle={subtitle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleMobile={toggleMobile}
        onStartDiscussion={() => {
          setIsComposing(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {loading ? (
        <ForumSkeleton />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-3.5 pb-6 md:px-8 md:pt-4 md:pb-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
              {/* LEFT COLUMN: Discussion Feed & Composer */}
              <div className="space-y-3.5 lg:col-span-8">
                <ForumComposer
                  userInitials={userInitials}
                  isComposing={isComposing}
                  onOpenCompose={() => setIsComposing(true)}
                  onCloseCompose={() => {
                    setIsComposing(false);
                    setDraftTitle("");
                    setDraftContent("");
                  }}
                  draftTitle={draftTitle}
                  onTitleChange={setDraftTitle}
                  draftContent={draftContent}
                  onContentChange={setDraftContent}
                  onSubmit={handleCreatePost}
                  submitting={submittingPost}
                />

                {/* Feed Header info */}
                <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-navy">
                    {searchQuery ? `Search results for "${searchQuery}"` : "All Discussions"} ({posts.length})
                  </span>
                </div>

                {/* Empty State */}
                {posts.length === 0 && (
                  <Card className="rounded-2xl border-dashed border-border/80 bg-white p-12 text-center shadow-xs">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-tint text-muted-foreground">
                      <MessageCircle className="size-6" />
                    </div>
                    <CardTitle className="text-base text-navy">No discussions yet</CardTitle>
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
                  const isReplying = openReplyId === post.post_id;
                  const rawComments =
                    isSelected && selectedPostDetails?.comments ? selectedPostDetails.comments : post.comments || [];
                  const comments = dedupeComments(rawComments);

                  return (
                    <ForumPostCard
                      key={`forum-post-${post.post_id}`}
                      post={post}
                      isSelected={isSelected}
                      isAuthor={isAuthor}
                      isStaff={isStaff}
                      isReplying={isReplying}
                      comments={comments}
                      replyDraft={replyDrafts[post.post_id] || ""}
                      submittingReply={!!submittingReply[post.post_id]}
                      onSelect={() => handleSelectPost(post.post_id)}
                      onToggleReply={() => {
                        handleSelectPost(post.post_id);
                        setOpenReplyId(isReplying ? null : post.post_id);
                      }}
                      onReplyDraftChange={(val) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [post.post_id]: val,
                        }))
                      }
                      onSubmitReply={() => handleAddReply(post.post_id)}
                      onTogglePin={() => handleTogglePin(post.post_id)}
                      onDelete={() => handleDeletePost(post.post_id)}
                    />
                  );
                })}
              </div>

              {/* RIGHT COLUMN: Active Thread Spotlight & Community Guidelines */}
              <ForumThreadOverview activePost={activePost} otherPosts={otherPosts} onSelectPost={handleSelectPost} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

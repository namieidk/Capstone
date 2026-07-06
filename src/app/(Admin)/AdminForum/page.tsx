"use client";

import React, { useState } from "react";
import {
  TrashIcon,
  HeartIcon,
  CommentIcon,
  FORUM_POSTS,
  ADMIN,
  AMBER,
  s,
} from "@/components/AdminShared";

export default function AdminForumPage() {
  const [posts, setPosts] = useState(FORUM_POSTS);
  const [draft, setDraft] = useState("");

  const toggleLike = (id: number) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)));
  };

  const removePost = (id: number) => setPosts((prev) => prev.filter((p) => p.id !== id));

  const submitPost = () => {
    if (!draft.trim()) return;
    setPosts((prev) => [
      { id: Date.now(), author: ADMIN.name, initials: ADMIN.initials, role: "Main Admin", time: "Just now", text: draft, likes: 0, comments: 0, liked: false },
      ...prev,
    ]);
    setDraft("");
  };

  return (
    <div style={s.pageWrap}>
      <div style={s.composerCard}>
        <span style={s.convoAvatar}>{ADMIN.initials}</span>
        <div style={{ flexGrow: 1 }}>
          <textarea
            style={s.composerInput}
            placeholder="Post an announcement to all scholars..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div style={s.composerActionsRow}>
            <span style={s.composerHint}>Posting as Main Admin</span>
            <button onClick={submitPost} style={s.continueBtnSmall}>
              Post
            </button>
          </div>
        </div>
      </div>

      <div style={s.forumFeed}>
        {posts.map((post) => (
          <div key={post.id} style={s.forumPostCard}>
            <div style={s.forumPostHeader}>
              <span style={s.convoAvatar}>{post.initials}</span>
              <div style={{ flexGrow: 1 }}>
                <p style={s.forumPostAuthor}>{post.author}</p>
                <p style={s.forumPostMeta}>
                  {post.role} · {post.time}
                </p>
              </div>
              <button onClick={() => removePost(post.id)} style={s.forumModerateBtn} title="Remove post">
                <TrashIcon />
              </button>
            </div>
            <p style={s.forumPostText}>{post.text}</p>
            <div style={s.forumPostActions}>
              <button onClick={() => toggleLike(post.id)} style={{ ...s.forumActionBtn, color: post.liked ? AMBER : "#7a7a74" }}>
                <HeartIcon filled={post.liked} /> {post.likes}
              </button>
              <button style={s.forumActionBtn}>
                <CommentIcon /> {post.comments}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
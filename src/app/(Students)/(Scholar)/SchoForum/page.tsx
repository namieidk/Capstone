"use client";

import React, { useState } from "react";
import {
  ImageIcon,
  VideoIcon,
  HeartIcon,
  CommentIcon,
  FORUM_POSTS,
  SCHOLAR,
  AMBER,
  s,
} from "@/components/ScholarShared";

export default function SchoForumPage() {
  const [posts, setPosts] = useState(FORUM_POSTS);
  const [draft, setDraft] = useState("");

  const toggleLike = (id: number) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)));
  };

  const submitPost = () => {
    if (!draft.trim()) return;
    setPosts((prev) => [
      {
        id: Date.now(),
        author: SCHOLAR.name,
        initials: SCHOLAR.initials,
        role: `${SCHOLAR.course}, ${SCHOLAR.year}`,
        time: "Just now",
        text: draft,
        likes: 0,
        comments: 0,
        liked: false,
      },
      ...prev,
    ]);
    setDraft("");
  };

  return (
    <div style={s.pageWrap}>
      <h2 style={s.pageHeading}>Scholar forum</h2>
      <p style={s.pageSub}>Talk with other scholars across all tracks.</p>

      <div style={s.composerCard}>
        <span style={s.convoAvatar}>{SCHOLAR.initials}</span>
        <div style={{ flexGrow: 1 }}>
          <textarea
            style={s.composerInput}
            placeholder="Share something with fellow scholars..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div style={s.composerActionsRow}>
            <div style={s.composerIconRow}>
              <button style={s.composerIconBtn}>
                <ImageIcon />
              </button>
              <button style={s.composerIconBtn}>
                <VideoIcon />
              </button>
            </div>
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
              <div>
                <p style={s.forumPostAuthor}>{post.author}</p>
                <p style={s.forumPostMeta}>
                  {post.role} · {post.time}
                </p>
              </div>
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
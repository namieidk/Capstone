"use client";

import React, { useMemo, useState } from "react";
import {
  HeartIcon,
  CommentIcon,
  SendIcon,
  ImageIcon,
  VideoIcon,
  FORUM_POSTS,
  SCHOLAR,
  NAVY,
  AMBER,
  AMBER_BG,
  WHITE,
  TINT,
  LINE,
  MenuIcon,
  BellIcon,
  SearchIcon,
  s,
} from "@/components/ScholarShared";
import { useSidebar } from "@/components/SidebarContext";

// ---- local tokens (mirrors admin forum styling; not exported from ScholarShared) ----
const GOOD = "#6b8a3e";
const GOOD_BG = "#E9F0DC";
const SHADOW_SM = "0 4px 14px rgba(20,33,58,0.05)";
const BORDER_SUBTLE = `1px solid ${LINE}`;

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" />
    </svg>
  );
}

interface Reply {
  id: number;
  author: string;
  initials: string;
  text: string;
  time: string;
}

function deriveTitle(text: string) {
  const firstLine = text.split("\n")[0];
  const firstSentence = firstLine.split(/(?<=[.!?])\s/)[0];
  return firstSentence.length > 58 ? firstSentence.slice(0, 56) + "…" : firstSentence;
}

export default function ScholarForumPage() {
  const { toggleMobile } = useSidebar();
  const [posts, setPosts] = useState(FORUM_POSTS);
  const [draft, setDraft] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(FORUM_POSTS[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState("");

  // response state: which post's reply box is open, and per-post reply drafts/lists
  const [openReplyId, setOpenReplyId] = useState<number | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [repliesByPost, setRepliesByPost] = useState<Record<number, Reply[]>>({});

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
    );
  };

  const removePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(posts.find((p) => p.id !== id)?.id ?? null);
  };

  const submitPost = () => {
    if (!draft.trim()) return;
    const newPost = {
      id: Date.now(),
      author: SCHOLAR.name,
      initials: SCHOLAR.initials,
      role: `${SCHOLAR.course}, ${SCHOLAR.year}`,
      time: "Just now",
      text: draft,
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setSelectedId(newPost.id);
    setDraft("");
  };

  const submitReply = (postId: number) => {
    const text = (replyDrafts[postId] ?? "").trim();
    if (!text) return;
    const reply: Reply = { id: Date.now(), author: SCHOLAR.name, initials: SCHOLAR.initials, text, time: "Just now" };
    setRepliesByPost((prev) => ({ ...prev, [postId]: [...(prev[postId] ?? []), reply] }));
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p)));
    setReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  // Search matches the thread title, body text, or author name.
  const query = searchQuery.trim().toLowerCase();
  const filteredPosts = useMemo(() => {
    if (!query) return posts;
    return posts.filter(
      (p) => p.text.toLowerCase().includes(query) || p.author.toLowerCase().includes(query) || deriveTitle(p.text).toLowerCase().includes(query)
    );
  }, [posts, query]);

  const selectedPost = filteredPosts.find((p) => p.id === selectedId) ?? filteredPosts[0];
  const others = filteredPosts.filter((p) => p.id !== selectedPost?.id);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .forum-topbar-actions { flex-wrap: wrap; }
      `}</style>

      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button className="vd-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Forum</h1>
          <p style={s.topbarSub}>Talk with other scholars across all tracks.</p>
        </div>
        <div className="forum-topbar-actions" style={{ ...s.topbarRight, gap: 10 }}>
          <div className="vd-topbar-search" style={s.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={s.searchInput}
            />
          </div>
          <button style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      {/* flexGrow + minHeight:0 + overflow:auto — only this area scrolls */}
      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflow: "auto" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "20px 4px 60px" }}>
          {/* ---- Two-column layout ---- */}
          <div
            className="vd-content-grid"
            style={{ display: "grid", gridTemplateColumns: "1.75fr 1fr", gap: 20, alignItems: "start" }}
          >
            {/* LEFT: composer + thread list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* ---- New thread bar ---- */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: WHITE,
                  border: `1px solid ${LINE}`,
                  borderRadius: 14,
                  padding: "12px 14px 12px 18px",
                  boxShadow: SHADOW_SM,
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: AMBER_BG,
                    color: "#7A5C0A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    flexShrink: 0,
                  }}
                >
                  {SCHOLAR.initials}
                </span>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitPost()}
                  placeholder="Share something with fellow scholars..."
                  style={{ flexGrow: 1, border: "none", outline: "none", background: "transparent", fontSize: "0.88rem", color: "#2B2B28" }}
                />
                <button style={{ width: 34, height: 34, borderRadius: 10, background: TINT, color: "#7a7a74", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ImageIcon />
                </button>
                <button style={{ width: 34, height: 34, borderRadius: 10, background: TINT, color: "#7a7a74", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <VideoIcon />
                </button>
                <button
                  onClick={submitPost}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: NAVY,
                    color: WHITE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "1.15rem",
                    lineHeight: 1,
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              {filteredPosts.length === 0 && (
                <p style={{ textAlign: "center", padding: "40px 0", color: "#9a9a94", fontSize: "0.9rem" }}>
                  No threads match your search.
                </p>
              )}

              {filteredPosts.map((post) => {
                const isSelected = post.id === selectedPost?.id;
                const stackAuthors = filteredPosts.filter((p) => p.id !== post.id).slice(0, 3);
                const extraCount = Math.max(0, filteredPosts.length - 1 - stackAuthors.length);
                const isReplying = openReplyId === post.id;
                const replies = repliesByPost[post.id] ?? [];
                const isOwnPost = post.author === SCHOLAR.name;

                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedId(post.id)}
                    style={{
                      background: WHITE,
                      border: isSelected ? `1px solid ${AMBER}` : `1px solid ${LINE}`,
                      borderRadius: 16,
                      padding: "20px 22px",
                      boxShadow: isSelected ? "0 6px 20px rgba(30,58,95,0.10)" : SHADOW_SM,
                      cursor: "pointer",
                      transition: "box-shadow 0.15s ease, border-color 0.15s ease",
                    }}
                  >
                    {/* title row */}
                    <h3
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "1.08rem",
                        fontWeight: 700,
                        color: NAVY,
                        marginBottom: 14,
                        lineHeight: 1.3,
                      }}
                    >
                      {deriveTitle(post.text)}
                    </h3>

                    {/* author row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: AMBER_BG,
                          color: "#7A5C0A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          flexShrink: 0,
                        }}
                      >
                        {post.initials}
                      </span>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "0.84rem", fontWeight: 700, color: NAVY }}>{post.author}</p>
                        <p style={{ fontSize: "0.72rem", color: "#9a9a94" }}>{post.time}</p>
                      </div>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "5px 12px",
                          borderRadius: 999,
                          background: TINT,
                          color: NAVY,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.role}
                      </span>
                      {isOwnPost && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePost(post.id);
                          }}
                          style={{ color: "#c0817a", flexShrink: 0, opacity: 0.7, cursor: "pointer" }}
                          title="Remove post"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>

                    {/* body */}
                    <p style={{ fontSize: "0.88rem", color: "#3a3a36", lineHeight: 1.65, marginBottom: 16 }}>{post.text}</p>

                    {/* footer row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(post.id);
                          }}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: TINT,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: post.liked ? AMBER : "#8a8a84",
                            cursor: "pointer",
                          }}
                          title="Like"
                        >
                          <HeartIcon filled={post.liked} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenReplyId(isReplying ? null : post.id);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: isReplying ? AMBER_BG : TINT,
                            color: isReplying ? "#7A5C0A" : NAVY,
                            fontWeight: 600,
                            fontSize: "0.78rem",
                            padding: "8px 16px",
                            borderRadius: 999,
                            cursor: "pointer",
                          }}
                        >
                          <CommentIcon /> Reply
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        {stackAuthors.map((a, i) => (
                          <span
                            key={a.id}
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: AMBER_BG,
                              color: "#7A5C0A",
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: `2px solid ${WHITE}`,
                              marginLeft: i === 0 ? 0 : -9,
                            }}
                          >
                            {a.initials}
                          </span>
                        ))}
                        {extraCount > 0 && (
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: TINT,
                              color: NAVY,
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: `2px solid ${WHITE}`,
                              marginLeft: -9,
                            }}
                          >
                            +{extraCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ---- Responses list ---- */}
                    {replies.length > 0 && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${TINT}`, display: "flex", flexDirection: "column", gap: 12 }}>
                        {replies.map((r) => (
                          <div key={r.id} style={{ display: "flex", gap: 10 }}>
                            <span
                              style={{
                                width: 26,
                                height: 26,
                                borderRadius: "50%",
                                background: TINT,
                                color: NAVY,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "0.62rem",
                                flexShrink: 0,
                              }}
                            >
                              {r.initials}
                            </span>
                            <div style={{ background: TINT, borderRadius: 12, padding: "8px 12px", flexGrow: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>{r.author}</span>
                                <span style={{ fontSize: "0.68rem", color: "#9a9a94", whiteSpace: "nowrap" }}>{r.time}</span>
                              </div>
                              <p style={{ fontSize: "0.82rem", color: "#3a3a36", lineHeight: 1.5 }}>{r.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ---- Inline reply composer ---- */}
                    {isReplying && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ marginTop: 14, paddingTop: replies.length > 0 ? 0 : 14, borderTop: replies.length > 0 ? "none" : `1px solid ${TINT}`, display: "flex", gap: 10 }}
                      >
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: AMBER_BG,
                            color: "#7A5C0A",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            flexShrink: 0,
                          }}
                        >
                          {SCHOLAR.initials}
                        </span>
                        <div style={{ flexGrow: 1, display: "flex", gap: 8 }}>
                          <input
                            autoFocus
                            value={replyDrafts[post.id] ?? ""}
                            onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && submitReply(post.id)}
                            placeholder="Write a response..."
                            style={{
                              flexGrow: 1,
                              border: `1px solid ${LINE}`,
                              outline: "none",
                              background: "#F7F9FB",
                              borderRadius: 999,
                              padding: "8px 16px",
                              fontSize: "0.82rem",
                              color: "#2B2B28",
                            }}
                          />
                          <button
                            onClick={() => submitReply(post.id)}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: NAVY,
                              color: WHITE,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              cursor: "pointer",
                            }}
                            title="Send"
                          >
                            <SendIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT: compact profile card */}
            {selectedPost && (
              <div style={{ position: "sticky", top: 24 }}>
                <div style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, padding: "22px 20px", boxShadow: SHADOW_SM }}>
                  <p style={{ fontSize: "1.02rem", fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>
                    {selectedPost.role}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#9a9a94", marginBottom: 20 }}>Thread: {deriveTitle(selectedPost.text)}</p>

                  {/* avatar + name */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 18 }}>
                    <span
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: AMBER_BG,
                        color: "#7A5C0A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        marginBottom: 12,
                        border: `3px solid ${WHITE}`,
                        boxShadow: SHADOW_SM,
                      }}
                    >
                      {selectedPost.initials}
                    </span>
                    <p style={{ fontSize: "0.96rem", fontWeight: 700, color: NAVY, marginBottom: 6, textAlign: "center" }}>{selectedPost.author}</p>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: GOOD_BG, color: GOOD }}>
                      {selectedPost.role}
                    </span>
                  </div>

                  {/* stats row */}
                  <div style={{ display: "flex", justifyContent: "space-around", padding: "14px 0", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, marginBottom: 20 }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: NAVY }}>{selectedPost.likes}</p>
                      <p style={{ fontSize: "0.7rem", color: "#9a9a94" }}>Likes</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: NAVY }}>
                        {selectedPost.comments + (repliesByPost[selectedPost.id]?.length ?? 0) - selectedPost.comments + (repliesByPost[selectedPost.id]?.length ?? 0) === 0 ? selectedPost.comments : selectedPost.comments}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#9a9a94" }}>Replies</p>
                    </div>
                  </div>

                  {/* other threads */}
                  <div>
                    <p style={{ fontSize: "0.76rem", fontWeight: 700, color: "#9a9a94", marginBottom: 12 }}>
                      {others.length} other threads
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 280, overflowY: "auto" }}>
                      {others.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setSelectedId(o.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 8px",
                            borderRadius: 9,
                            textAlign: "left",
                            width: "100%",
                            cursor: "pointer",
                          }}
                        >
                          <span
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: TINT,
                              color: NAVY,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.64rem",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {o.initials}
                          </span>
                          <span style={{ fontSize: "0.8rem", color: "#3a3a36", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {o.author}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import {
  SendIcon,
  SearchIcon,
  CONVERSATIONS,
  NAVY,
  AMBER,
  AMBER_BG,
  WHITE,
  TINT,
  LINE,
  GOOD,
  BAD,
  s,
  MenuIcon,
} from "@/components/Grantorshared";
import { useSidebar } from "@/components/SidebarContext";

const BORDER_SUBTLE = `1px solid ${LINE}`;
const SHADOW_SM = "0 1px 3px rgba(0,0,0,0.04)";

export default function GrantorMessagePage() {
  const { toggleMobile } = useSidebar();

  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");
  const [convos, setConvos] = useState(CONVERSATIONS);
  const [query, setQuery] = useState("");

  const active = convos.find((c) => c.id === activeId)!;
  const filtered = convos.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  const sendMessage = () => {
    if (!draft.trim()) return;
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { from: "me" as const, text: draft, time: "Just now" }], lastMessage: draft }
          : c
      )
    );
    setDraft("");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button className="vg-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Messages</h1>
          <p style={s.topbarSub}>Conversations with your ViaScholar coordinator.</p>
        </div>
      </header>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "12px 4px 12px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          className="vg-messages-shell"
          style={{
            display: "grid",
            gridTemplateColumns: "340px 1fr",
            gap: 0,
            background: WHITE,
            border: BORDER_SUBTLE,
            borderRadius: 22,
            overflow: "hidden",
            flexGrow: 1,
            minHeight: 0,
            boxShadow: SHADOW_SM,
          }}
        >
          {/* ================= LEFT: conversation list ================= */}
          <div style={{ borderRight: `1px solid ${LINE}`, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ padding: "22px 20px 16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: TINT,
                  borderRadius: 999,
                  padding: "10px 16px",
                }}
              >
                <SearchIcon />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  style={{ flexGrow: 1, border: "none", outline: "none", background: "transparent", fontSize: "0.86rem", color: "#2B2B28" }}
                />
              </div>
            </div>

            <div style={{ flexGrow: 1, overflowY: "auto", padding: "0 12px 12px", minHeight: 0 }}>
              {filtered.map((c) => {
                const isActive = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      width: "100%",
                      textAlign: "left",
                      padding: "13px 12px",
                      borderRadius: 14,
                      background: isActive ? AMBER_BG : "transparent",
                      border: isActive ? `1px solid ${AMBER}` : "1px solid transparent",
                      marginBottom: 4,
                      cursor: "pointer",
                      transition: "background-color 0.12s ease",
                    }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <span
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          background: isActive ? WHITE : TINT,
                          color: NAVY,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                        }}
                      >
                        {c.initials}
                      </span>
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: c.unread > 0 ? GOOD : "#c2c2bd",
                          border: `2px solid ${isActive ? AMBER_BG : WHITE}`,
                        }}
                      />
                    </div>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {c.name}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "#9a9a94", flexShrink: 0 }}>{c.time}</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#8a8a84", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.lastMessage}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span
                        style={{
                          flexShrink: 0,
                          marginTop: 2,
                          background: BAD,
                          color: WHITE,
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          borderRadius: 999,
                          minWidth: 18,
                          height: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 5px",
                        }}
                      >
                        {c.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT: thread ================= */}
          <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 26px",
                borderBottom: `1px solid ${LINE}`,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: AMBER_BG,
                    color: "#7A5C0A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    flexShrink: 0,
                  }}
                >
                  {active.initials}
                </span>
                <div>
                  <p style={{ fontSize: "0.98rem", fontWeight: 700, color: NAVY }}>{active.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "#9a9a94" }}>{active.role}</p>
                </div>
              </div>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: GOOD,
                  background: "#DDEEE3",
                  padding: "6px 14px",
                  borderRadius: 999,
                }}
              >
                Active now
              </span>
            </div>

            {/* messages — this is the ONLY part that should scroll */}
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                minHeight: 0,
                padding: "24px 26px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                background: "#FBFCFD",
              }}
            >
              {active.messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "72%" }}>
                    <div
                      style={{
                        background: m.from === "me" ? NAVY : WHITE,
                        color: m.from === "me" ? WHITE : "#2B2B28",
                        border: m.from === "me" ? "none" : `1px solid ${LINE}`,
                        borderRadius: m.from === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        padding: "12px 17px",
                        fontSize: "0.9rem",
                        lineHeight: 1.55,
                        boxShadow: m.from === "me" ? "0 4px 14px rgba(10,79,66,0.18)" : "none",
                      }}
                    >
                      {m.text}
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#b5b5af", marginTop: 5, textAlign: m.from === "me" ? "right" : "left" }}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* composer */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 22px", borderTop: `1px solid ${LINE}`, flexShrink: 0 }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type something..."
                style={{
                  flexGrow: 1,
                  border: `1px solid ${LINE}`,
                  outline: "none",
                  background: "#F7F9FB",
                  borderRadius: 999,
                  padding: "13px 20px",
                  fontSize: "0.9rem",
                  color: "#2B2B28",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!draft.trim()}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: draft.trim() ? NAVY : TINT,
                  color: draft.trim() ? WHITE : "#b5b5af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  cursor: draft.trim() ? "pointer" : "default",
                  boxShadow: draft.trim() ? "0 4px 14px rgba(10,79,66,0.25)" : "none",
                  transition: "background-color 0.15s ease",
                }}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
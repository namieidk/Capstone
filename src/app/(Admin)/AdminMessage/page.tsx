"use client";

import React, { useState } from "react";
import { SendIcon, CONVERSATIONS, AMBER_BG, s } from "@/components/AdminShared";

export default function AdminMessagePage() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");
  const [convos, setConvos] = useState(CONVERSATIONS);

  const active = convos.find((c) => c.id === activeId)!;

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
    <div className="va-messages-shell" style={s.messagesShell}>
      <div style={s.convoListCol}>
        {convos.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            style={{ ...s.convoListItem, background: c.id === activeId ? AMBER_BG : "transparent" }}
          >
            <span style={s.convoAvatar}>{c.initials}</span>
            <div style={s.convoListTextCol}>
              <div style={s.convoListTopRow}>
                <span style={s.convoListName}>{c.name}</span>
                <span style={s.convoListTime}>{c.time}</span>
              </div>
              <p style={s.convoListPreview}>{c.lastMessage}</p>
            </div>
            {c.unread > 0 && <span style={s.convoUnreadDot}>{c.unread}</span>}
          </button>
        ))}
      </div>

      <div style={s.convoThreadCol}>
        <div style={s.convoThreadHeader}>
          <span style={s.convoAvatar}>{active.initials}</span>
          <div>
            <p style={s.convoThreadName}>{active.name}</p>
            <p style={s.convoThreadRole}>{active.role}</p>
          </div>
        </div>
        <div style={s.convoThreadBody}>
          {active.messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start", marginBottom: 14 }}>
              <div>
                <div style={m.from === "me" ? s.bubbleMine : s.bubbleTheirs}>{m.text}</div>
                <p style={{ ...s.bubbleTime, textAlign: m.from === "me" ? "right" : "left" }}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={s.convoComposer}>
          <input
            style={s.convoInput}
            placeholder="Write a message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} style={s.convoSendBtn}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
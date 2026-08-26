"use client";

import React from "react";
import {
  Layers,
  Contact,
  ChevronDown,
  FileCheck2,
  Building2,
  UserCheck,
  Globe2,
  Plus,
  LucideIcon,
} from "lucide-react";
import {
  NAVY,
  CREAM,
  AMBER,
  GREEN,
  GREEN_BG,
  WHITE,
  GRAY,
  LINE,
  TINT,
  GOOD,
  WARN,
  BAD,
  SHADOW_SM,
  BORDER_SUBTLE,
  MenuIcon,
  BellIcon,
} from "@/components/Adminshared";
import { useSidebar } from "@/components/SidebarContext";

/* ------------------------------------------------------------------ */
/* Mock data — swap for your real ORG_KPIS / PIPELINE_COUNTS /        */
/* ADMIN_ACTIVITY_FEED / UPCOMING_FOR_ADMIN once wired to your API.   */
/* ------------------------------------------------------------------ */

interface QuickAction {
  label: string;
  icon: LucideIcon;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Review New\nApplications", icon: FileCheck2 },
  { label: "Assign to\nCoordinator", icon: Building2 },
  { label: "Approve\nSame Batch", icon: UserCheck },
  { label: "Transfer to\nPartner School", icon: Globe2 },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const APPROVED = [18, 40, 28, 50, 46, 38, 62];
const SUBMITTED = [62, 78, 46, 58, 66, 60, 74];

interface PipelineItem {
  label: string;
  value: number;
  icon: LucideIcon;
}

const PIPELINE: PipelineItem[] = [
  { label: "New applications", value: 21, icon: FileCheck2 },
  { label: "Under review", value: 14, icon: Layers },
  { label: "Interview stage", value: 9, icon: Contact },
];

type ActivityTone = "good" | "warn" | "bad";

interface ActivityItem {
  name: string;
  detail: string;
  value: string;
  tone: ActivityTone;
}

const ACTIVITY: ActivityItem[] = [
  { name: "Carlo Bautista", detail: "24-Dec-2025 12:33 PM", value: "Flagged", tone: "bad" },
  { name: "Reign P.", detail: "24-Dec-2025 09:54 AM", value: "Accepted", tone: "good" },
  { name: "Grace Tolentino", detail: "02-Dec-2025 05:15 PM", value: "Terminated", tone: "warn" },
];

/* ------------------------------------------------------------------ */

type Point = [number, number];

function smoothPath(values: number[], w: number, h: number, pad: number = 4): { d: string; pts: Point[] } {
  const max = 100;
  const stepX = w / (values.length - 1);
  const pts: Point[] = values.map((v, i) => [i * stepX, h - pad - (v / max) * (h - pad * 2)]);
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return { d, pts };
}

export default function AdminDashboard() {
  const { toggleMobile } = useSidebar();

  const nav = (label: string): void => console.log(`navigate → ${label}`);
  const W = 760, H = 220;
  const approvedLine = smoothPath(APPROVED, W, H);
  const submittedLine = smoothPath(SUBMITTED, W, H);
  const areaPath = `${approvedLine.d} L ${W},${H} L 0,${H} Z`;

  const renewalPct = 91;
  const r = 34, c = 2 * Math.PI * r;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap');
        .tile { transition: box-shadow 0.15s ease, transform 0.15s ease; cursor: pointer; }
        .tile:hover { box-shadow: 0 10px 28px rgba(30,58,95,0.12); transform: translateY(-2px); }
        .iconring { transition: background-color 0.2s ease, border-color 0.2s ease; }
        .tile:hover .iconring { background: var(--ring-color); border-color: var(--ring-color); }
        .tile:hover .iconring svg { color: ${WHITE} !important; }
        .cta:hover { gap: 8px !important; color: ${NAVY} !important; }
        .cta { transition: gap 0.2s ease, color 0.2s ease; }
        .addcard { transition: background-color 0.15s ease; }
        .addcard:hover { background-color: ${GREEN} !important; color: ${WHITE} !important; }
        .weekBtn { transition: background-color 0.15s ease; }
        .weekBtn:hover { background-color: #16304F !important; }
      `}</style>

      {/* ---------------- Page-level navbar (hardcoded, no search) ---------------- */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: WHITE,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          padding: "14px clamp(18px, 3.2vw, 32px)",
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <button
          className="va-mobile-toggle"
          onClick={toggleMobile}
          style={{ display: "none", marginRight: 8 }}
        >
          <MenuIcon />
        </button>
        <div>
          <h1 style={{ fontSize: "clamp(1.1rem, 1vw + 0.92rem, 1.28rem)", fontWeight: 700, color: NAVY, marginBottom: 2, lineHeight: 1.2 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#7a7a74" }}>Overview of scholarship program activity.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            style={{
              position: "relative",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: TINT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BellIcon />
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: AMBER,
                border: `2px solid ${TINT}`,
              }}
            />
          </button>
        </div>
      </header>

      <div
        style={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: "auto",
          fontFamily: "'Inter', -apple-system, sans-serif",
          background: CREAM,
          color: "#2B2B28",
          width: "100%",
          padding: "24px 28px",
          boxSizing: "border-box",
        }}
      >
        {/* Main */}
        <main style={{ width: "100%" }}>
          {/* Quick action tiles — alternates amber / green so the two
              accent colors both show up at the very top of the page */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 20 }}>
            {QUICK_ACTIONS.map((qa, i) => {
              const Icon = qa.icon;
              const ringColor = i % 2 === 0 ? AMBER : GREEN;
              return (
                <div
                  key={qa.label}
                  className="tile"
                  onClick={() => nav(qa.label)}
                  style={{
                    background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM,
                    padding: "24px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    ["--ring-color" as string]: ringColor,
                  } as React.CSSProperties}
                >
                  <p style={{ fontSize: 14.5, fontWeight: 600, margin: 0, whiteSpace: "pre-line", lineHeight: 1.4, color: NAVY }}>
                    {qa.label}
                  </p>
                  <span
                    className="iconring"
                    style={{
                      width: 50, height: 50, borderRadius: "50%", border: `1.5px solid ${ringColor}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      color: ringColor,
                    }}
                  >
                    <Icon size={21} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart + Pipeline row */}
          <div style={{ display: "grid", gridTemplateColumns: "2.6fr 1fr", gap: 18, marginBottom: 18 }}>
            {/* Chart card */}
            <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "28px 30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <Legend color={AMBER} label="Approved" />
                  <Legend color={GREEN} label="Submitted" dashed />
                  <button
                    className="weekBtn"
                    style={{
                      display: "flex", alignItems: "center", gap: 6, background: NAVY,
                      border: `1px solid ${NAVY}`, borderRadius: 8, padding: "9px 15px",
                      color: WHITE, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Week <ChevronDown size={14} />
                  </button>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 15.5, color: "#7a7a74", fontWeight: 600 }}>Approved scholars</p>
                  <p style={{ margin: 0, fontSize: 40, fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif" }}>87</p>
                </div>
              </div>

              <svg viewBox={`0 0 ${W} 260`} width="100%" height={280} style={{ display: "block", marginTop: 14 }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={AMBER} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={AMBER} stopOpacity={0} />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((i) => (
                  <line key={i} x1="0" x2={W} y1={(260 / 4) * i + 6} y2={(260 / 4) * i + 6} stroke={LINE} strokeWidth="1" />
                ))}
                <path d={areaPath} fill="url(#areaFill)" />
                <path d={submittedLine.d} fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="5 5" />
                <path d={approvedLine.d} fill="none" stroke={AMBER} strokeWidth="2.5" />
                {approvedLine.pts.map(([x, y]: Point, i: number) => (
                  <circle key={i} cx={x} cy={y} r={i === 3 ? 5 : 3} fill={i === 3 ? WHITE : AMBER} stroke={AMBER} strokeWidth="2" />
                ))}
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                {WEEK_DAYS.map((d) => (
                  <span key={d} style={{ fontSize: 13, color: "#9a9a94" }}>{d}</span>
                ))}
              </div>
            </div>

            {/* Pipeline / bills-style list */}
            <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "26px 24px", display: "flex", flexDirection: "column" }}>
              <p style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif" }}>
                Pipeline
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
                {PIPELINE.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.label}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                        background: TINT, borderRadius: 14, padding: "24px 20px", flex: 1,
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600, color: NAVY, flex: 1 }}>{p.label}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: AMBER, fontFamily: "'Inter', sans-serif", textAlign: "right" }}>{p.value}</p>
                        <Icon size={24} color={AMBER} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activity + featured scholar card */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {/* Recent activity */}
            <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "24px 26px" }}>
              <p style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif" }}>
                Recent activity
              </p>
              {ACTIVITY.map((a, i) => {
                const toneColor = a.tone === "good" ? GOOD : a.tone === "warn" ? WARN : BAD;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                      padding: "14px 8px", borderRadius: 10,
                      borderBottom: i === ACTIVITY.length - 1 ? "none" : `1px solid ${TINT}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: toneColor, flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: 14.5, fontWeight: 600, color: NAVY }}>{a.name}</p>
                        <p style={{ margin: 0, fontSize: 12.5, color: "#9a9a94" }}>{a.detail}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: toneColor }}>{a.value}</span>
                  </div>
                );
              })}
            </div>

            {/* Featured scholar card + renewal donut */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18 }}>
              <div
                style={{
                  background: WHITE, border: BORDER_SUBTLE, boxShadow: SHADOW_SM, borderRadius: 18,
                  padding: "26px 24px", color: NAVY, display: "flex", flexDirection: "column",
                }}
              >
                <p style={{ margin: "0 0 18px", fontSize: 16.5, fontWeight: 700, fontFamily: "'Inter', sans-serif", color: NAVY }}>
                  Atty. Ramon Castillo
                </p>
                <p style={{ margin: "0 0 4px", fontSize: 12.5, color: "#9a9a94", fontWeight: 600 }}>Scholarship fund</p>
                <p style={{ margin: "0 0 22px", fontSize: 26, fontWeight: 700, fontFamily: "'Inter', sans-serif", color: NAVY }}>₱6.4M</p>
                <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${TINT}` }}>
                  <p style={{ margin: "0 0 4px", fontSize: 14, letterSpacing: "0.05em", fontWeight: 700, color: "#7A5C0A" }}>
                    BATCH 14 · CRDC
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9a9a94" }}>Term 2025–2026</p>
                </div>
              </div>

              <div
                style={{
                  background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM,
                  padding: "20px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <svg width="98" height="98" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r={r} fill="none" stroke={TINT} strokeWidth="9" />
                  <circle
                    cx="45" cy="45" r={r} fill="none" stroke={GREEN} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={c} strokeDashoffset={c - (renewalPct / 100) * c}
                    transform="rotate(-90 45 45)"
                  />
                  <text x="45" y="50" textAnchor="middle" fontSize="17" fontWeight="700" fill={NAVY}>
                    {renewalPct}%
                  </text>
                </svg>
                <p style={{ margin: "12px 0 0", fontSize: 13, color: "#9a9a94", textAlign: "center" }}>Renewal rate</p>
                <button
                  className="addcard"
                  onClick={() => nav("adminReports")}
                  style={{
                    marginTop: 14, width: "100%", background: GREEN_BG, border: `1px solid ${GREEN}`,
                    borderRadius: 9, padding: "10px 0", color: GREEN, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  }}
                >
                  <Plus size={13} /> View report
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface LegendProps {
  color: string;
  label: string;
  dashed?: boolean;
}

function Legend({ color, label, dashed }: LegendProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 14, height: dashed ? 2 : 8, borderRadius: dashed ? 0 : "50%", background: color }} />
      <span style={{ fontSize: 12.5, color: "#7a7a74" }}>{label}</span>
    </div>
  );
}
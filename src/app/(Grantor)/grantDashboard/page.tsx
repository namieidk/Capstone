"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  MonitorIcon,
  InterviewIcon,
  PaymentsIcon,
  TrendUpIcon,
  TrendDownIcon,
  DASHBOARD_STATS,
  ACTIVITY_FEED,
  UPCOMING_MEETINGS,
  GOOD,
  BAD,
  TINT,
  WARN_BG,
  WARN,
  AMBER_BG,
  GOOD_BG,
  LINE,
  s,
} from "@/components/Grantorshared";

const TONE_MAP: Record<string, { bg: string; text: string }> = {
  neutral: { bg: TINT, text: "#6b6b66" },
  warn: { bg: WARN_BG, text: WARN },
  amber: { bg: AMBER_BG, text: "#6b5220" },
  good: { bg: GOOD_BG, text: GOOD },
};

export default function GrantorDashboardPage() {
  const router = useRouter();

  return (
    <div>
      <div className="vg-stat-row" style={s.statRow}>
        {DASHBOARD_STATS.map((p) => (
          <div key={p.label} style={s.pipelineCard}>
            <div style={s.pipelineTopRow}>
              <p style={s.pipelineLabel}>{p.label}</p>
              <span style={{ ...s.pipelineTag, background: TONE_MAP[p.tone].bg, color: TONE_MAP[p.tone].text }}>this term</span>
            </div>
            <p style={s.pipelineValue}>{p.value}</p>
            <div style={s.pipelineKpiRow}>
              <span style={{ color: p.kpiDirection === "up" ? GOOD : BAD, display: "flex", alignItems: "center", gap: 4 }}>
                {p.kpiDirection === "up" ? <TrendUpIcon /> : <TrendDownIcon />}
                {p.kpi}
              </span>
              <span style={s.pipelineKpiLabel}>vs last term</span>
            </div>
          </div>
        ))}
      </div>

      <div className="vg-content-grid" style={s.contentGrid}>
        <section style={s.feedCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Recent activity</h2>
            <button onClick={() => router.push("/grantorMonitor")} style={s.viewAllBtn}>
              View all <ArrowRightIcon />
            </button>
          </div>
          <div style={s.feedList}>
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} style={{ ...s.feedRow, borderBottom: i === ACTIVITY_FEED.length - 1 ? "none" : `1px solid ${LINE}` }}>
                <span style={s.feedIconBox}>{item.icon}</span>
                <div style={s.feedTextCol}>
                  <p style={s.feedText}>{item.text}</p>
                  <p style={s.feedTime}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={s.upcomingCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Upcoming meetings</h2>
            <button onClick={() => router.push("/grantorMeeting")} style={s.viewAllBtn}>
              Manage <ArrowRightIcon />
            </button>
          </div>
          <div style={s.upcomingList}>
            {UPCOMING_MEETINGS.map((m) => (
              <div key={m.id} style={s.upcomingRow}>
                <span style={s.convoAvatar}>PR</span>
                <div>
                  <p style={s.upcomingLabel}>{m.title}</p>
                  <p style={s.upcomingDetail}>
                    {m.date} · {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={s.quickLinksWrap}>
            <p style={s.quickLinksHeading}>Quick actions</p>
            <button onClick={() => router.push("/grantorMonitor")} style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <MonitorIcon />
              </span>
              <span>Check scholar standing</span>
              <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                <ArrowRightIcon />
              </span>
            </button>
            <button onClick={() => router.push("/grantorMeeting")} style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <InterviewIcon />
              </span>
              <span>Schedule a meeting</span>
              <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                <ArrowRightIcon />
              </span>
            </button>
            <button onClick={() => router.push("/grantorPayments")} style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <PaymentsIcon />
              </span>
              <span>Review pending payments</span>
              <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                <ArrowRightIcon />
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
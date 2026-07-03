"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  PeopleIcon,
  InterviewIcon,
  MonitorIcon,
  PaymentsIcon,
  TrendUpIcon,
  TrendDownIcon,
  PIPELINE_COUNTS,
  ACTIVITY_FEED,
  UPCOMING_INTERVIEWS,
  TONE_MAP,
  GOOD,
  BAD,
  LINE,
  s,
} from "@/components/Coordinatorshared";

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      <div className="vc-stat-row" style={s.statRow}>
        {PIPELINE_COUNTS.map((p) => (
          <div key={p.label} style={s.pipelineCard}>
            <div style={s.pipelineTopRow}>
              <div>
                <p style={s.pipelineLabel}>{p.label}</p>
                <span style={{ ...s.pipelineTag, background: TONE_MAP[p.tone].bg, color: TONE_MAP[p.tone].text }}>applicants</span>
              </div>
              <p style={s.pipelineValue}>{p.value}</p>
            </div>
            <div style={s.pipelineKpiRow}>
              <span style={{ color: p.kpiDirection === "up" ? GOOD : BAD, display: "flex", alignItems: "center", gap: 4 }}>
                {p.kpiDirection === "up" ? <TrendUpIcon /> : <TrendDownIcon />}
                {p.kpi}
              </span>
              <span style={s.pipelineKpiLabel}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="vc-content-grid" style={s.contentGrid}>
        <section style={s.feedCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Recent activity</h2>
            <button onClick={() => router.push("/applicants")} style={s.viewAllBtn}>
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
            <h2 style={s.cardHeading}>Upcoming interviews</h2>
            <button onClick={() => router.push("/meeting")} style={s.viewAllBtn}>
              Manage <ArrowRightIcon />
            </button>
          </div>
          <div style={s.upcomingList}>
            {UPCOMING_INTERVIEWS.map((iv) => (
              <div key={iv.id} style={s.upcomingRow}>
                <span style={s.convoAvatar}>{iv.initials}</span>
                <div>
                  <p style={s.upcomingLabel}>{iv.name}</p>
                  <p style={s.upcomingDetail}>
                    {iv.date} · {iv.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={s.quickLinksWrap}>
            <p style={s.quickLinksHeading}>Quick actions</p>
            <button onClick={() => router.push("/applicants")} style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <PeopleIcon />
              </span>
              <span>Review new applicants</span>
              <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                <ArrowRightIcon />
              </span>
            </button>
            <button onClick={() => router.push("/meeting")} style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <InterviewIcon />
              </span>
              <span>Schedule an interview</span>
              <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                <ArrowRightIcon />
              </span>
            </button>
            <button onClick={() => router.push("/monitor")} style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <MonitorIcon />
              </span>
              <span>Check scholar standing</span>
              <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                <ArrowRightIcon />
              </span>
            </button>
            <button onClick={() => router.push("/payment")} style={s.quickLinkBtn}>
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
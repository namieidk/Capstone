"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  MonitorIcon,
  TrendUpIcon,
  TrendDownIcon,
  ORG_KPIS,
  PIPELINE_COUNTS,
  ADMIN_ACTIVITY_FEED,
  UPCOMING_FOR_ADMIN,
  TONE_MAP,
  GOOD,
  BAD,
  AMBER,
  LINE,
  s,
} from "@/components/Adminshared";

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div>
      <div className="va-stat-row" style={s.statRow}>
        {ORG_KPIS.map((k) => (
          <div key={k.label} style={s.pipelineCard}>
            <div style={s.pipelineTopRow}>
              <p style={s.pipelineLabel}>{k.label}</p>
              <p style={s.pipelineValue}>{k.value}</p>
            </div>
            <div style={s.pipelineKpiRow}>
              <span style={{ color: k.kpiDirection === "up" ? GOOD : BAD, display: "flex", alignItems: "center", gap: 4 }}>
                {k.kpiDirection === "up" ? <TrendUpIcon /> : <TrendDownIcon />}
                {k.kpi}
              </span>
              <span style={s.pipelineKpiLabel}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <p style={s.subSectionLabel}>Applicant pipeline (all coordinators)</p>
      <div className="va-stat-row" style={s.statRow}>
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

      <div className="va-content-grid" style={s.contentGrid}>
        <section style={s.feedCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Recent activity</h2>
            <button onClick={() => router.push("/adminReports")} style={s.viewAllBtn}>
              View reports <ArrowRightIcon />
            </button>
          </div>
          <div style={s.feedList}>
            {ADMIN_ACTIVITY_FEED.map((item, i) => (
              <div key={i} style={{ ...s.feedRow, borderBottom: i === ADMIN_ACTIVITY_FEED.length - 1 ? "none" : `1px solid ${LINE}` }}>
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
            <h2 style={s.cardHeading}>Upcoming</h2>
            <button onClick={() => router.push("/adminMeeting")} style={s.viewAllBtn}>
              Manage <ArrowRightIcon />
            </button>
          </div>
          <div style={s.upcomingList}>
            {UPCOMING_FOR_ADMIN.map((item, i) => (
              <div key={i} style={s.upcomingRow}>
                <span style={{ ...s.upcomingDot, background: item.urgent ? AMBER : "#C9C2A8" }} />
                <div>
                  <p style={s.upcomingLabel}>{item.label}</p>
                  <p style={s.upcomingDetail}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={s.quickLinksWrap}>
            <p style={s.quickLinksHeading}>Quick actions</p>
            <button onClick={() => router.push("/adminEmployee")} style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <BriefcaseIcon />
              </span>
              <span>Manage employees</span>
              <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                <ArrowRightIcon />
              </span>
            </button>
            <button onClick={() => router.push("/adminMonitor")} style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <MonitorIcon />
              </span>
              <span>Check scholar standing</span>
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
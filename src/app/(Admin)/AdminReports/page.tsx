import React from "react";
import {
  DownloadIcon,
  MONTHLY_APPLICATIONS,
  STAGE_FUNNEL,
  TRACK_BREAKDOWN,
  COORDINATOR_PERFORMANCE,
  s,
} from "@/components/AdminShared";

export default function AdminReportsPage() {
  const maxMonthly = Math.max(...MONTHLY_APPLICATIONS.map((m) => m.count));
  const maxFunnel = STAGE_FUNNEL[0].count;
  const totalTracks = TRACK_BREAKDOWN.reduce((sum, t) => sum + t.count, 0);

  return (
    <div>
      <div className="va-content-grid" style={s.contentGrid}>
        <section style={s.feedCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Applications over time</h2>
          </div>
          <div style={s.barChartRow}>
            {MONTHLY_APPLICATIONS.map((m) => (
              <div key={m.month} style={s.barChartCol}>
                <span style={s.barChartValue}>{m.count}</span>
                <div style={s.barChartTrack}>
                  <div style={{ ...s.barChartFill, height: `${(m.count / maxMonthly) * 100}%` }} />
                </div>
                <span style={s.barChartLabel}>{m.month}</span>
              </div>
            ))}
          </div>

          <div style={{ ...s.cardHeaderRow, marginTop: 30 }}>
            <h2 style={s.cardHeading}>Pipeline funnel</h2>
          </div>
          <div style={s.funnelList}>
            {STAGE_FUNNEL.map((f) => (
              <div key={f.stage} style={s.funnelRow}>
                <span style={s.funnelLabel}>{f.stage}</span>
                <div style={s.funnelTrack}>
                  <div style={{ ...s.funnelFill, width: `${(f.count / maxFunnel) * 100}%` }} />
                </div>
                <span style={s.funnelValue}>{f.count}</span>
              </div>
            ))}
          </div>

          <div style={{ ...s.cardHeaderRow, marginTop: 30 }}>
            <h2 style={s.cardHeading}>Coordinator performance</h2>
          </div>
          <div style={s.coordPerfList}>
            {COORDINATOR_PERFORMANCE.map((c) => (
              <div key={c.name} style={s.coordPerfRow}>
                <span style={s.convoAvatar}>
                  {c.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div style={s.coordPerfInfo}>
                  <p style={s.tdName}>{c.name}</p>
                  <p style={s.tdSub}>
                    {c.reviewed} reviewed · {c.accepted} accepted · {c.avgDays}d avg.
                  </p>
                </div>
                <span style={s.coordPerfRate}>{Math.round((c.accepted / c.reviewed) * 100)}% accept rate</span>
              </div>
            ))}
          </div>
        </section>

        <section style={s.upcomingCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>By track</h2>
          </div>
          <div style={s.trackList}>
            {TRACK_BREAKDOWN.map((t) => (
              <div key={t.track} style={s.trackRow}>
                <div style={s.trackTopRow}>
                  <span style={s.trackLabel}>{t.track}</span>
                  <span style={s.trackCount}>{t.count}</span>
                </div>
                <div style={s.trackTrack}>
                  <div style={{ ...s.trackFill, width: `${(t.count / totalTracks) * 100}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>

          <div style={s.quickLinksWrap}>
            <p style={s.quickLinksHeading}>Export</p>
            <button style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <DownloadIcon />
              </span>
              <span>Download org-wide report (CSV)</span>
            </button>
            <button style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <DownloadIcon />
              </span>
              <span>Download coordinator report (CSV)</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
import React from "react";
import {
  DownloadIcon,
  TrendUpIcon,
  TrendDownIcon,
  REPORT_KPIS,
  MONTHLY_APPLICATIONS,
  STAGE_FUNNEL,
  TRACK_BREAKDOWN,
  GOOD,
  BAD,
  s,
} from "@/components/Coordinatorshared";

export default function ReportsPage() {
  const maxMonthly = Math.max(...MONTHLY_APPLICATIONS.map((m) => m.count));
  const maxFunnel = STAGE_FUNNEL[0].count;
  const totalTracks = TRACK_BREAKDOWN.reduce((sum, t) => sum + t.count, 0);

  return (
    <div>
      <div className="vc-stat-row" style={s.statRow}>
        {REPORT_KPIS.map((k) => (
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

      <div className="vc-content-grid" style={s.contentGrid}>
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
              <span>Download applicant report (CSV)</span>
            </button>
            <button style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}>
                <DownloadIcon />
              </span>
              <span>Download monitor report (CSV)</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
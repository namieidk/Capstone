"use client";

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
  NAVY,
  WHITE,
  TINT,
  SHADOW_SM,
  BORDER_SUBTLE,
} from "@/components/Coordinatorshared";

const AMBER = "#F1B71E";
const GOOD_BG = "#E3F3E9";
const BAD_BG = "#F6E4DF";

// ---- helpers ----
function CircleStat({ label, pct, color }: { label: string; pct: number; color: string }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke={TINT} strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="41" textAnchor="middle" fontSize="15" fontWeight="700" fill={NAVY} fontFamily="'Inter', sans-serif">
          {pct}%
        </text>
      </svg>
      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#5a5a54", textAlign: "center" }}>{label}</span>
    </div>
  );
}

export default function ReportsPage() {
  const maxMonthly = Math.max(...MONTHLY_APPLICATIONS.map((m) => m.count));
  const maxFunnel = STAGE_FUNNEL[0].count;
  const totalTracks = TRACK_BREAKDOWN.reduce((sum, t) => sum + t.count, 0);
  const totalApplicants = MONTHLY_APPLICATIONS.reduce((sum, m) => sum + m.count, 0);
  const lastMonth = MONTHLY_APPLICATIONS[MONTHLY_APPLICATIONS.length - 1];
  const prevMonth = MONTHLY_APPLICATIONS[MONTHLY_APPLICATIONS.length - 2];
  const momChange = prevMonth ? Math.round(((lastMonth.count - prevMonth.count) / prevMonth.count) * 100) : 0;

  // sparkline path for projection card
  const sparkW = 220;
  const sparkH = 60;
  const sparkPts = MONTHLY_APPLICATIONS.map((m, i) => {
    const x = (i / (MONTHLY_APPLICATIONS.length - 1)) * sparkW;
    const y = sparkH - (m.count / maxMonthly) * sparkH;
    return `${x},${y}`;
  });
  const sparkLine = `M${sparkPts.join(" L")}`;
  const sparkArea = `M0,${sparkH} L${sparkPts.join(" L")} L${sparkW},${sparkH} Z`;

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 4px 70px" }}>
      {/* ---- Export actions ---- */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: TINT,
            color: NAVY,
            fontWeight: 600,
            fontSize: "0.86rem",
            padding: "11px 20px",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          <DownloadIcon /> Applicant report (CSV)
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: NAVY,
            color: WHITE,
            fontWeight: 600,
            fontSize: "0.86rem",
            padding: "11px 22px",
            borderRadius: 999,
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(30,58,95,0.25)",
          }}
        >
          <DownloadIcon /> Monitor report (CSV)
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr 1fr",
          gap: 28,
          marginBottom: 28,
        }}
        className="vc-content-grid"
      >
        {/* ---- Track breakdown: circular rings ---- */}
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, padding: "30px 26px", boxShadow: SHADOW_SM }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94" }}>By track</p>
              <p style={{ fontSize: "0.78rem", color: "#b5b5af", marginTop: 2 }}>This quarter</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            {TRACK_BREAKDOWN.map((t) => (
              <CircleStat key={t.track} label={t.track} pct={Math.round((t.count / totalTracks) * 100)} color={t.color} />
            ))}
          </div>
        </div>

        {/* ---- Highlight card: total applicants ---- */}
        <div
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, #2E4F7A 100%)`,
            borderRadius: 20,
            padding: "30px 26px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 10px 28px rgba(30, 58, 95, 0.25)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>
              Total applicants
            </p>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: WHITE,
                background: "rgba(255,255,255,0.15)",
                padding: "4px 12px",
                borderRadius: 999,
              }}
            >
              {MONTHLY_APPLICATIONS.length} months
            </span>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "2.4rem", fontWeight: 700, color: WHITE, margin: "18px 0 6px" }}>
            {totalApplicants}
          </p>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
            Across {MONTHLY_APPLICATIONS[0].month} – {lastMonth.month}
          </p>
        </div>

        {/* ---- Projection sparkline ---- */}
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, padding: "30px 26px", boxShadow: SHADOW_SM }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94" }}>Projection</p>
              <p style={{ fontSize: "0.78rem", color: "#b5b5af", marginTop: 2 }}>Latest month</p>
            </div>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: "0.74rem",
                fontWeight: 700,
                color: momChange >= 0 ? GOOD : BAD,
                background: momChange >= 0 ? GOOD_BG : BAD_BG,
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              {momChange >= 0 ? <TrendUpIcon /> : <TrendDownIcon />} {momChange >= 0 ? "+" : ""}
              {momChange}%
            </span>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.7rem", fontWeight: 700, color: NAVY, marginBottom: 10 }}>
            {lastMonth.count}
          </p>
          <svg width="100%" height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparkFillCoord" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AMBER} stopOpacity="0.35" />
                <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={sparkArea} fill="url(#sparkFillCoord)" />
            <path d={sparkLine} fill="none" stroke={AMBER} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ---- KPI cards ---- */}
      <div
        className="vc-stat-row"
        style={{ display: "grid", gridTemplateColumns: `repeat(${REPORT_KPIS.length}, 1fr)`, gap: 24, marginBottom: 28 }}
      >
        {REPORT_KPIS.map((k) => (
          <div key={k.label} style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM }}>
            <p style={{ fontSize: "0.84rem", color: "#7a7a74", marginBottom: 12, fontWeight: 500 }}>{k.label}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "2.15rem", fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 12 }}>
              {k.value}
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: "0.78rem",
                fontWeight: 700,
                color: k.kpiDirection === "up" ? GOOD : BAD,
              }}
            >
              {k.kpiDirection === "up" ? <TrendUpIcon /> : <TrendDownIcon />}
              {k.kpi}
              <span style={{ fontWeight: 500, color: "#9a9a94", marginLeft: 4 }}>vs last month</span>
            </span>
          </div>
        ))}
      </div>

      <div className="vc-content-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 28 }}>
        {/* ---- Applications + funnel ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Applications over time */}
          <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, padding: "30px 30px", boxShadow: SHADOW_SM }}>
            <p style={{ fontSize: "1.05rem", fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif", marginBottom: 22 }}>
              Applications over time
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 14, height: 150 }}>
              {MONTHLY_APPLICATIONS.map((m) => (
                <div key={m.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexGrow: 1, height: "100%" }}>
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: NAVY }}>{m.count}</span>
                  <div style={{ width: "100%", maxWidth: 34, flexGrow: 1, display: "flex", alignItems: "flex-end" }}>
                    <div
                      style={{
                        width: "100%",
                        height: `${(m.count / maxMonthly) * 100}%`,
                        background: `linear-gradient(180deg, ${AMBER} 0%, #F1B71E80 100%)`,
                        borderRadius: "8px 8px 3px 3px",
                        minHeight: 4,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.76rem", color: "#9a9a94" }}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline funnel */}
          <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, padding: "30px 30px", boxShadow: SHADOW_SM }}>
            <p style={{ fontSize: "1.05rem", fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif", marginBottom: 22 }}>
              Pipeline funnel
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {STAGE_FUNNEL.map((f) => (
                <div key={f.stage} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: "0.84rem", color: "#5a5a54", width: 100, flexShrink: 0, fontWeight: 500 }}>{f.stage}</span>
                  <div style={{ flexGrow: 1, height: 10, background: TINT, borderRadius: 999, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${(f.count / maxFunnel) * 100}%`,
                        background: NAVY,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.84rem", fontWeight: 700, color: NAVY, width: 28, textAlign: "right", flexShrink: 0 }}>{f.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
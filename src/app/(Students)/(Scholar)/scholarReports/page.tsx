"use client";

import React from "react";
import {
  DownloadIcon,
  MenuIcon,
  SCHOLAR_REPORT_KPIS,
  SCHOLAR_ANNUAL_STIPEND,
  SCHOLAR_DISBURSED_TO_DATE,
  SCHOLAR_REMAINING_STIPEND,
  PAYMENT_HISTORY,
  PAYMENT_SUMMARY,
  GRADE_HISTORY,
  PROFILE_DOCUMENTS,
  NAVY,
  WHITE,
  TINT,
  LINE,
  AMBER,
  AMBER_BG,
  s,
} from "@/components/ScholarShared";
import { useSidebar } from "@/components/SidebarContext";

// ---- local tokens (mirrors coordinator reports styling) ----
const GOOD = "#6b8a3e";
const GOOD_BG = "#E9F0DC";
const SHADOW_SM = "0 4px 14px rgba(20,33,58,0.05)";
const BORDER_SUBTLE = `1px solid ${LINE}`;

function fmt(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

function parseAmount(amount: string) {
  return Number(amount.replace(/[₱,]/g, "")) || 0;
}

// ---- helpers ----
function CircleStat({ label, pct, color, big }: { label: string; pct: number; color: string; big?: boolean }) {
  const size = big ? 108 : 72;
  const r = big ? 44 : 30;
  const cx = size / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, pct) / 100) * c;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={TINT} strokeWidth={big ? 8 : 6} />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={big ? 8 : 6}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}
        />
        <text
          x={cx}
          y={cx + (big ? 6 : 5)}
          textAnchor="middle"
          fontSize={big ? 20 : 15}
          fontWeight="700"
          fill={NAVY}
          fontFamily="'Inter', sans-serif"
        >
          {pct}%
        </text>
      </svg>
      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#5a5a54", textAlign: "center" }}>{label}</span>
    </div>
  );
}

const GRADE_STATUS_COLOR: Record<string, string> = {
  passed: GOOD,
  pending: AMBER,
};

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  paid: AMBER,
  processing: AMBER,
  upcoming: TINT,
};

export default function ScholarReportsPage() {
  const { toggleMobile } = useSidebar();

  // ---- Requirements status (circle stats) ----
  const docCircles = PROFILE_DOCUMENTS.map((d) => ({
    label: d.label.length > 22 ? d.label.split(" ").slice(0, 3).join(" ") : d.label,
    pct: d.status === "verified" ? 100 : 40,
    color: d.status === "verified" ? GOOD : AMBER,
  }));

  // ---- Tuition progress (own entitlement only — no fund totals) ----
  const disbursedPct = Math.round((SCHOLAR_DISBURSED_TO_DATE / SCHOLAR_ANNUAL_STIPEND) * 100);
  const paidTerms = PAYMENT_HISTORY.filter((p) => p.status === "paid");

  // Filter out any KPI tied to the overall fund — scholars only see their own entitlement
  const visibleKpis = SCHOLAR_REPORT_KPIS.filter(
    (k) => !k.label.toLowerCase().includes("fund")
  );

  // ---- Tuition payments by semester (bar chart) ----
  const paymentBars = [...PAYMENT_HISTORY].reverse();
  const maxPayment = Math.max(...paymentBars.map((p) => parseAmount(p.amount)), 1);

  // ---- Grade progress by term ----
  const gradeRows = [...GRADE_HISTORY].reverse();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button className="vd-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Reports</h1>
          <p style={s.topbarSub}>Track your grades, tuition payments, and requirement status.</p>
        </div>
        <div style={{ ...s.topbarRight, marginLeft: "auto", gap: 12 }}>
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
              whiteSpace: "nowrap",
            }}
          >
            <DownloadIcon /> Grade report (CSV)
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
              whiteSpace: "nowrap",
            }}
          >
            <DownloadIcon /> Tuition report (CSV)
          </button>
        </div>
      </header>

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 4px 70px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr 1fr",
              gap: 28,
              marginBottom: 28,
            }}
            className="vd-content-grid"
          >
            {/* ---- Requirements status: circular rings ---- */}
            <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, padding: "30px 26px", boxShadow: SHADOW_SM }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94" }}>
                    Requirements
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "#b5b5af", marginTop: 2 }}>Document status</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                {docCircles.map((d) => (
                  <CircleStat key={d.label} label={d.label} pct={d.pct} color={d.color} />
                ))}
              </div>
            </div>

            {/* ---- Highlight card: tuition disbursed to date (own entitlement) ---- */}
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
                  Tuition disbursed to date
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
                  {paidTerms.length} of {PAYMENT_HISTORY.length} terms
                </span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "2.4rem", fontWeight: 700, color: WHITE, margin: "18px 0 6px" }}>
                {fmt(SCHOLAR_DISBURSED_TO_DATE)}
              </p>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
                of {fmt(SCHOLAR_ANNUAL_STIPEND)} annual tuition support
              </p>
            </div>

            {/* ---- Tuition progress ring ---- */}
            <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, padding: "30px 26px", boxShadow: SHADOW_SM, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "100%", marginBottom: 14 }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94" }}>
                  Tuition progress
                </p>
                <p style={{ fontSize: "0.78rem", color: "#b5b5af", marginTop: 2 }}>This school year</p>
              </div>
              <CircleStat label="of annual tuition disbursed" pct={disbursedPct} color={AMBER} big />
              <p style={{ fontSize: "0.78rem", color: "#7a7a74", marginTop: 14, textAlign: "center" }}>
                Next payment {fmt(parseAmount(PAYMENT_SUMMARY.nextAmount))} · {PAYMENT_SUMMARY.nextDate}
              </p>
            </div>
          </div>

          {/* ---- KPI cards ---- */}
          <div
            className="vd-stat-row"
            style={{ display: "grid", gridTemplateColumns: `repeat(${visibleKpis.length}, 1fr)`, gap: 24, marginBottom: 28 }}
          >
            {visibleKpis.map((k) => (
              <div key={k.label} style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM }}>
                <p style={{ fontSize: "0.84rem", color: "#7a7a74", fontWeight: 500, marginBottom: 12 }}>{k.label}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "2.15rem", fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 10 }}>
                  {k.value}
                </p>
                <p style={{ fontSize: "0.78rem", color: "#9a9a94" }}>{k.sub}</p>
              </div>
            ))}
          </div>

          <div className="vd-content-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Tuition payments by semester */}
              <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, padding: "30px 30px", boxShadow: SHADOW_SM }}>
                <p style={{ fontSize: "1.05rem", fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif", marginBottom: 22 }}>
                  Tuition payments by semester
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 14, height: 150 }}>
                  {paymentBars.map((p) => {
                    const amt = parseAmount(p.amount);
                    const color = PAYMENT_STATUS_COLOR[p.status] ?? TINT;
                    return (
                      <div key={p.term} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexGrow: 1, height: "100%" }}>
                        <span style={{ fontSize: "0.76rem", fontWeight: 700, color: NAVY }}>{p.amount}</span>
                        <div style={{ width: "100%", maxWidth: 40, flexGrow: 1, display: "flex", alignItems: "flex-end" }}>
                          <div
                            style={{
                              width: "100%",
                              height: `${(amt / maxPayment) * 100}%`,
                              background:
                                p.status === "upcoming"
                                  ? TINT
                                  : `linear-gradient(180deg, ${AMBER} 0%, #F1B71E80 100%)`,
                              border: p.status === "upcoming" ? `1.5px dashed ${LINE}` : "none",
                              borderRadius: "8px 8px 3px 3px",
                              minHeight: 4,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "0.76rem", color: "#9a9a94", textAlign: "center" }}>{p.term}</span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                            color: p.status === "upcoming" ? "#7a7a74" : "#7a5012",
                            background: p.status === "upcoming" ? TINT : AMBER_BG,
                            padding: "2px 9px",
                            borderRadius: 999,
                          }}
                        >
                          {p.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grade progress by term */}
              <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, padding: "30px 30px", boxShadow: SHADOW_SM }}>
                <p style={{ fontSize: "1.05rem", fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif", marginBottom: 22 }}>
                  Grade progress by term
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {gradeRows.map((g) => {
                    const color = GRADE_STATUS_COLOR[g.status] ?? NAVY;
                    return (
                      <div key={g.term} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ fontSize: "0.84rem", color: "#5a5a54", width: 160, flexShrink: 0, fontWeight: 500 }}>
                          {g.term}
                        </span>
                        <div style={{ flexGrow: 1, height: 10, background: TINT, borderRadius: 999, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.min(100, g.gwa)}%`,
                              background: color,
                              borderRadius: 999,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "0.84rem", fontWeight: 700, color: NAVY, width: 52, textAlign: "right", flexShrink: 0 }}>
                          {g.gwa}%
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                            color: color,
                            background: g.status === "passed" ? GOOD_BG : AMBER_BG,
                            padding: "4px 10px",
                            borderRadius: 999,
                            flexShrink: 0,
                            width: 66,
                            textAlign: "center",
                          }}
                        >
                          {g.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
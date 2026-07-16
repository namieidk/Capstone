"use client";

import React from "react";
import {
  DownloadIcon,
  SCHOLAR_FUND_TOTAL,
  SCHOLAR_FUND_ALLOCATED,
  SCHOLAR_FUND_NON_ALLOCATED,
  SCHOLAR_ANNUAL_STIPEND,
  SCHOLAR_DISBURSED_TO_DATE,
  SCHOLAR_REMAINING_STIPEND,
  SCHOLAR_REPORT_KPIS,
  LINE,
  NAVY,
  WHITE,
  TINT,
  AMBER,
  AMBER_BG,
  s,
} from "@/components/ScholarShared";

const GOOD_BG = "#E9F0DC";
const GOOD = "#6b8a3e";

function fmt(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

// SVG donut/pie chart — no external library needed
function PieChart({
  slices,
}: {
  slices: { value: number; color: string; label: string }[];
}) {
  const size = 180;
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  const total = slices.reduce((s, sl) => s + sl.value, 0);

  let cumAngle = -Math.PI / 2; // start from top

  const paths = slices.map((sl) => {
    const angle = (sl.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { d, color: sl.color, label: sl.label, value: sl.value };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} stroke={WHITE} strokeWidth={2} />
      ))}
      {/* center hole */}
      <circle cx={cx} cy={cy} r={42} fill={WHITE} />
    </svg>
  );
}

export default function ScholarReportsPage() {
  const allocatedPct = (SCHOLAR_FUND_ALLOCATED / SCHOLAR_FUND_TOTAL) * 100;
  const disbursedPct = (SCHOLAR_DISBURSED_TO_DATE / SCHOLAR_ANNUAL_STIPEND) * 100;

  // Pie chart slices: stipend breakdown
  const stipendSlices = [
    { value: SCHOLAR_DISBURSED_TO_DATE, color: AMBER, label: "Disbursed" },
    { value: SCHOLAR_REMAINING_STIPEND, color: "#E4DCC8", label: "Remaining" },
  ];

  // Pie chart slices: fund allocation
  const fundSlices = [
    { value: SCHOLAR_FUND_ALLOCATED, color: NAVY, label: "Allocated" },
    { value: SCHOLAR_FUND_NON_ALLOCATED, color: "#E4DCC8", label: "Non-allocated" },
  ];

  return (
    <div style={s.pageWrap}>
      <h2 style={s.pageHeading}>Reports</h2>
      <p style={s.pageSub}>
        Your scholarship fund overview and personal disbursement breakdown.
      </p>

      {/* KPI cards */}
      <div
        className="vd-stat-row"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, margin: "0 0 30px" }}
      >
        {SCHOLAR_REPORT_KPIS.map((k) => (
          <div key={k.label} style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "18px 20px" }}>
            <p style={{ fontSize: "0.82rem", color: "#7a7a74", marginBottom: 6 }}>{k.label}</p>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 8 }}>
              {k.value}
            </p>
            <p style={{ fontSize: "0.76rem", color: "#9a9a94" }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="vd-content-grid" style={s.contentGrid}>
        {/* Left column */}
        <section style={s.feedCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Your stipend breakdown</h2>
          </div>

          {/* Pie chart + legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 28 }}>
            <PieChart slices={stipendSlices} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {stipendSlices.map((sl) => (
                <div key={sl.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: sl.color, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "0.84rem", fontWeight: 600, color: NAVY }}>{sl.label}</p>
                    <p style={{ fontSize: "0.78rem", color: "#9a9a94" }}>{fmt(sl.value)}</p>
                  </div>
                </div>
              ))}
              <p style={{ fontSize: "0.76rem", color: "#9a9a94", marginTop: 4 }}>
                {disbursedPct.toFixed(0)}% of annual stipend released
              </p>
            </div>
          </div>

          {/* Two summary tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            <div style={{ background: AMBER_BG, borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.78rem", color: "#7a5012", marginBottom: 6 }}>Disbursed</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 700, color: "#5a3a0a", lineHeight: 1, marginBottom: 4 }}>
                {fmt(SCHOLAR_DISBURSED_TO_DATE)}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#7a5012" }}>of {fmt(SCHOLAR_ANNUAL_STIPEND)} annual</p>
            </div>
            <div style={{ background: TINT, borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.78rem", color: "#7a7a74", marginBottom: 6 }}>Remaining</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 4 }}>
                {fmt(SCHOLAR_REMAINING_STIPEND)}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#9a9a94" }}>next release: Jul 15, 2026</p>
            </div>
          </div>

          {/* Fund allocation pie chart */}
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Fund allocation</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <PieChart slices={fundSlices} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {fundSlices.map((sl) => (
                <div key={sl.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: sl.color, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "0.84rem", fontWeight: 600, color: NAVY }}>{sl.label}</p>
                    <p style={{ fontSize: "0.78rem", color: "#9a9a94" }}>{fmt(sl.value)}</p>
                  </div>
                </div>
              ))}
              <p style={{ fontSize: "0.76rem", color: "#9a9a94", marginTop: 4 }}>
                {allocatedPct.toFixed(1)}% of {fmt(SCHOLAR_FUND_TOTAL)} allocated
              </p>
            </div>
          </div>
        </section>

        {/* Right column */}
        <section style={s.upcomingCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Scholarship fund</h2>
          </div>
          <p style={{ fontSize: "0.84rem", color: "#7a7a74", marginBottom: 18, lineHeight: 1.6 }}>
            Total fund budget managed by your grantor company, Cawayan River Development Corp.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: GOOD_BG, borderRadius: 12, padding: "12px 16px" }}>
              <p style={{ fontSize: "0.84rem", color: GOOD, fontWeight: 600 }}>Total budget</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 700, color: "#2a4a1a" }}>
                {fmt(SCHOLAR_FUND_TOTAL)}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: TINT, borderRadius: 12, padding: "12px 16px" }}>
              <p style={{ fontSize: "0.84rem", color: "#7a7a74", fontWeight: 600 }}>Allocated</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 700, color: NAVY }}>
                {fmt(SCHOLAR_FUND_ALLOCATED)}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: TINT, borderRadius: 12, padding: "12px 16px" }}>
              <p style={{ fontSize: "0.84rem", color: "#7a7a74", fontWeight: 600 }}>Non-allocated</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 700, color: NAVY }}>
                {fmt(SCHOLAR_FUND_NON_ALLOCATED)}
              </p>
            </div>
          </div>

          <div style={s.quickLinksWrap}>
            <p style={s.quickLinksHeading}>Export</p>
            <button style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}><DownloadIcon /></span>
              <span>Download disbursement history (CSV)</span>
            </button>
            <button style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}><DownloadIcon /></span>
              <span>Download full report (CSV)</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

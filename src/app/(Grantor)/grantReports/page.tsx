import React from "react";
import {
  GRANT_REPORT_KPIS,
  GRANT_TOTAL_BUDGET,
  GRANT_ALLOCATED,
  GRANT_NON_ALLOCATED,
  BUDGET_SCHOLAR_ROWS,
  GRANT_DISBURSEMENT_MONTHLY,
  BUDGET_STATUS_COLORS,
  GOOD,
  LINE,
  NAVY,
  WHITE,
  TINT,
  AMBER,
  GOOD_BG,
  s,
} from "@/components/Grantorshared.data";
import { DownloadIcon, TrendUpIcon } from "@/components/Grantorshared";

function fmt(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

// ── SVG pie chart (pure, no library) ──────────────────────────
function PieChart({
  slices,
  size = 180,
  thickness = 44,
}: {
  slices: { value: number; color: string; label: string }[];
  size?: number;
  thickness?: number;
}) {
  const r = size / 2;
  const inner = r - thickness;
  const total = slices.reduce((s, sl) => s + sl.value, 0);

  let cumAngle = -Math.PI / 2; // start at top

  const paths = slices.map((sl) => {
    const sweep = (sl.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    const endAngle = cumAngle + sweep;
    cumAngle = endAngle;

    const x1 = r + r * Math.cos(startAngle);
    const y1 = r + r * Math.sin(startAngle);
    const x2 = r + r * Math.cos(endAngle);
    const y2 = r + r * Math.sin(endAngle);
    const ix1 = r + inner * Math.cos(startAngle);
    const iy1 = r + inner * Math.sin(startAngle);
    const ix2 = r + inner * Math.cos(endAngle);
    const iy2 = r + inner * Math.sin(endAngle);
    const largeArc = sweep > Math.PI ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${inner} ${inner} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      "Z",
    ].join(" ");

    return <path key={sl.label} d={d} fill={sl.color} />;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Budget allocation pie chart">
      {paths}
    </svg>
  );
}

export default function GrantReportsPage() {
  const allocatedPct = (GRANT_ALLOCATED / GRANT_TOTAL_BUDGET) * 100;
  const maxDisbursement = Math.max(...GRANT_DISBURSEMENT_MONTHLY.map((m) => m.amount));

  const pieSlices = [
    { value: GRANT_ALLOCATED, color: NAVY, label: "Allocated" },
    { value: GRANT_NON_ALLOCATED, color: AMBER, label: "Non-allocated" },
  ];

  return (
    <div>
      {/* ── KPI row ── */}
      <div className="vg-stat-row" style={s.statRow}>
        {GRANT_REPORT_KPIS.map((k) => (
          <div key={k.label} style={s.pipelineCard}>
            <div style={s.pipelineTopRow}>
              <p style={s.pipelineLabel}>{k.label}</p>
            </div>
            <p style={s.pipelineValue}>{k.value}</p>
            <div style={s.pipelineKpiRow}>
              <span style={{ color: GOOD, display: "flex", alignItems: "center", gap: 4 }}>
                <TrendUpIcon />
                {k.kpi}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="vg-content-grid" style={s.contentGrid}>
        {/* ── Left column ── */}
        <section style={s.feedCard}>
          {/* Budget allocation pie chart */}
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Budget allocation</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 30 }}>
            {/* Pie */}
            <div style={{ flexShrink: 0 }}>
              <PieChart slices={pieSlices} size={180} thickness={44} />
            </div>

            {/* Legend + summary */}
            <div style={{ flexGrow: 1 }}>
              {pieSlices.map((sl) => {
                const pct = ((sl.value / GRANT_TOTAL_BUDGET) * 100).toFixed(1);
                return (
                  <div
                    key={sl.label}
                    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: sl.color,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <p style={{ fontSize: "0.84rem", fontWeight: 700, color: NAVY, marginBottom: 1 }}>
                        {sl.label}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "#7a7a74" }}>
                        {fmt(sl.value)} · {pct}%
                      </p>
                    </div>
                  </div>
                );
              })}

              <div
                style={{
                  borderTop: `1px solid ${LINE}`,
                  paddingTop: 12,
                  marginTop: 4,
                  fontSize: "0.78rem",
                  color: "#9a9a94",
                }}
              >
                Total budget: <strong style={{ color: NAVY }}>{fmt(GRANT_TOTAL_BUDGET)}</strong>
              </div>
            </div>
          </div>

          {/* Two summary tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 30 }}>
            <div style={{ background: GOOD_BG, borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.78rem", color: "#4a6b2a", marginBottom: 6 }}>Allocated</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 700, color: "#2a4a1a", lineHeight: 1, marginBottom: 4 }}>
                {fmt(GRANT_ALLOCATED)}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#4a6b2a" }}>{allocatedPct.toFixed(1)}% of total</p>
            </div>
            <div style={{ background: TINT, borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.78rem", color: "#7a7a74", marginBottom: 6 }}>Non-allocated</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 4 }}>
                {fmt(GRANT_NON_ALLOCATED)}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#9a9a94" }}>available balance</p>
            </div>
          </div>

          {/* Monthly disbursement bar chart */}
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Monthly disbursements</h2>
          </div>
          <div style={s.barChartRow}>
            {GRANT_DISBURSEMENT_MONTHLY.map((m) => (
              <div key={m.month} style={s.barChartCol}>
                <span style={s.barChartValue}>{fmt(m.amount)}</span>
                <div style={s.barChartTrack}>
                  <div
                    style={{
                      ...s.barChartFill,
                      height: `${(m.amount / maxDisbursement) * 100}%`,
                      background: NAVY,
                    }}
                  />
                </div>
                <span style={s.barChartLabel}>{m.month}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Right column ── */}
        <section style={s.upcomingCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Per-scholar budget</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {BUDGET_SCHOLAR_ROWS.map((row) => {
              const tone = BUDGET_STATUS_COLORS[row.status];
              const disbPct = Math.min((row.disbursed / row.allocated) * 100, 100);
              return (
                <div
                  key={row.name}
                  style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 14, padding: "14px 16px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <p style={{ ...s.tdName, fontSize: "0.88rem" }}>{row.name}</p>
                      <p style={{ ...s.tdSub, fontSize: "0.74rem" }}>{row.course}</p>
                    </div>
                    <span style={{ ...s.stageTag, background: tone.bg, color: tone.text, fontSize: "0.7rem" }}>
                      {row.status}
                    </span>
                  </div>

                  <div style={{ background: "#F0EAD9", borderRadius: 6, height: 6, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ width: `${disbPct}%`, height: "100%", background: AMBER, borderRadius: 6 }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#7a7a74" }}>
                    <span>Disbursed: <strong style={{ color: NAVY }}>{fmt(row.disbursed)}</strong></span>
                    <span>Remaining: <strong style={{ color: NAVY }}>{fmt(row.remaining)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Export */}
          <div style={s.quickLinksWrap}>
            <p style={s.quickLinksHeading}>Export</p>
            <button style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}><DownloadIcon /></span>
              <span>Download budget report (CSV)</span>
            </button>
            <button style={s.quickLinkBtn}>
              <span style={s.quickLinkIcon}><DownloadIcon /></span>
              <span>Download disbursement report (CSV)</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

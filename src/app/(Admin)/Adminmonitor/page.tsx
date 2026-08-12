"use client";

import React, { useMemo, useState } from "react";
import {
  XCircleIcon,
  MonitorIcon,
  MailIcon,
  TrendUpIcon,
  TrendDownIcon,
  DrawerInfoRow,
  MONITOR_SCHOLARS,
  COORDINATOR_PERFORMANCE,
  HEALTH_TAG,
  MonitorScholar,
  ScholarHealth,
  GOOD,
  WARN,
  BAD,
  AMBER,
  NAVY,
  WHITE,
  TINT,
  LINE,
  BORDER_SUBTLE,
  SHADOW_SM,
  s,
} from "@/components/Adminshared";

/* ------------------------------------------------------------------ */
/* Derived summaries — computed from your existing MONITOR_SCHOLARS /  */
/* COORDINATOR_PERFORMANCE data, nothing new invented.                 */
/* ------------------------------------------------------------------ */

const COORDINATOR_NAMES = ["All coordinators", ...Array.from(new Set(MONITOR_SCHOLARS.map((m) => m.coordinator)))];
const HEALTH_OPTIONS: Array<{ value: "all" | ScholarHealth; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "good", label: "On track" },
  { value: "warn", label: "Needs attention" },
  { value: "bad", label: "At risk" },
];

export default function AdminMonitorPage() {
  const [selected, setSelected] = useState<MonitorScholar | null>(null);
  const [coordinatorFilter, setCoordinatorFilter] = useState("All coordinators");
  const [healthFilter, setHealthFilter] = useState<"all" | ScholarHealth>("all");

  const filtered = useMemo(
    () =>
      MONITOR_SCHOLARS.filter((sch) => {
        const matchesCoordinator = coordinatorFilter === "All coordinators" || sch.coordinator === coordinatorFilter;
        const matchesHealth = healthFilter === "all" || sch.health === healthFilter;
        return matchesCoordinator && matchesHealth;
      }),
    [coordinatorFilter, healthFilter]
  );

  const counts = useMemo(
    () => ({
      good: MONITOR_SCHOLARS.filter((m) => m.health === "good").length,
      warn: MONITOR_SCHOLARS.filter((m) => m.health === "warn").length,
      bad: MONITOR_SCHOLARS.filter((m) => m.health === "bad").length,
    }),
    []
  );
  const total = MONITOR_SCHOLARS.length;

  const topCoordinator = [...COORDINATOR_PERFORMANCE].sort((a, b) => b.reviewed - a.reviewed)[0];
  const topCoordinatorInitials = topCoordinator.name
    .replace("Engr. ", "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const maxReviewed = Math.max(...COORDINATOR_PERFORMANCE.map((c) => c.reviewed));

  // Donut geometry — three segments (good / warn / bad) as one ring
  const R = 46, CIRC = 2 * Math.PI * R;
  const goodLen = (counts.good / total) * CIRC;
  const warnLen = (counts.warn / total) * CIRC;
  const badLen = (counts.bad / total) * CIRC;

  return (
    <div>
      {/* ---------------- Compact filters, right-aligned ---------------- */}
      <style>{`
        .filter-select:focus { border-color: ${AMBER} !important; }
        .filter-select:hover { border-color: #C9C2A8; }
      `}</style>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, marginTop: 36, marginBottom: 28 }}>
        <CompactFilter select>
          <select className="filter-select" value={coordinatorFilter} onChange={(e) => setCoordinatorFilter(e.target.value)} style={compactSelectStyle}>
            {COORDINATOR_NAMES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </CompactFilter>
        <CompactFilter select>
          <select className="filter-select" value={healthFilter} onChange={(e) => setHealthFilter(e.target.value as "all" | ScholarHealth)} style={compactSelectStyle}>
            {HEALTH_OPTIONS.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </CompactFilter>
      </div>

      {/* ---------------- Spotlight row ---------------- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.6fr", gap: 18, marginBottom: 20 }}>
        {/* Coordinator spotlight */}
        <div style={{ position: "relative", background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "22px 20px", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute", top: 0, right: 0, width: 0, height: 0,
              borderStyle: "solid", borderWidth: "0 34px 34px 0", borderColor: `transparent ${AMBER} transparent transparent`,
            }}
          />
          <span style={{ position: "absolute", top: 5, right: 5, fontSize: 12, color: WHITE }}>★</span>
          <p style={s.subSectionLabel}>Top coordinator</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: 18 }}>
            <div
              style={{
                width: 76, height: 76, borderRadius: "50%", background: "#F3E6C8", color: "#6b5220",
                fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.5rem",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
              }}
            >
              {topCoordinatorInitials}
            </div>
            <p style={{ fontSize: "0.98rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>{topCoordinator.name}</p>
            <p style={{ fontSize: "0.8rem", color: "#8a8a84", marginBottom: 14 }}>Scholarship Coordinator</p>
            <div style={{ display: "flex", gap: 18, borderTop: `1px solid ${LINE}`, paddingTop: 12, width: "100%", justifyContent: "center" }}>
              <div>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: NAVY }}>{topCoordinator.reviewed}</p>
                <p style={{ fontSize: "0.72rem", color: "#9a9a94" }}>Reviewed</p>
              </div>
              <div>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: GOOD }}>{topCoordinator.accepted}</p>
                <p style={{ fontSize: "0.72rem", color: "#9a9a94" }}>Accepted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scholar status donut */}
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "22px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ ...s.subSectionLabel, alignSelf: "flex-start" }}>Scholar status</p>
          <svg width="150" height="150" viewBox="0 0 120 120" style={{ marginTop: 8 }}>
            <circle cx="60" cy="60" r={R} fill="none" stroke={TINT} strokeWidth="13" />
            <circle
              cx="60" cy="60" r={R} fill="none" stroke={GOOD} strokeWidth="13" strokeLinecap="round"
              strokeDasharray={`${goodLen} ${CIRC - goodLen}`} strokeDashoffset={0} transform="rotate(-90 60 60)"
            />
            <circle
              cx="60" cy="60" r={R} fill="none" stroke={WARN} strokeWidth="13" strokeLinecap="round"
              strokeDasharray={`${warnLen} ${CIRC - warnLen}`} strokeDashoffset={-goodLen} transform="rotate(-90 60 60)"
            />
            <circle
              cx="60" cy="60" r={R} fill="none" stroke={BAD} strokeWidth="13" strokeLinecap="round"
              strokeDasharray={`${badLen} ${CIRC - badLen}`} strokeDashoffset={-(goodLen + warnLen)} transform="rotate(-90 60 60)"
            />
            <text x="60" y="66" textAnchor="middle" fontSize="26" fontWeight="700" fill={NAVY} fontFamily="'Fraunces', serif">
              {total}
            </text>
          </svg>
          <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <LegendDot color={GOOD} label={`On track (${counts.good})`} />
            <LegendDot color={WARN} label={`Needs attn. (${counts.warn})`} />
            <LegendDot color={BAD} label={`At risk (${counts.bad})`} />
          </div>
        </div>

        {/* Coordinator performance bars */}
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "22px 22px", display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={s.subSectionLabel}>Coordinator performance</p>
            <span style={{ fontSize: "0.76rem", color: "#9a9a94" }}>applications reviewed</span>
          </div>
          <div style={{ ...s.barChartRow, marginTop: "auto", borderBottom: `2px solid ${LINE}`, paddingBottom: 0 }}>
            {COORDINATOR_PERFORMANCE.map((c) => {
              const fillPct = (c.reviewed / maxReviewed) * 100;
              return (
                <div key={c.name} style={s.barChartCol}>
                  <div style={{ ...s.barChartTrack, position: "relative" }}>
                    <p
                      style={{
                        ...s.barChartValue,
                        position: "absolute",
                        left: "50%",
                        bottom: `calc(${fillPct}% + 6px)`,
                        transform: "translateX(-50%)",
                        margin: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.reviewed}
                    </p>
                    <div style={{ ...s.barChartFill, height: `${fillPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "8px 4px 0" }}>
            {COORDINATOR_PERFORMANCE.map((c) => (
              <p key={c.name} style={{ ...s.barChartLabel, flex: 1, textAlign: "center", lineHeight: 1.3 }}>
                {c.name.replace("Engr. ", "").split(" ")[0]}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Scholar details table ---------------- */}
      <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "22px 22px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <p style={{ fontSize: "1.15rem", fontWeight: 700, color: NAVY, fontFamily: "'Fraunces', serif" }}>Scholar details</p>
          <span style={{ fontSize: "0.8rem", color: "#9a9a94" }}>{filtered.length} shown</span>
        </div>

        <div className="va-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
          <table>
            <thead>
              <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                <th style={{ ...s.th, background: "none", padding: "14px 14px 14px 8px", textAlign: "left" }}>Scholar</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>Coordinator</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>GWA</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>Documents</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>Disbursement</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>Status</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sch, i) => (
                <tr
                  key={sch.id}
                  onClick={() => setSelected(sch)}
                  style={{ borderBottom: i === filtered.length - 1 ? "none" : `1px solid ${TINT}`, cursor: "pointer", verticalAlign: "middle" }}
                >
                  <td style={{ ...s.td, padding: "16px 14px 16px 8px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                      <span style={s.convoAvatar}>{sch.initials}</span>
                      <div>
                        <p style={s.tdName}>{sch.name}</p>
                        <p style={s.tdSub}>{sch.course}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{sch.coordinator}</td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <span style={{ ...s.gwaTrendCell, fontWeight: 700, color: NAVY }}>
                        {sch.gwa}%{" "}
                        {sch.trend === "up" ? (
                          <span style={{ color: GOOD }}><TrendUpIcon /></span>
                        ) : (
                          <span style={{ color: BAD }}><TrendDownIcon /></span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <span style={{ fontWeight: 600, color: sch.docs !== "3/3" ? WARN : "#4a4a45" }}>{sch.docs}</span>
                  </td>
                  <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{sch.disbursement}</td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <span
                      style={{
                        ...s.stageTag,
                        background: HEALTH_TAG[sch.health].bg,
                        color: HEALTH_TAG[sch.health].text,
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: HEALTH_TAG[sch.health].text,
                          flexShrink: 0,
                        }}
                      />
                      {HEALTH_TAG[sch.health].label}
                    </span>
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(sch); }}
                      aria-label="View scholar"
                      style={{
                        width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${LINE}`,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        background: WHITE, color: "#7a7a74", cursor: "pointer",
                      }}
                    >
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: "center", padding: "40px 0", color: "#9a9a94", fontSize: "0.9rem" }}>
            No scholars match this filter.
          </p>
        )}
      </div>

      {/* ---------------- Drawer ---------------- */}
      {selected && (
        <div style={s.drawerOverlay} onClick={() => setSelected(null)}>
          <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...s.drawerHeader, marginBottom: 22 }}>
              <span style={s.profileAvatar}>{selected.initials}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>{selected.name}</h3>
                <p style={s.drawerMeta}>{selected.course}</p>
              </div>
              <button onClick={() => setSelected(null)} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>
            <div style={{ ...s.drawerInfoGrid, marginBottom: 22, rowGap: 20 }}>
              <DrawerInfoRow label="Coordinator" value={selected.coordinator} />
              <DrawerInfoRow label="Predicted GWA" value={`${selected.gwa}%`} />
              <DrawerInfoRow label="Documents" value={selected.docs} />
              <DrawerInfoRow label="Disbursement" value={selected.disbursement} />
            </div>
            <p style={{ ...s.drawerSectionLabel, marginBottom: 10 }}>Status</p>
            <div style={{ ...s.appNoteCard, marginBottom: 18, boxShadow: "none" }}>
              <span style={s.appNoteIcon}>
                <MonitorIcon />
              </span>
              <p style={s.appNoteText}>
                {selected.health === "good" && "This scholar is meeting all retention requirements. No action needed."}
                {selected.health === "warn" && "Missing a required document. A reminder message is recommended."}
                {selected.health === "bad" && "GWA trending down and documents incomplete. Disbursement is on hold pending review."}
              </p>
            </div>
            <div style={{ ...s.drawerStageActions, marginTop: 4 }}>
              <button
                style={{
                  ...s.continueBtnSmall,
                  width: "100%",
                  justifyContent: "center",
                  padding: "15px 20px",
                  fontSize: "0.94rem",
                  gap: 10,
                }}
              >
                <MailIcon small /> Message scholar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const compactSelectStyle: React.CSSProperties = {
  border: `1.5px solid ${LINE}`, borderRadius: 9, padding: "8px 30px 8px 12px", fontSize: "0.82rem",
  color: NAVY, width: 168, background: WHITE, outline: "none", fontFamily: "'Inter', sans-serif",
  appearance: "none", WebkitAppearance: "none", MozAppearance: "none", cursor: "pointer",
  transition: "border-color 0.15s ease", fontWeight: 500,
};

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CompactFilter({ children, select }: { children: React.ReactNode; select?: boolean }) {
  return select ? (
    <div style={{ position: "relative" }}>
      {children}
      <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <ChevronIcon />
      </span>
    </div>
  ) : (
    <>{children}</>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: "0.78rem", color: "#7a7a74" }}>{label}</span>
    </div>
  );
}
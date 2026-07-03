"use client";

import React, { CSSProperties, ReactNode } from "react";

// ============================================================
// GLOBAL STYLES
// ============================================================

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap');

      .vl * { margin: 0; padding: 0; box-sizing: border-box; }
      .vl {
        background: #F8F4EA;
        color: #2B2B28;
        font-family: 'Inter', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        min-height: 100vh;
      }
      .vl h1, .vl h2, .vl h3 { font-family: 'Fraunces', Georgia, serif; color: #14213A; }
      .vl a { color: inherit; text-decoration: none; }
      .vl button { font-family: 'Inter', sans-serif; cursor: pointer; border: none; background: none; }
      .vl input { font-family: 'Inter', sans-serif; }

      .vl-shell { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }

      @keyframes vl-spin { to { transform: rotate(360deg); } }

      @media (max-width: 940px) {
        .vl-shell { grid-template-columns: 1fr; }
        .vl-brand { min-height: 280px !important; }
        .vl-stat-row { grid-template-columns: repeat(3, 1fr) !important; }
      }
      @media (max-width: 520px) {
        .vl-stat-row { grid-template-columns: 1fr !important; }
        .vl-form-card { padding: 32px 24px !important; }
      }
    `}</style>
  );
}

// ============================================================
// DESIGN TOKENS (matches the ViaScholar coordinator dashboard)
// ============================================================

export const NAVY = "#14213A";
export const NAVY_DEEP = "#0E172B";
export const CREAM = "#F8F4EA";
export const AMBER = "#C9943D";
export const AMBER_LIGHT = "#E0B765";
export const AMBER_BG = "#F3E6C8";
export const WHITE = "#FFFFFF";
export const LINE = "#E4DCC8";
export const TINT = "#F4F0E6";
export const GOOD = "#6b8a3e";
export const GOOD_BG = "#E9F0DC";
export const BAD = "#8a3a2e";
export const BAD_BG = "#F6E4DF";

// ============================================================
// ICONS
// ============================================================

export function GradCapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3z" fill="white" />
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white" />
    </svg>
  );
}
export function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c0-3.2 2.7-5.6 6-5.6s6 2.4 6 5.6" />
      <circle cx="17" cy="8.5" r="2.6" />
      <path d="M21 19c0-2.6-1.7-4.7-4-5.3" />
    </svg>
  );
}
export function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l8 3.5v5c0 5-3.4 8.7-8 9.5-4.6-.8-8-4.5-8-9.5v-5L12 3z" />
      <path d="M9 12l2 2 4-4.5" />
    </svg>
  );
}
export function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
export function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
export function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
export function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c7 0 11 7 11 7a17.6 17.6 0 0 1-4 4.6M6.2 6.2A17.4 17.4 0 0 0 1 12s4 7 11 7c1.4 0 2.7-.2 3.9-.6" />
      <path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
export function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.2 2.2 5-5.4" />
    </svg>
  );
}
export function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "vl-spin 0.7s linear infinite" }}>
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================
// DATA
// ============================================================

export type StaffRoleKey = "coordinator" | "admin";

export interface RoleOption {
  key: StaffRoleKey;
  label: string;
  icon: ReactNode;
  desc: string;
}

export const ROLES: RoleOption[] = [
  {
    key: "coordinator",
    label: "Coordinator",
    icon: <PeopleIcon />,
    desc: "Manage applicants, interviews, scholar standing, grades, and payments.",
  },
  {
    key: "admin",
    label: "Administrator",
    icon: <ShieldIcon />,
    desc: "Full system access — partner companies, coordinator accounts, and configuration.",
  },
];

export interface BrandStat {
  value: string;
  label: string;
}

export const BRAND_STATS: BrandStat[] = [
  { value: "1,240+", label: "Scholars supported" },
  { value: "98%", label: "On-time disbursement" },
  { value: "32", label: "Partner companies" },
];

export interface StaffSession {
  email: string;
  role: StaffRoleKey;
}

// ============================================================
// SHARED FIELD HELPER
// ============================================================

export interface FieldProps {
  label: string;
  children: ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div style={ls.fieldWrap}>
      <label style={ls.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

// ============================================================
// BRAND PANEL (left side)
// ============================================================

export interface BrandPanelProps {
  role: StaffRoleKey;
}

export function BrandPanel({ role }: BrandPanelProps) {
  return (
    <div className="vl-brand" style={ls.brand}>
      <div style={ls.brandGlow} />
      <div style={ls.brandTop}>
        <span style={ls.brandLogoMark}>
          <GradCapIcon />
        </span>
        <span style={ls.brandLogoText}>ViaScholar</span>
      </div>

      <div style={ls.brandMid}>
        <span style={ls.brandEyebrow}>Davao City · Scholarship Management</span>
        <h1 style={ls.brandHeadline}>
          Keep every scholar&apos;s
          <br />
          journey on track.
        </h1>
        <p style={ls.brandSub}>
          {role === "admin"
            ? "Sign in to manage partner companies, coordinator accounts, and platform-wide settings."
            : "Sign in to review applicants, schedule interviews, and monitor your active scholars."}
        </p>
      </div>

      <div className="vl-stat-row" style={ls.brandStatRow}>
        {BRAND_STATS.map((st) => (
          <div key={st.label} style={ls.brandStatCard}>
            <p style={ls.brandStatValue}>{st.value}</p>
            <p style={ls.brandStatLabel}>{st.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ROLE TOGGLE
// ============================================================

export interface RoleToggleProps {
  role: StaffRoleKey;
  onChange: (role: StaffRoleKey) => void;
}

export function RoleToggle({ role, onChange }: RoleToggleProps) {
  return (
    <div style={ls.roleToggle}>
      {ROLES.map((r) => {
        const isActive = role === r.key;
        return (
          <button
            key={r.key}
            onClick={() => onChange(r.key)}
            style={{ ...ls.roleTab, background: isActive ? NAVY : "transparent", color: isActive ? WHITE : "#6b6b66" }}
          >
            <span style={{ display: "flex" }}>{r.icon}</span>
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

export const ls: Record<string, CSSProperties> = {
  brand: {
    position: "relative",
    background: `linear-gradient(150deg, ${NAVY_DEEP} 0%, ${NAVY} 55%, #1B3A34 100%)`,
    padding: "44px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    minHeight: "100vh",
  },
  brandGlow: {
    position: "absolute",
    top: -120,
    right: -120,
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,148,61,0.35) 0%, rgba(201,148,61,0) 70%)",
  },
  brandTop: { display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 },
  brandLogoMark: { width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brandLogoText: { fontFamily: "'Fraunces', serif", fontSize: "1.2rem", fontWeight: 700, color: WHITE },

  brandMid: { position: "relative", zIndex: 1, maxWidth: 440 },
  brandEyebrow: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: AMBER_LIGHT, marginBottom: 18, display: "block" },
  brandHeadline: { fontSize: "2.4rem", fontWeight: 700, color: WHITE, lineHeight: 1.18, marginBottom: 18 },
  brandSub: { fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.6, maxWidth: 400 },

  brandStatRow: { position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  brandStatCard: { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "16px 16px" },
  brandStatValue: { fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 700, color: WHITE, marginBottom: 4 },
  brandStatLabel: { fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.4 },

  formSide: { display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" },
  formCard: { width: "100%", maxWidth: 420, padding: "8px 4px" },
  formHeader: { marginBottom: 28 },
  formTitle: { fontSize: "1.7rem", fontWeight: 700, color: NAVY, marginBottom: 6 },
  formSub: { fontSize: "0.94rem", color: "#7a7a74" },

  roleToggle: { display: "flex", gap: 6, background: TINT, border: `1px solid ${LINE}`, borderRadius: 13, padding: 5, marginBottom: 12 },
  roleTab: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 12px", borderRadius: 9, fontSize: "0.88rem", fontWeight: 600 },
  roleDesc: { fontSize: "0.84rem", color: "#8a8a84", lineHeight: 1.5, marginBottom: 26 },

  fieldWrap: { marginBottom: 16 },
  fieldLabel: { display: "block", fontSize: "0.86rem", fontWeight: 600, color: NAVY, marginBottom: 7 },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: 15, color: "#9a9a94", display: "flex", pointerEvents: "none" },
  input: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px 12px 42px", fontSize: "0.94rem", color: "#2B2B28", outline: "none" },
  inputEyeBtn: { position: "absolute", right: 13, color: "#9a9a94", display: "flex" },

  errorBox: { background: BAD_BG, color: BAD, fontSize: "0.84rem", fontWeight: 600, padding: "10px 14px", borderRadius: 10, marginBottom: 16 },

  formRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  checkboxLabel: { display: "flex", alignItems: "center", gap: 9, fontSize: "0.86rem", color: "#55554f", cursor: "pointer" },
  checkbox: { width: 19, height: 19, borderRadius: 6, border: "1.5px solid", display: "flex", alignItems: "center", justifyContent: "center", color: WHITE, flexShrink: 0 },
  forgotLink: { fontSize: "0.86rem", fontWeight: 600, color: AMBER },

  submitBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: NAVY, color: WHITE, borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: "0.96rem" },
  securityNote: { fontSize: "0.76rem", color: "#9a9a94", textAlign: "center", marginTop: 16, lineHeight: 1.5 },

  footerNote: { fontSize: "0.84rem", color: "#9a9a94", textAlign: "center", marginTop: 28 },

  successWrap: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 4px" },
  successIcon: { width: 56, height: 56, borderRadius: "50%", background: GOOD_BG, color: GOOD, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  successTitle: { fontSize: "1.4rem", fontWeight: 700, color: NAVY, marginBottom: 8 },
  successSub: { fontSize: "0.92rem", color: "#7a7a74", marginBottom: 18 },
  successRoleTag: { display: "flex", alignItems: "center", gap: 8, background: AMBER_BG, color: "#6b5220", fontWeight: 700, fontSize: "0.84rem", padding: "8px 16px", borderRadius: 999, marginBottom: 28 },
  continueBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: NAVY, color: WHITE, borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: "0.96rem", marginBottom: 14 },
  switchUserLink: { fontSize: "0.86rem", fontWeight: 600, color: AMBER },
};
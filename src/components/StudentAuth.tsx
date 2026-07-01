"use client";

import React, { ReactNode, CSSProperties, ElementType } from "react";

// ============================================================
// GLOBAL STYLES
// ============================================================

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap');

      .vls * { margin: 0; padding: 0; box-sizing: border-box; }
      .vls {
        background: #F8F4EA;
        color: #2B2B28;
        font-family: 'Inter', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        min-height: 100vh;
      }
      .vls h1, .vls h2, .vls h3 { font-family: 'Fraunces', Georgia, serif; color: #14213A; }
      .vls a { color: inherit; text-decoration: none; }
      .vls button { font-family: 'Inter', sans-serif; cursor: pointer; border: none; background: none; }
      .vls input, .vls select { font-family: 'Inter', sans-serif; }

      .vls-shell { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }

      @keyframes vls-spin { to { transform: rotate(360deg); } }

      @media (max-width: 940px) {
        .vls-shell { grid-template-columns: 1fr; }
        .vls-brand { min-height: 300px !important; }
        .vls-stat-row { grid-template-columns: repeat(3, 1fr) !important; }
      }
      @media (max-width: 520px) {
        .vls-stat-row { grid-template-columns: 1fr !important; }
        .vls-form-card { padding: 32px 24px !important; }
        .vls-name-row { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

// ============================================================
// DESIGN TOKENS (matches the ViaScholar product family)
// ============================================================

export const NAVY = "#14213A";
export const NAVY_DEEP = "#0E172B";
export const FOREST = "#1B3A34";
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
export function LogInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}
export function UserPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c0-3.6 3.1-6.3 7-6.3s7 2.7 7 6.3" />
      <path d="M19 8v6M16 11h6" />
    </svg>
  );
}
export function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" />
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
export function SchoolIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5z" />
      <path d="M6.5 11.5V16c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4.5" />
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
export function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.28a12 12 0 0 0 0 10.8z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z" />
    </svg>
  );
}
export function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "vls-spin 0.7s linear infinite" }}>
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================
// DATA
// ============================================================

export interface BrandStat {
  value: string;
  label: string;
}

export const BRAND_STATS: BrandStat[] = [
  { value: "120+", label: "Open scholarships" },
  { value: "₱42M+", label: "Disbursed to scholars" },
  { value: "3", label: "Application tracks" },
];

export const TRACKS: string[] = ["Academic Track", "Financial Need Track", "Returning Scholar"];

// ============================================================
// SHARED SESSION TYPE
// ============================================================

export interface AuthSession {
  name: string;
  email: string;
}

// ============================================================
// BRAND PANEL (left side)
// ============================================================

export interface BrandPanelProps {
  mode: "signin" | "signup";
}

export function BrandPanel({ mode }: BrandPanelProps) {
  return (
    <div className="vls-brand" style={ls.brand}>
      <div style={ls.brandGlow} />
      <div style={ls.brandTop}>
        <span style={ls.brandLogoMark}>
          <GradCapIcon />
        </span>
        <span style={ls.brandLogoText}>ViaScholar</span>
      </div>

      <div style={ls.brandMid}>
        <span style={ls.brandEyebrow}>Davao City · Student Portal</span>
        <h1 style={ls.brandHeadline}>
          Find the scholarship
          <br />
          that fits you.
        </h1>
        <p style={ls.brandSub}>
          {mode === "signup"
            ? "Create your student account to start matching with partner-company scholarships in minutes."
            : "Sign in to track your application, message your coordinator, and manage your scholar profile."}
        </p>
      </div>

      <div className="vls-stat-row" style={ls.brandStatRow}>
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
// SHARED FORM PIECES
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

// Tabs that link between the two real pages (/login and /signup)
// instead of toggling local state, since they're now separate routes.
// LinkComponent is typed loosely as ElementType so this file has no
// hard dependency on `next/link` (keeps it framework-agnostic / easy to test).
export interface ModeLinkTabsProps {
  active: "signin" | "signup";
  LinkComponent: ElementType<{ href: string; style?: CSSProperties; children: ReactNode }>;
  hrefLogin?: string;
  hrefSignup?: string;
}

export function ModeLinkTabs({ active, LinkComponent, hrefLogin = "/login", hrefSignup = "/signup" }: ModeLinkTabsProps) {
  const Comp = LinkComponent;
  return (
    <div style={ls.modeToggle}>
      <Comp
        href={hrefLogin}
        style={{
          ...ls.modeTab,
          background: active === "signin" ? NAVY : "transparent",
          color: active === "signin" ? WHITE : "#6b6b66",
        }}
      >
        <span style={{ display: "flex" }}>
          <LogInIcon />
        </span>
        Sign in
      </Comp>
      <Comp
        href={hrefSignup}
        style={{
          ...ls.modeTab,
          background: active === "signup" ? NAVY : "transparent",
          color: active === "signup" ? WHITE : "#6b6b66",
        }}
      >
        <span style={{ display: "flex" }}>
          <UserPlusIcon />
        </span>
        Create account
      </Comp>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

export const ls: Record<string, CSSProperties> = {
  // BRAND PANEL
  brand: {
    position: "relative",
    background: `linear-gradient(150deg, ${NAVY_DEEP} 0%, ${NAVY} 55%, ${FOREST} 100%)`,
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
  brandStatValue: { fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 700, color: WHITE, marginBottom: 4 },
  brandStatLabel: { fontSize: "0.76rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.4 },

  // FORM SIDE
  formSide: { display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" },
  formCard: { width: "100%", maxWidth: 440, padding: "8px 4px" },
  formHeader: { marginBottom: 24 },
  formTitle: { fontSize: "1.7rem", fontWeight: 700, color: NAVY, marginBottom: 6 },
  formSub: { fontSize: "0.94rem", color: "#7a7a74" },

  // MODE TOGGLE
  modeToggle: { display: "flex", gap: 6, background: TINT, border: `1px solid ${LINE}`, borderRadius: 13, padding: 5, marginBottom: 22 },
  modeTab: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 12px", borderRadius: 9, fontSize: "0.88rem", fontWeight: 600 },

  // FIELDS
  fieldWrap: { marginBottom: 16 },
  fieldLabel: { display: "block", fontSize: "0.86rem", fontWeight: 600, color: NAVY, marginBottom: 7 },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: 15, color: "#9a9a94", display: "flex", pointerEvents: "none" },
  input: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px 12px 42px", fontSize: "0.94rem", color: "#2B2B28", outline: "none" },
  select: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px", fontSize: "0.94rem", color: "#2B2B28", outline: "none" },
  inputEyeBtn: { position: "absolute", right: 13, color: "#9a9a94", display: "flex" },
  nameRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },

  errorBox: { background: BAD_BG, color: BAD, fontSize: "0.84rem", fontWeight: 600, padding: "10px 14px", borderRadius: 10, marginBottom: 16 },

  formRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  checkboxLabel: { display: "flex", alignItems: "center", gap: 9, fontSize: "0.86rem", color: "#55554f", cursor: "pointer" },
  checkbox: { width: 19, height: 19, borderRadius: 6, border: "1.5px solid", display: "flex", alignItems: "center", justifyContent: "center", color: WHITE, flexShrink: 0 },
  forgotLink: { fontSize: "0.86rem", fontWeight: 600, color: AMBER },

  submitBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: NAVY, color: WHITE, borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: "0.96rem" },

  dividerRow: { display: "flex", alignItems: "center", gap: 14, margin: "24px 0 18px" },
  dividerLine: { flexGrow: 1, height: 1, background: LINE },
  dividerText: { fontSize: "0.78rem", color: "#9a9a94", whiteSpace: "nowrap" },

  googleBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 999, padding: "13px 24px", fontWeight: 600, fontSize: "0.92rem", color: "#3a3a36" },

  footerNote: { fontSize: "0.86rem", color: "#7a7a74", textAlign: "center", marginTop: 24 },
  footerLink: { fontWeight: 700, color: AMBER, fontSize: "0.86rem" },

  // SUCCESS PANEL
  successWrap: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 4px" },
  successIcon: { width: 56, height: 56, borderRadius: "50%", background: GOOD_BG, color: GOOD, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  successTitle: { fontSize: "1.4rem", fontWeight: 700, color: NAVY, marginBottom: 8 },
  successSub: { fontSize: "0.92rem", color: "#7a7a74", marginBottom: 18 },
  successRoleTag: { display: "flex", alignItems: "center", gap: 8, background: AMBER_BG, color: "#6b5220", fontWeight: 700, fontSize: "0.84rem", padding: "8px 16px", borderRadius: 999, marginBottom: 28 },
  continueBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: NAVY, color: WHITE, borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: "0.96rem", marginBottom: 14 },
  switchUserLink: { fontSize: "0.86rem", fontWeight: 600, color: AMBER },
};
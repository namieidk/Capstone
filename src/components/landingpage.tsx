"use client";

import React, { CSSProperties, ReactNode } from "react";

// ============================================================
// GLOBAL STYLES — fonts, colors, resets
// ============================================================

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap');

      .vs * { margin: 0; padding: 0; box-sizing: border-box; }
      .vs {
        background: #F8F4EA;
        color: #2B2B28;
        font-family: 'Inter', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .vs h1, .vs h2, .vs h3 { font-family: 'Fraunces', Georgia, serif; color: #14213A; }
      .vs a { color: inherit; text-decoration: none; }
      .vs button { font-family: 'Inter', sans-serif; cursor: pointer; border: none; }

      .vs-container { max-width: 1180px; margin: 0 auto; padding: 0 32px; }
      .vs-eyebrow { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #C9943D; }

      @media (max-width: 960px) {
        .vs-hero-grid, .vs-grid-2 { grid-template-columns: 1fr !important; }
        .vs-nav-links { display: none !important; }
        .vs-card-3, .vs-card-grid-3x2 { grid-template-columns: 1fr 1fr !important; }
        .vs-stat-row { flex-wrap: wrap; gap: 28px !important; }
        .vs-step-pills { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 640px) {
        .vs-container { padding: 0 20px; }
        .vs-card-3, .vs-card-grid-3x2 { grid-template-columns: 1fr !important; }
        .vs-headline { font-size: 2rem !important; }
        .vs-final-cta-inner { flex-direction: column; align-items: flex-start !important; gap: 24px !important; }
        .vs-step-pills { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

// ============================================================
// DESIGN TOKENS
// ============================================================

export const NAVY = "#14213A";
export const CREAM = "#F8F4EA";
export const AMBER = "#C9943D";
export const WHITE = "#FFFFFF";
export const GRAY = "#6B6B66";
export const LINE = "#E4DCC8";
export const DARK = "#0F1A2E";
export const DARKCARD = "#1A2740";

// ============================================================
// SHARED FORM FIELD HELPER
// ============================================================

export interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <div style={s.fieldWrap}>
      <label style={s.fieldLabel}>
        {label} {required && <span style={s.fieldRequiredStar}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ============================================================
// ICONS
// ============================================================

export function GradCapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3z" fill="white" />
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white" />
    </svg>
  );
}
export function LoginIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5M10 17l5-5-5-5M15 12H3" />
    </svg>
  );
}
export function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14213A" strokeWidth="2">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
    </svg>
  );
}
export function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14213A" strokeWidth="2">
      <path d="M3 3v18h18M7 14l4-4 3 3 5-6" />
    </svg>
  );
}
export function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14213A" strokeWidth="2">
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
export function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}
export function IdIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M5 16c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5M14 9h5M14 13h5" />
    </svg>
  );
}
export function PersonCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5M16 11l2 2 3-4" />
    </svg>
  );
}
export function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M9 12h6M9 16h6M9 8h2" />
    </svg>
  );
}
export function ReceiptIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}
export function LetterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
export function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
export function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.99.36 1.97.69 2.91a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.94.33 1.92.56 2.91.69A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
export function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
export function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
export function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9943D" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.2 2.2 5-5.4" />
    </svg>
  );
}
export function CheckBigIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14213A" strokeWidth="2.4">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </svg>
  );
}
export function BackArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}
export function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#48484a" strokeWidth="2">
      <path d="M12 3v12M7 8l5-5 5 5M5 21h14" />
    </svg>
  );
}

// ============================================================
// STYLE OBJECT — kept inline per element, grouped here
// ============================================================

export const s: Record<string, CSSProperties> = {
  // NAV
  navHeader: { position: "sticky", top: 0, zIndex: 50, background: "rgba(248,244,234,0.95)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${LINE}` },
  navInner: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 84 },
  navLogo: { display: "flex", alignItems: "center", gap: 10, fontFamily: "'Fraunces', serif", fontSize: "1.25rem", fontWeight: 700, color: NAVY },
  navLogoMark: { width: 34, height: 34, borderRadius: 9, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" },
  navLinks: { display: "flex", gap: 30 },
  navLink: { fontSize: "0.95rem", fontWeight: 500, color: "#48484a" },
  navButtons: { display: "flex", gap: 12, alignItems: "center" },
  loginBtn: { display: "flex", alignItems: "center", gap: 6, border: `1.5px solid ${LINE}`, borderRadius: 999, padding: "10px 18px", fontSize: "0.92rem", fontWeight: 600, color: NAVY, background: WHITE },
  applyBtn: { background: NAVY, color: WHITE, borderRadius: 999, padding: "11px 22px", fontSize: "0.92rem", fontWeight: 600 },

  // HERO
  heroSection: { padding: "60px 0 0" },
  heroGrid: { display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "start", marginBottom: 56 },
  badge: { display: "inline-block", border: `1px solid ${LINE}`, borderRadius: 999, padding: "8px 16px", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", color: "#5a5a55", marginBottom: 28, background: "rgba(255,255,255,0.5)" },
  headline: { fontSize: "clamp(2.4rem, 4.6vw, 4rem)", fontWeight: 700, lineHeight: 1.08, color: NAVY, marginBottom: 26 },
  headlineAccent: { color: AMBER, fontStyle: "italic" },
  heroSub: { fontSize: "1.1rem", lineHeight: 1.7, color: "#55554f", maxWidth: 480, marginBottom: 32 },
  heroActions: { display: "flex", gap: 14, flexWrap: "wrap" },
  primaryBtn: { background: NAVY, color: WHITE, borderRadius: 999, padding: "16px 28px", fontWeight: 600, fontSize: "0.96rem" },
  secondaryBtn: { background: WHITE, color: NAVY, borderRadius: 999, padding: "16px 28px", fontWeight: 600, fontSize: "0.96rem", border: `1px solid ${LINE}` },
  statRow: { display: "flex", justifyContent: "space-between", gap: 40, paddingTop: 28, paddingBottom: 56, borderTop: `1px solid ${LINE}`, maxWidth: 620 },
  statNumber: { fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, color: NAVY, marginBottom: 4 },
  statLabel: { fontSize: "0.92rem", color: GRAY },

  dashCard: { background: WHITE, borderRadius: 22, padding: "26px 26px 22px", boxShadow: "0 20px 50px -20px rgba(20,33,58,0.25)" },
  dashHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  dashLabel: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "#7a7a74" },
  dashLiveTag: { background: "#F3E6C8", color: "#8a6a1f", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.04em", padding: "5px 11px", borderRadius: 999 },
  dashGwaBox: { background: "#F4F0E6", borderRadius: 16, padding: "20px 22px", marginBottom: 14 },
  dashGwaLabel: { fontSize: "0.88rem", color: "#5a5a55", marginBottom: 8 },
  dashGwaValue: { fontFamily: "'Fraunces', serif", fontSize: "2.3rem", fontWeight: 700, color: NAVY, marginBottom: 14 },
  dashProgressTrack: { height: 7, background: "#E4DCC8", borderRadius: 999, overflow: "hidden", marginBottom: 12 },
  dashProgressFill: { height: "100%", width: "88%", background: AMBER, borderRadius: 999 },
  dashGwaCaption: { fontSize: "0.82rem", color: "#6b6b66" },
  dashRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F4F0E6", borderRadius: 12, padding: "14px 18px" },
  dashRowLabel: { fontSize: "0.9rem", color: "#48484a" },
  dashRowValue: { fontSize: "0.92rem", fontWeight: 700, color: NAVY },

  // SECTION HEADING (shared)
  sectionHeading: { fontSize: "2.4rem", fontWeight: 700, lineHeight: 1.18, margin: "16px 0 20px", color: NAVY },

  // ABOUT
  aboutSection: { padding: "70px 0", borderTop: `1px solid ${LINE}` },
  aboutGrid: { display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56 },
  aboutParagraph: { fontSize: "1.02rem", lineHeight: 1.75, color: "#48484a", maxWidth: 460 },
  featureStack: { display: "flex", flexDirection: "column", gap: 18 },
  featureCard: { display: "flex", gap: 18, background: WHITE, borderRadius: 18, padding: 26, border: `1px solid ${LINE}` },
  featureIconBox: { width: 44, height: 44, flexShrink: 0, borderRadius: 12, background: "#F3E6C8", display: "flex", alignItems: "center", justifyContent: "center" },
  featureTitle: { fontSize: "1.15rem", fontWeight: 700, color: NAVY, marginBottom: 8 },
  featureText: { fontSize: "0.94rem", lineHeight: 1.6, color: "#55554f" },

  // QUALIFICATIONS
  qualSection: { padding: "70px 0", background: "#F2ECDC" },
  qualGrid: { display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56 },
  qualParagraph: { fontSize: "1.02rem", lineHeight: 1.75, color: "#48484a", maxWidth: 440 },
  checkList: { display: "flex", flexDirection: "column", gap: 14 },
  checkRow: { display: "flex", alignItems: "center", gap: 16, background: WHITE, borderRadius: 14, padding: "20px 22px" },
  checkCircle: { width: 26, height: 26, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  checkText: { fontSize: "0.98rem", color: "#2B2B28", lineHeight: 1.4 },

  // REQUIREMENTS
  reqSection: { padding: "70px 0" },
  reqParagraph: { fontSize: "1.02rem", lineHeight: 1.75, color: "#48484a", maxWidth: 560, marginBottom: 44 },
  reqGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 },
  reqCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, padding: 28 },
  reqIconBox: { width: 44, height: 44, borderRadius: 12, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  reqCardTitle: { fontSize: "1.15rem", fontWeight: 700, color: NAVY, marginBottom: 10 },
  reqCardText: { fontSize: "0.92rem", lineHeight: 1.6, color: "#55554f" },

  // REVIEWS (dark)
  reviewSection: { padding: "76px 0", background: DARK },
  reviewHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 30, flexWrap: "wrap", marginBottom: 48 },
  eyebrowDark: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: AMBER },
  reviewHeading: { fontSize: "2.4rem", fontWeight: 700, color: WHITE, lineHeight: 1.18, marginTop: 16, maxWidth: 540 },
  ratingBlock: { textAlign: "right" },
  stars: { color: AMBER, fontSize: "1.2rem", letterSpacing: "2px", display: "block", marginBottom: 4 },
  ratingText: { fontSize: "0.92rem", color: "#c8c8c2" },
  reviewGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  reviewCard: { background: DARKCARD, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "28px 26px" },
  quoteIcon: { color: AMBER, fontSize: "1.6rem", fontFamily: "'Fraunces', serif", display: "block", marginBottom: 14 },
  reviewQuote: { fontSize: "0.96rem", lineHeight: 1.7, color: "#e6e6e2", marginBottom: 24 },
  reviewDivider: { height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 16 },
  reviewName: { fontSize: "0.96rem", fontWeight: 700, color: WHITE, marginBottom: 2 },
  reviewRole: { fontSize: "0.84rem", color: "#9a9a94" },

  // FAQ
  faqSection: { padding: "76px 0" },
  faqSubtext: { fontSize: "1.05rem", color: "#55554f", maxWidth: 560, marginBottom: 40 },
  faqList: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 20, overflow: "hidden" },
  faqItem: { padding: "28px 32px" },
  faqQuestionRow: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", textAlign: "left" },
  faqQuestion: { fontSize: "1.18rem", fontWeight: 700, color: NAVY, fontFamily: "'Fraunces', serif" },
  faqToggle: { width: 32, height: 32, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: NAVY, flexShrink: 0, marginLeft: 20 },
  faqAnswer: { fontSize: "0.98rem", lineHeight: 1.7, color: "#48484a", marginTop: 16, maxWidth: 760 },

  // FINAL CTA
  finalSection: { padding: "0 0 76px" },
  finalCard: { background: "linear-gradient(120deg, #F2ECDC 0%, #EBDFC2 100%)", borderRadius: 26, padding: "56px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32 },
  eyebrowOnTan: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a17a1f" },
  finalHeading: { fontSize: "2.5rem", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginTop: 14, maxWidth: 480 },
  finalActionCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  finalBtn: { background: NAVY, color: WHITE, borderRadius: 999, padding: "16px 30px", fontWeight: 600, fontSize: "0.96rem", whiteSpace: "nowrap" },
  finalLink: { fontSize: "0.88rem", color: "#6b6b66", textDecoration: "underline" },

  // CONTACT
  contactSection: { padding: "76px 0", background: "#F2ECDC", borderTop: `1px solid ${LINE}` },
  contactGrid: { display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 56, alignItems: "start" },
  contactParagraph: { fontSize: "1.02rem", lineHeight: 1.75, color: "#48484a", maxWidth: 440, marginBottom: 32 },
  contactInfoList: { display: "flex", flexDirection: "column", gap: 18 },
  contactInfoRow: { display: "flex", gap: 16, alignItems: "flex-start" },
  contactIconBox: { width: 40, height: 40, borderRadius: 11, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  contactInfoLabel: { fontSize: "0.78rem", color: "#7a7a74", marginBottom: 2 },
  contactInfoValue: { fontSize: "0.98rem", fontWeight: 600, color: NAVY },
  contactFormCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 20, padding: 32 },
  contactFormTitle: { fontSize: "1.4rem", fontWeight: 700, color: NAVY, marginBottom: 6 },
  contactFormSub: { fontSize: "0.92rem", color: "#6b6b66", marginBottom: 24 },
  contactForm: { display: "flex", flexDirection: "column" },
  contactSubmitBtn: { background: NAVY, color: WHITE, borderRadius: 999, padding: "14px 26px", fontWeight: 600, fontSize: "0.94rem", marginTop: 8, alignSelf: "flex-start" },
  contactSentBanner: { background: "#F3E6C8", color: "#6b5220", borderRadius: 12, padding: "18px 20px", fontSize: "0.95rem", fontWeight: 600 },

  // FOOTER
  footer: { borderTop: `1px solid ${LINE}`, padding: "26px 0" },
  footerInner: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 },
  footerText: { fontSize: "0.85rem", color: GRAY },

  // SHARED FIELD
  fieldWrap: { marginBottom: 22 },
  fieldLabel: { display: "block", fontSize: "0.94rem", fontWeight: 600, color: NAVY, marginBottom: 9 },
  fieldRequiredStar: { color: AMBER },
  fieldRow2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 },
  input: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "13px 16px", fontSize: "0.96rem", color: "#2B2B28", fontFamily: "'Inter', sans-serif" },
  select: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "13px 16px", fontSize: "0.96rem", color: "#2B2B28", fontFamily: "'Inter', sans-serif" },

  // APPLICATION FLOW
  applyHeader: { borderBottom: `1px solid ${LINE}`, background: "#F8F4EA" },
  applyHeaderInner: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 84 },
  backHomeBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", fontSize: "0.96rem", color: "#48484a", fontWeight: 500 },
  applyPageWrap: { padding: "64px 0 100px", maxWidth: 980 },
  applyHeading: { fontSize: "2.8rem", fontWeight: 700, color: NAVY, margin: "18px 0 20px", lineHeight: 1.1 },
  applySubtext: { fontSize: "1.05rem", lineHeight: 1.7, color: "#55554f", maxWidth: 640, marginBottom: 32 },

  draftBanner: { display: "flex", alignItems: "center", gap: 12, background: "#F3E6C8", border: "1px solid #E3CB94", borderRadius: 14, padding: "18px 22px", fontSize: "0.96rem", color: "#3a3a36", marginBottom: 36 },
  draftBannerIcon: { display: "flex", flexShrink: 0 },
  draftBannerLink: { background: "none", textDecoration: "underline", fontWeight: 700, color: "#3a3a36", fontSize: "0.96rem", padding: 0 },

  stepPillsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 },
  stepPill: { display: "flex", alignItems: "flex-start", gap: 14, border: "1.5px solid", borderRadius: 14, padding: "18px 18px", textAlign: "left" },
  stepPillNumber: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.92rem", fontWeight: 700, flexShrink: 0 },
  stepPillTitle: { display: "block", fontSize: "1.02rem", fontWeight: 700, color: NAVY, fontFamily: "'Fraunces', serif" },
  stepPillSubtitle: { display: "block", fontSize: "0.86rem", color: "#7a7a74", marginTop: 2 },

  applyFormCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 22, padding: "40px 44px", boxShadow: "0 24px 60px -30px rgba(20,33,58,0.15)" },
  stepCardHeading: { fontSize: "1.7rem", fontWeight: 700, color: NAVY, marginBottom: 8 },
  stepCardSub: { fontSize: "0.98rem", color: "#6b6b66", marginBottom: 28 },
  stepDivider: { height: 1, background: LINE, margin: "12px 0 28px" },
  stepActionsRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  continueBtn: { background: NAVY, color: WHITE, borderRadius: 999, padding: "15px 26px", fontWeight: 600, fontSize: "0.96rem" },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 999, padding: "15px 24px", fontWeight: 600, fontSize: "0.96rem", color: NAVY },

  uploadBox: { display: "flex", alignItems: "center", gap: 14, border: `1.5px dashed ${LINE}`, borderRadius: 12, padding: "16px 18px", background: "#FAF7EF", cursor: "pointer" },
  uploadIconBox: { width: 38, height: 38, borderRadius: 10, background: "#F3E6C8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  uploadTextCol: { flexGrow: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  uploadMainText: { fontSize: "0.94rem", color: "#2B2B28", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  uploadHintText: { fontSize: "0.82rem", color: "#7a7a74" },
  browseBtn: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 999, padding: "9px 18px", fontSize: "0.88rem", fontWeight: 600, color: NAVY, flexShrink: 0 },

  reviewBlock: { border: `1px solid ${LINE}`, borderRadius: 16, padding: "22px 26px", marginBottom: 22, background: "#FAF7EF" },
  reviewBlockHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  reviewBlockTitle: { fontSize: "1.2rem", fontWeight: 700, color: NAVY },
  reviewEditLink: { background: "none", color: AMBER, fontWeight: 700, fontSize: "0.9rem" },
  reviewRowList: { display: "flex", flexDirection: "column", gap: 12 },
  reviewRow: { display: "flex", justifyContent: "space-between", gap: 20 },
  reviewRowLabel: { fontSize: "0.92rem", color: "#7a7a74", flexShrink: 0 },
  reviewRowValue: { fontSize: "0.96rem", fontWeight: 600, color: NAVY, textAlign: "right" },

  submittedCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 22, padding: "56px 48px", textAlign: "center", maxWidth: 560, margin: "0 auto" },
  submittedIconWrap: { width: 64, height: 64, borderRadius: "50%", background: "#F3E6C8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" },
  submittedHeading: { fontSize: "1.9rem", fontWeight: 700, color: NAVY, marginBottom: 14 },
  submittedText: { fontSize: "1rem", lineHeight: 1.7, color: "#55554f", marginBottom: 28 },
};
import React from "react";
import {
  GRADE_HISTORY,
  GRADE_DOCUMENTS,
  PREDICTED_GWA,
  GWA_THRESHOLD,
  s,
} from "@/components/ScholarShared";

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default function ScholarGradePage() {
  return (
    <div style={s.pageWrap}>
      <h2 style={s.pageHeading}>Grades</h2>
      <p style={s.pageSub}>Your predicted GWA, term history, and grade documents.</p>

      <div className="vd-stat-row" style={s.statRow}>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Predicted GWA</p>
          <p style={s.statCardValue}>{PREDICTED_GWA}%</p>
          <div style={s.statProgressTrack}>
            <div style={{ ...s.statProgressFill, width: "88%" }} />
          </div>
          <p style={s.statCardCaption}>On track — above the {GWA_THRESHOLD}% threshold</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Terms passed</p>
          <p style={s.statCardValue}>{GRADE_HISTORY.filter((g) => g.status === "passed").length} of {GRADE_HISTORY.length}</p>
          <p style={{ ...s.statCardCaption, color: "#6b8a3e", marginTop: "auto" }}>No failing marks on record</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Retention threshold</p>
          <p style={s.statCardValue}>{GWA_THRESHOLD}%</p>
          <p style={{ ...s.statCardCaption, marginTop: "auto" }}>Minimum required every semester</p>
        </div>
      </div>

      <h3 style={{ ...s.cardHeading, marginBottom: 14 }}>Term history</h3>
      <div style={s.gradeTable}>
        {GRADE_HISTORY.map((term, i) => (
          <div
            key={term.term}
            style={{ ...s.gradeRow, borderBottom: i === GRADE_HISTORY.length - 1 ? "none" : "1px solid #E4DCC8" }}
          >
            <div style={s.gradeTermCol}>
              <p style={s.gradeTerm}>{term.term}</p>
              <p style={s.gradeNote}>{term.note}</p>
            </div>
            <span
              style={{
                ...s.statusTag,
                background: term.status === "passed" ? "#F3E6C8" : "#F2ECDC",
                color: "#6b5220",
              }}
            >
              {term.status}
            </span>
            <span style={s.gradeValue}>{term.gwa}%</span>
          </div>
        ))}
      </div>

      <h3 style={{ ...s.cardHeading, margin: "28px 0 14px" }}>Grade documents</h3>
      <div style={s.profileDocList}>
        {GRADE_DOCUMENTS.map((doc) => (
          <div key={doc.label} style={s.profileDocRow}>
            <span style={s.feedIconBox}>
              <DocIcon />
            </span>
            <div style={s.profileDocInfo}>
              <p style={s.profileDocLabel}>{doc.label}</p>
              <p style={s.profileDocFile}>
                {doc.file} · {doc.size}
              </p>
            </div>
            <span
              style={{
                ...s.statusTag,
                background: doc.status === "verified" ? "#F3E6C8" : "#F2ECDC",
                color: "#6b5220",
              }}
            >
              {doc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
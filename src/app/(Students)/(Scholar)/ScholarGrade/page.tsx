"use client";

import React, { useState } from "react";
import {
  GRADE_HISTORY,
  GRADE_DOCUMENTS,
  SUBMISSION_HISTORY,
  PREDICTED_GWA,
  GWA_THRESHOLD,
  AMBER_BG,
  LINE,
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

function ReceiptIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

const STATUS_STYLE: Record<string, { background: string; color: string }> = {
  verified: { background: "#E3EEDB", color: "#3f6b2c" },
  passed: { background: "#E3EEDB", color: "#3f6b2c" },
  pending: { background: AMBER_BG, color: "#6b5220" },
  rejected: { background: "#F6E4DF", color: "#8a3a2e" },
};

interface UploadRowProps {
  label: string;
  hint: string;
  icon: React.ReactNode;
  fileName: string | null;
  onChoose: (file: File | null) => void;
}

function UploadRow({ label, hint, icon, fileName, onChoose }: UploadRowProps) {
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <p style={s.fieldLabel}>{label}</p>
      <label htmlFor={inputId} style={s.uploadBox}>
        <span style={s.uploadIconBox}>{icon}</span>
        <span style={s.uploadTextCol}>
          <span style={s.uploadMainText}>{fileName ?? "No file selected"}</span>
          <span style={s.uploadHintText}>{hint}</span>
        </span>
        <span style={s.browseBtn}>Browse</span>
      </label>
      <input
        id={inputId}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={(e) => onChoose(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export default function ScholarGradePage() {
  const [soaFile, setSoaFile] = useState<File | null>(null);
  const [gradeFile, setGradeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = Boolean(soaFile || gradeFile);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <div style={s.pageWrap}>
      <h2 style={s.pageHeading}>Grades &amp; Statement of Account</h2>
      <p style={s.pageSub}>
        Submit this semesters grade report and Statement of Account, and track everything youve sent before.
      </p>

      <div className="vd-stat-row" style={s.statRow}>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Current GWA</p>
          <p style={s.statCardValue}>{PREDICTED_GWA}%</p>
          <div style={s.statProgressTrack}>
            <div style={{ ...s.statProgressFill, width: "88%" }} />
          </div>
          <p style={s.statCardCaption}>Above the {GWA_THRESHOLD}% threshold</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Terms passed</p>
          <p style={s.statCardValue}>
            {GRADE_HISTORY.filter((g) => g.status === "passed").length} of {GRADE_HISTORY.length}
          </p>
          <p style={{ ...s.statCardCaption, color: "#6b8a3e", marginTop: "auto" }}>No failing marks on record</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Retention threshold</p>
          <p style={s.statCardValue}>{GWA_THRESHOLD}%</p>
          <p style={{ ...s.statCardCaption, marginTop: "auto" }}>Minimum required every semester</p>
        </div>
      </div>

      <h3 style={{ ...s.cardHeading, marginBottom: 6 }}>Submit this terms documents</h3>
      <p style={{ ...s.pageSub, marginBottom: 18 }}>
        Upload your Statement of Account and grade report for the current semester.
      </p>

      <div style={s.uploadSectionGrid}>
        <UploadRow
          label="Statement of Account (SOA)"
          hint="PDF, JPG, or PNG · Max 5MB"
          icon={<ReceiptIcon />}
          fileName={soaFile?.name ?? null}
          onChoose={setSoaFile}
        />
        <UploadRow
          label="Grade report / Report card"
          hint="PDF, JPG, or PNG · Max 5MB"
          icon={<DocIcon />}
          fileName={gradeFile?.name ?? null}
          onChoose={setGradeFile}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          ...s.continueBtn,
          marginTop: 18,
          opacity: canSubmit ? 1 : 0.5,
          cursor: canSubmit ? "pointer" : "not-allowed",
        }}
      >
        Submit documents
      </button>

      {submitted && (
        <div style={s.sentBanner}>
          <DocIcon />
          <span>Thanks — your documents were submitted and are now pending review.</span>
        </div>
      )}

      <h3 style={{ ...s.cardHeading, margin: "36px 0 14px" }}>This terms required documents</h3>
      <div style={s.profileDocList}>
        {GRADE_DOCUMENTS.map((doc) => {
          const tone = STATUS_STYLE[doc.status] ?? STATUS_STYLE.pending;
          return (
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
              <span style={{ ...s.statusTag, background: tone.background, color: tone.color }}>{doc.status}</span>
            </div>
          );
        })}
      </div>

      <h3 style={{ ...s.cardHeading, margin: "36px 0 14px" }}>Term history</h3>
      <div style={s.gradeTable}>
        {GRADE_HISTORY.map((term, i) => {
          const tone = STATUS_STYLE[term.status] ?? STATUS_STYLE.pending;
          return (
            <div
              key={term.term}
              style={{ ...s.gradeRow, borderBottom: i === GRADE_HISTORY.length - 1 ? "none" : `1px solid ${LINE}` }}
            >
              <div style={s.gradeTermCol}>
                <p style={s.gradeTerm}>{term.term}</p>
                <p style={s.gradeNote}>{term.note}</p>
              </div>
              <span style={{ ...s.statusTag, background: tone.background, color: tone.color, marginRight: 4 }}>
                {term.status}
              </span>
              <span style={s.gradeValue}>{term.gwa}%</span>
            </div>
          );
        })}
      </div>

      <h3 style={{ ...s.cardHeading, margin: "36px 0 14px" }}>Past submissions</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SUBMISSION_HISTORY.map((sub) => {
          const tone = STATUS_STYLE[sub.status] ?? STATUS_STYLE.pending;
          return (
            <div key={sub.id} style={s.submissionRow}>
              <span style={s.feedIconBox}>{sub.type === "Statement of Account" ? <ReceiptIcon /> : <DocIcon />}</span>
              <div style={s.profileDocInfo}>
                <p style={s.profileDocLabel}>
                  {sub.type} · {sub.term}
                </p>
                <p style={s.profileDocFile}>
                  {sub.file} · {sub.size}
                </p>
                <p style={s.submissionMeta}>Submitted {sub.submittedDate}</p>
              </div>
              <span style={{ ...s.statusTag, background: tone.background, color: tone.color }}>{sub.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
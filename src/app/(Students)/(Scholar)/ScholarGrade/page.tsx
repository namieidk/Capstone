"use client";

import React, { useState } from "react";
import { useSidebar } from "@/components/SidebarContext";
import {
  GRADE_HISTORY,
  GRADE_CERTIFICATES,
  CURRENT_TERM_LABEL,
  CERTIFICATE_DUE_DATE,
  PREDICTED_GWA,
  GWA_THRESHOLD,
  AMBER_BG,
  LINE,
  MenuIcon,
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

const STATUS_STYLE: Record<string, { background: string; color: string }> = {
  verified: { background: "#E3EEDB", color: "#3f6b2c" },
  passed: { background: "#E3EEDB", color: "#3f6b2c" },
  pending: { background: AMBER_BG, color: "#6b5220" },
  not_submitted: { background: "#F6E4DF", color: "#8a3a2e" },
};

const STATUS_LABEL: Record<string, string> = {
  verified: "Verified",
  pending: "Pending",
  not_submitted: "Not submitted",
};

interface UploadRowProps {
  label: string;
  hint: string;
  fileName: string | null;
  onChoose: (file: File | null) => void;
}

function UploadRow({ label, hint, fileName, onChoose }: UploadRowProps) {
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <p style={s.fieldLabel}>{label}</p>
      <label htmlFor={inputId} style={s.uploadBox}>
        <span style={s.uploadIconBox}>
          <DocIcon />
        </span>
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
  const { toggleMobile } = useSidebar();
  const [certFile, setCertFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = Boolean(certFile);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <div>
      <header style={s.topbar}>
        <button className="vd-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Grades</h1>
          <p style={s.topbarSub}>Submit your certificate of grades and track your academic standing.</p>
        </div>
      </header>

      <div style={s.mainContent}>
        <div style={s.pageWrap}>
          <div className="vd-stat-row" style={{ ...s.statRow, marginTop: 16 }}>
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

          <h3 style={{ ...s.cardHeading, marginBottom: 6 }}>Submit this semesters certificate</h3>
          <p style={{ ...s.pageSub, marginBottom: 18 }}>
            Every semester, upload a Certificate of Grades or Scholarship Continuation issued by your school registrar for{" "}
            <strong>{CURRENT_TERM_LABEL}</strong>. Due {CERTIFICATE_DUE_DATE}.
          </p>

          <UploadRow
            label="Certificate of Grades / Scholarship Continuation"
            hint="PDF, JPG, or PNG · Max 5MB"
            fileName={certFile?.name ?? null}
            onChoose={setCertFile}
          />

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
            Submit certificate
          </button>

          {submitted && (
            <div style={s.sentBanner}>
              <DocIcon />
              <span>Thanks — your certificate was submitted and is now pending review.</span>
            </div>
          )}

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

          <h3 style={{ ...s.cardHeading, margin: "36px 0 14px" }}>Certificate submissions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {GRADE_CERTIFICATES.map((cert) => {
              const tone = STATUS_STYLE[cert.status] ?? STATUS_STYLE.pending;
              return (
                <div key={cert.term} style={s.submissionRow}>
                  <span style={s.feedIconBox}>
                    <DocIcon />
                  </span>
                  <div style={s.profileDocInfo}>
                    <p style={s.profileDocLabel}>Certificate of Grades · {cert.term}</p>
                    <p style={s.profileDocFile}>
                      {cert.file} {cert.size !== "—" ? `· ${cert.size}` : ""}
                    </p>
                    <p style={s.submissionMeta}>
                      {cert.submittedDate !== "—" ? `Submitted ${cert.submittedDate}` : "Not yet submitted"}
                    </p>
                  </div>
                  <span style={{ ...s.statusTag, background: tone.background, color: tone.color, flexShrink: 0 }}>
                    {STATUS_LABEL[cert.status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
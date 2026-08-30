"use client";

import React, { useState } from "react";
import { useSidebar } from "../../../../components/SidebarContext";
import {
  CheckIconSmall,
  CheckCircleIcon,
  ApplicationIcon,
  MenuIcon,
  BellIcon,
  APPLICATION_STAGES,
  CURRENT_STAGE_INDEX,
  PROFILE_DOCUMENTS,
  AMBER,
  AMBER_BG,
  NAVY,
  WHITE,
  LINE,
  s,
} from "../../../../components/StudentShared";

interface DocState {
  label: string;
  file: string;
  size: string;
  submitted: boolean;
}

export default function ApplicationPage() {
  const { toggleMobile } = useSidebar();

  const [docs, setDocs] = useState<DocState[]>(() =>
    PROFILE_DOCUMENTS.map((d) => ({
      label: d.label,
      file: d.file,
      size: d.size,
      submitted: d.status === "verified",
    }))
  );

  const allSubmitted = docs.every((d) => d.submitted);
  const [view, setView] = useState<"upload" | "status">(allSubmitted ? "status" : "upload");

  const submittedCount = docs.filter((d) => d.submitted).length;

  function handleUpload(label: string) {
    const updated = docs.map((d) =>
      d.label === label ? { ...d, submitted: true, file: d.file === "—" ? `${label.split(" ")[0].toLowerCase()}_upload.pdf` : d.file } : d
    );
    setDocs(updated);
    if (updated.every((d) => d.submitted)) {
      setView("status");
    }
  }

  return (
    <div style={{ background: WHITE, minHeight: "100vh" }}>
      <header style={s.topbar}>
        <button className="vd-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Application</h1>
          <p style={s.topbarSub}>Upload your requirements and track your progress.</p>
        </div>
        <div style={s.topbarRight}>
          <button style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      <div style={s.mainContent}>
        <div style={{ ...s.pageWrap, marginTop: 28 }}>
          <div style={s.tabRow}>
            <button
              onClick={() => setView("upload")}
              style={{
                ...s.tabButton,
                color: view === "upload" ? NAVY : "#8a8a84",
                borderBottomColor: view === "upload" ? AMBER : "transparent",
              }}
            >
              Documents
            </button>
            <button
              onClick={() => allSubmitted && setView("status")}
              disabled={!allSubmitted}
              title={!allSubmitted ? "Upload all documents to unlock" : undefined}
              style={{
                ...s.tabButton,
                color: view === "status" ? NAVY : "#c2c2ba",
                borderBottomColor: view === "status" ? AMBER : "transparent",
                cursor: allSubmitted ? "pointer" : "not-allowed",
              }}
            >
              Application status
            </button>
          </div>

          {view === "upload" && (
            <>
              <h2 style={s.pageHeading}>Upload your documents</h2>
              <p style={s.pageSub}>
                Submit all required documents below ({submittedCount} of {docs.length} uploaded). Once everything is
                submitted, your application status will unlock automatically.
              </p>

              <div style={s.profileDocList}>
                {docs.map((doc) => (
                  <div key={doc.label} style={s.profileDocRow}>
                    <span style={s.feedIconBox}>
                      <ApplicationIcon />
                    </span>
                    <div style={s.profileDocInfo}>
                      <p style={s.profileDocLabel}>{doc.label}</p>
                      <p style={s.profileDocFile}>{doc.submitted ? `${doc.file} · ${doc.size}` : "Not uploaded yet"}</p>
                    </div>
                    {doc.submitted ? (
                      <span style={{ ...s.statusTag, background: AMBER_BG, color: "#6b5220" }}>
                        Uploaded
                      </span>
                    ) : (
                      <button onClick={() => handleUpload(doc.label)} style={s.continueBtnSmall}>
                        Upload
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {allSubmitted && (
                <div style={{ ...s.appNoteCard, marginTop: 20 }}>
                  <span style={s.appNoteIcon}>
                    <CheckCircleIcon />
                  </span>
                  <p style={s.appNoteText}>
                    All documents submitted! Head to the <strong>Application status</strong> tab to see your progress.
                  </p>
                </div>
              )}
            </>
          )}

          {view === "status" && (
            <>
              <h2 style={s.pageHeading}>Track your application</h2>
              <p style={s.pageSub}>Submitted Jun 12, 2026 · Academic Track</p>

              <div style={s.appStatusCard}>
                <div style={s.appStatusHeader}>
                  <span style={s.appStatusBadge}>Currently: {APPLICATION_STAGES[CURRENT_STAGE_INDEX].title}</span>
                  <span style={s.appStatusDate}>Updated {APPLICATION_STAGES[CURRENT_STAGE_INDEX].date}</span>
                </div>

                <div style={s.appTimeline}>
                  {APPLICATION_STAGES.map((stage, i) => {
                    const done = i < CURRENT_STAGE_INDEX;
                    const active = i === CURRENT_STAGE_INDEX;
                    return (
                      <div key={stage.key} style={s.appTimelineRow}>
                        <div style={s.appTimelineMarkerCol}>
                          <span
                            style={{
                              ...s.appTimelineDot,
                              background: done ? AMBER : active ? NAVY : WHITE,
                              borderColor: done ? AMBER : active ? NAVY : LINE,
                              color: done ? NAVY : WHITE,
                            }}
                          >
                            {done ? <CheckIconSmall /> : i + 1}
                          </span>
                          {i < APPLICATION_STAGES.length - 1 && (
                            <span style={{ ...s.appTimelineLine, background: done ? AMBER : LINE }} />
                          )}
                        </div>
                        <div style={{ paddingBottom: i < APPLICATION_STAGES.length - 1 ? 28 : 0 }}>
                          <p style={{ ...s.appTimelineTitle, color: active ? NAVY : done ? NAVY : "#9a9a94" }}>
                            {stage.title}
                          </p>
                          <p style={s.appTimelineDate}>{stage.date}</p>
                          <p style={s.appTimelineDesc}>{stage.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={s.appNoteCard}>
                <span style={s.appNoteIcon}>
                  <CheckCircleIcon />
                </span>
                <p style={s.appNoteText}>
                  Your interview is scheduled for Jun 26, 2026. Check the
                  <strong> Meetings</strong> page for the call details.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
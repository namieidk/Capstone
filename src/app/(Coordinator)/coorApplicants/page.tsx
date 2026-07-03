"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  CheckCircleIcon,
  DownloadIcon,
  ArrowRightIcon,
  DrawerInfoRow,
  APPLICANTS,
  STAGE_COLORS,
  Applicant,
  Stage,
  NAVY,
  WHITE,
  LINE,
  s,
} from "@/components/Coordinatorshared";

const STAGE_FILTERS: (Stage | "All")[] = ["All", "Submitted", "Under review", "Interview", "Accepted", "Rejected"];

export default function ApplicantsPage() {
  const [filter, setFilter] = useState<Stage | "All">("All");
  const [applicants, setApplicants] = useState<Applicant[]>(APPLICANTS);
  const [selected, setSelected] = useState<Applicant | null>(null);

  const filtered = filter === "All" ? applicants : applicants.filter((a) => a.stage === filter);

  const moveStage = (id: number, stage: Stage) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, stage } : a)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, stage } : sel));
  };

  return (
    <div style={s.pageContentTop}>
      <div style={s.filterRow}>
        {STAGE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...s.filterChip, background: filter === f ? NAVY : WHITE, color: filter === f ? WHITE : "#55554f", borderColor: filter === f ? NAVY : LINE }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="vc-table-scroll" style={s.tableWrap}>
        <table>
          <thead>
            <tr>
              <th style={s.th}>Applicant</th>
              <th style={s.th}>Track</th>
              <th style={s.th}>GWA</th>
              <th style={s.th}>Applied</th>
              <th style={s.th}>Stage</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} style={s.tr}>
                <td style={s.td}>
                  <div style={s.tdNameRow}>
                    <span style={s.convoAvatar}>{a.initials}</span>
                    <div>
                      <p style={s.tdName}>{a.name}</p>
                      <p style={s.tdSub}>
                        {a.course} · {a.year}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={s.td}>{a.track}</td>
                <td style={s.td}>{a.gwa}%</td>
                <td style={s.td}>{a.applied}</td>
                <td style={s.td}>
                  <span style={{ ...s.stageTag, background: STAGE_COLORS[a.stage].bg, color: STAGE_COLORS[a.stage].text }}>{a.stage}</span>
                </td>
                <td style={s.td}>
                  <button onClick={() => setSelected(a)} style={s.tableActionBtn}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <ApplicantDrawer applicant={selected} onClose={() => setSelected(null)} onMoveStage={moveStage} />}
    </div>
  );
}

interface ApplicantDrawerProps {
  applicant: Applicant;
  onClose: () => void;
  onMoveStage: (id: number, stage: Stage) => void;
}

function ApplicantDrawer({ applicant, onClose, onMoveStage }: ApplicantDrawerProps) {
  return (
    <div style={s.drawerOverlay} onClick={onClose}>
      <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
        <div style={s.drawerHeader}>
          <span style={s.profileAvatar}>{applicant.initials}</span>
          <div style={{ flexGrow: 1 }}>
            <h3 style={s.drawerName}>{applicant.name}</h3>
            <p style={s.drawerMeta}>
              {applicant.course} · {applicant.year}
            </p>
          </div>
          <button onClick={onClose} style={s.drawerCloseBtn}>
            <XCircleIcon />
          </button>
        </div>

        <div style={s.drawerInfoGrid}>
          <DrawerInfoRow label="Track" value={applicant.track} />
          <DrawerInfoRow label="GWA" value={`${applicant.gwa}%`} />
          <DrawerInfoRow label="Applied" value={applicant.applied} />
          <DrawerInfoRow label="Current stage" value={applicant.stage} />
        </div>

        <p style={s.drawerSectionLabel}>Documents on file</p>
        <div style={s.drawerDocList}>
          {["Grades / TOR", "Proof of employment", "Report card / Form 138"].map((d) => (
            <div key={d} style={s.drawerDocRow}>
              <span>
                <CheckCircleIcon small />
              </span>
              <span style={s.drawerDocText}>{d}</span>
              <button style={s.profileDocDownload}>
                <DownloadIcon />
              </button>
            </div>
          ))}
        </div>

        <p style={s.drawerSectionLabel}>Move to stage</p>
        <div style={s.drawerStageActions}>
          {applicant.stage !== "Interview" && applicant.stage !== "Accepted" && (
            <button onClick={() => onMoveStage(applicant.id, "Interview")} style={s.continueBtnSmall}>
              Pass to Interview <ArrowRightIcon />
            </button>
          )}
          {applicant.stage === "Interview" && (
            <button onClick={() => onMoveStage(applicant.id, "Accepted")} style={s.continueBtnSmall}>
              Accept applicant <ArrowRightIcon />
            </button>
          )}
          {applicant.stage !== "Rejected" && applicant.stage !== "Accepted" && (
            <button onClick={() => onMoveStage(applicant.id, "Rejected")} style={s.rejectBtn}>
              Reject application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
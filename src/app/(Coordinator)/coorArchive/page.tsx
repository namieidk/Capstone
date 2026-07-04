"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  ArchiveIcon,
  DownloadIcon,
  DrawerInfoRow,
  ARCHIVED_SCHOLARS,
  ARCHIVE_STATUS_STYLE,
  PAYMENT_STATUS_COLORS,
  GRADE_STATUS_COLORS,
  ArchivedScholar,
  NAVY,
  WHITE,
  LINE,
  s,
} from "@/components/Coordinatorshared";

const ARCHIVE_FILTERS: (ArchivedScholar["status"] | "All")[] = ["All", "Graduated", "Terminated", "Withdrawn"];

export default function ArchivePage() {
  const [filter, setFilter] = useState<ArchivedScholar["status"] | "All">("All");
  const [selected, setSelected] = useState<ArchivedScholar | null>(null);

  const filtered = filter === "All" ? ARCHIVED_SCHOLARS : ARCHIVED_SCHOLARS.filter((s2) => s2.status === filter);

  const counts: Record<string, number> = {
    All: ARCHIVED_SCHOLARS.length,
    Graduated: ARCHIVED_SCHOLARS.filter((s2) => s2.status === "Graduated").length,
    Terminated: ARCHIVED_SCHOLARS.filter((s2) => s2.status === "Terminated").length,
    Withdrawn: ARCHIVED_SCHOLARS.filter((s2) => s2.status === "Withdrawn").length,
  };

  return (
    <div style={s.pageContentTop}>
      <div style={s.filterRow}>
        {ARCHIVE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...s.filterChip, background: filter === f ? NAVY : WHITE, color: filter === f ? WHITE : "#55554f", borderColor: filter === f ? NAVY : LINE }}
          >
            {f} <span style={s.filterChipCount}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="vc-table-scroll" style={s.tableWrap}>
        <table>
          <thead>
            <tr>
              <th style={s.th}>Scholar</th>
              <th style={s.th}>Track</th>
              <th style={s.th}>Joined</th>
              <th style={s.th}>Exited</th>
              <th style={s.th}>Status</th>
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
                      <p style={s.tdSub}>{a.course}</p>
                    </div>
                  </div>
                </td>
                <td style={s.td}>{a.track}</td>
                <td style={s.td}>{a.joined}</td>
                <td style={s.td}>{a.exited}</td>
                <td style={s.td}>
                  <span style={{ ...s.stageTag, background: ARCHIVE_STATUS_STYLE[a.status].bg, color: ARCHIVE_STATUS_STYLE[a.status].text }}>{a.status}</span>
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

      {selected && (
        <div style={s.drawerOverlay} onClick={() => setSelected(null)}>
          <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div style={s.drawerHeader}>
              <span style={s.profileAvatar}>{selected.initials}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>{selected.name}</h3>
                <p style={s.drawerMeta}>{selected.course}</p>
              </div>
              <button onClick={() => setSelected(null)} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>

            <div style={s.drawerInfoGrid}>
              <DrawerInfoRow label="Track" value={selected.track} />
              <DrawerInfoRow label="Status" value={selected.status} />
              <DrawerInfoRow label="Joined" value={selected.joined} />
              <DrawerInfoRow label="Exited" value={selected.exited} />
            </div>

            <p style={s.drawerSectionLabel}>Exit note</p>
            <div style={s.appNoteCard}>
              <span style={s.appNoteIcon}>
                <ArchiveIcon />
              </span>
              <p style={s.appNoteText}>{selected.note}</p>
            </div>

            <div style={s.historySection}>
              <p style={s.drawerSectionLabel}>Grade history</p>
              <div style={s.historyList}>
                {selected.gradeHistory.map((g, i) => (
                  <div key={i} style={s.historyRow}>
                    <div style={s.historyRowLeft}>
                      <span style={s.historyRowTerm}>{g.term}</span>
                      <span style={s.historyRowSub}>GWA {g.gwa}%</span>
                    </div>
                    <div style={s.historyRowRight}>
                      <span
                        style={{
                          ...s.stageTag,
                          background: GRADE_STATUS_COLORS[g.status].bg,
                          color: GRADE_STATUS_COLORS[g.status].text,
                        }}
                      >
                        {g.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.historySection}>
              <p style={s.drawerSectionLabel}>Payment history</p>
              <div style={s.historyList}>
                {selected.paymentHistory.map((p, i) => (
                  <div key={i} style={s.historyRow}>
                    <div style={s.historyRowLeft}>
                      <span style={s.historyRowTerm}>{p.term}</span>
                      <span style={s.historyRowSub}>{p.date}</span>
                    </div>
                    <div style={s.historyRowRight}>
                      <span style={s.historyRowValue}>₱{p.amount.toLocaleString()}</span>
                      <span
                        style={{
                          ...s.stageTag,
                          background: PAYMENT_STATUS_COLORS[p.status].bg,
                          color: PAYMENT_STATUS_COLORS[p.status].text,
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.drawerStageActions}>
              <button style={s.continueBtnSmall}>
                <DownloadIcon /> Download scholar record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
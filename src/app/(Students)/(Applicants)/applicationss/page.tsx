import React from "react";
import {
  CheckIconSmall,
  CheckCircleIcon,
  APPLICATION_STAGES,
  CURRENT_STAGE_INDEX,
  AMBER,
  NAVY,
  WHITE,
  LINE,
  s,
} from "../../../../components/StudentShared";

export default function ApplicationPage() {
  return (
    <div style={s.pageWrap}>
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
                  <p style={{ ...s.appTimelineTitle, color: active ? NAVY : done ? NAVY : "#9a9a94" }}>{stage.title}</p>
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
    </div>
  );
}
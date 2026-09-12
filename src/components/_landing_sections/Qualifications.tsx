"use client";

import { Flag, GraduationCap, Percent, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Container, Eyebrow, Reveal, SectionHeading } from "./shared";

interface Qualification {
  n: string;
  Icon: LucideIcon;
  text: string;
}

const QUALIFICATIONS: Qualification[] = [
  { n: "01", Icon: Flag, text: "Filipino citizen residing in or studying within Davao City" },
  { n: "02", Icon: Users, text: "Immediate relative of an employee of a partner private company (or endorsed applicant)" },
  { n: "03", Icon: GraduationCap, text: "Incoming or current college student enrolled in an accredited HEI" },
  { n: "04", Icon: Percent, text: "Maintain a minimum 90% General Weighted Average (GWA) every semester" },
  { n: "05", Icon: ShieldCheck, text: "No failing grades, incomplete marks, or dropped subjects" },
];

// Alternating vertical offset per item — creates the zigzag rhythm.
const OFFSET = ["lg:mt-0", "lg:mt-20", "lg:mt-0", "lg:mt-20", "lg:mt-0"];
// Matching y-positions (%) used to draw the connector line through the same zigzag.
const LINE_Y = [22, 62, 22, 62, 22];
const LINE_X = [8, 27, 50, 73, 92];

// Fixed positions/timings (not Math.random() at render time) so the layout
// stays identical between server and client — only the CSS animation makes
// them drift and flicker.
const FIREFLIES = [
  { left: "6%", top: "18%", size: 4, duration: 7.2, delay: 0 },
  { left: "14%", top: "62%", size: 3, duration: 8.6, delay: 1.1 },
  { left: "22%", top: "34%", size: 5, duration: 6.4, delay: 2.3 },
  { left: "31%", top: "78%", size: 3, duration: 9.4, delay: 0.6 },
  { left: "9%", top: "88%", size: 4, duration: 7.8, delay: 3.1 },
  { left: "40%", top: "12%", size: 3, duration: 8.1, delay: 1.8 },
  { left: "48%", top: "54%", size: 5, duration: 6.9, delay: 0.2 },
  { left: "55%", top: "24%", size: 3, duration: 9.9, delay: 2.6 },
  { left: "63%", top: "70%", size: 4, duration: 7.4, delay: 1.4 },
  { left: "71%", top: "40%", size: 3, duration: 8.3, delay: 3.6 },
  { left: "78%", top: "82%", size: 5, duration: 6.6, delay: 0.9 },
  { left: "85%", top: "20%", size: 3, duration: 9.1, delay: 2.1 },
  { left: "91%", top: "60%", size: 4, duration: 7.7, delay: 1.6 },
  { left: "36%", top: "90%", size: 3, duration: 8.8, delay: 0.4 },
  { left: "60%", top: "8%", size: 4, duration: 7.1, delay: 2.9 },
  { left: "95%", top: "40%", size: 3, duration: 9.6, delay: 1.2 },
];

export function Qualifications() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Fireflies drift a touch toward the cursor, so the field reads as
  // interactive rather than a fixed background loop.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  };

  const fireflyStyle = useMemo(
    () => ({ transform: `translate3d(${tilt.x * 18}px, ${tilt.y * 18}px, 0)` }),
    [tilt],
  );

  const linePoints = LINE_X.map((x, i) => `${x},${LINE_Y[i]}`).join(" ");

  return (
    <section
      id="qualifications"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-background py-19"
    >
      <style>{`
        @keyframes vs-firefly-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          25% { transform: translate(6px, -10px) scale(1.15); opacity: 0.9; }
          50% { transform: translate(-8px, 4px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(4px, 10px) scale(1.1); opacity: 0.85; }
        }
      `}</style>

      {/* Firefly field: soft amber dots that wander and flicker, and drift
          toward the cursor for a light interactive feel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 transition-transform duration-700 ease-out"
        style={fireflyStyle}
      >
        {FIREFLIES.map((f, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber [animation:vs-firefly-drift_ease-in-out_infinite]"
            style={{
              left: f.left,
              top: f.top,
              width: f.size,
              height: f.size,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              boxShadow: "0 0 6px 2px rgba(241, 183, 30, 0.35)",
            }}
          />
        ))}
      </div>

      <Container className="relative">
        <Reveal>
          <div className="mx-auto mb-20 max-w-160 text-center">
            <div className="flex justify-center">
              <Eyebrow>WHO CAN APPLY</Eyebrow>
            </div>
            <SectionHeading className="text-center text-foreground">Qualifications</SectionHeading>
            <p className="mx-auto max-w-120 text-[0.9rem] leading-[1.75] text-muted-foreground">
              We look for students with consistent academic discipline and a clear commitment to finishing their
              degree. Meeting every item below makes you eligible for review.
            </p>
          </div>
        </Reveal>

        {/* Zigzag step row: connector line behind, alternating-height icon
            badges in front, matching the reference layout. */}
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 100 90"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden size-full lg:block"
          >
            <polyline points={linePoints} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" />
          </svg>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {QUALIFICATIONS.map((q, i) => (
              <Reveal key={q.n} delay={i * 110} y={14} className={OFFSET[i]}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-amber/20 bg-amber text-navy shadow-va-sm">
                    <q.Icon className="size-5.5" strokeWidth={1.75} />
                  </span>
                  <span className="mb-1 block text-center text-[0.78rem] font-semibold tracking-[0.1em] text-muted-foreground/70">
                    {q.n}
                  </span>
                  <p className="text-center text-[0.98rem] leading-[1.6] text-foreground/90">{q.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
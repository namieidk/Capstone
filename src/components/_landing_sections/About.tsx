"use client";

import { motion } from "framer-motion";
import { Fireflies } from "./Fireflies";
import { Container, Eyebrow, Reveal, SectionHeading } from "./shared";

interface AboutFeature {
  n: string;
  title: string;
  text: string;
}

const ABOUT_FEATURES: AboutFeature[] = [
  {
    n: "01",
    title: "Built for CRDC's scholarship program",
    text: "ViaScholar was developed specifically for Cawayan River Development Corporation (CRDC) to administer its private scholarship grant for the relatives of partner-company employees, replacing manual, spreadsheet-based tracking.",
  },
  {
    n: "02",
    title: "Data-driven insight, not guesswork",
    text: "Descriptive analytics dashboards summarize applicant eligibility, academic standing, and program trends in real time, giving coordinators clear, evidence-based context to support every decision.",
  },
  {
    n: "03",
    title: "Auditable workflow",
    text: "Submissions, HR verification, contract signing, and check disbursements live in one secure portal — no more lost Messenger threads or unstructured email attachments.",
  },
];

// Shared sticky offset — heading and card 01 pin at the same top so they
// land level with each other.
const BASE_TOP = 100; // px — clears the sticky nav
const PEEK = 20; // px — sliver of each earlier card left visible underneath
// Resting scale for each card once landed — small step so the stack reads
// as depth without looking like a size mismatch.
const SCALE_STEP = 0.015;

function StackedFeatureCard({ f, i }: { f: AboutFeature; i: number }) {
  const isLast = i === ABOUT_FEATURES.length - 1;
  const restScale = 1 - i * SCALE_STEP;

  return (
    <div className="sticky" style={{ top: `${BASE_TOP + i * PEEK}px`, zIndex: i + 1 }}>
      {/*
        The spring "landing" lives entirely on this inner motion.div, never
        on the sticky div above it — that separation is what keeps this
        safe. whileInView fires ONCE as the card scrolls into place, so
        there's no per-frame scroll-linked value fighting the browser's
        native sticky positioning the way useScroll/useTransform did
        before. Each card drops in slightly rotated/offset/oversized and
        springs down to its resting scale, giving the "patong" moment real
        weight instead of an instant snap.
      */}
      <motion.div
        initial={{
          y: 56,
          scale: restScale + 0.06,
          rotate: i % 2 === 0 ? -2.5 : 2.5,
          opacity: 0,
        }}
        whileInView={{
          y: 0,
          scale: restScale,
          rotate: 0,
          opacity: 1,
        }}
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          mass: 0.9,
        }}
        style={{ transformOrigin: "top center" }}
      >
        <div
          className="rounded-2xl bg-navy p-7 ring-1 ring-white/6"
          style={{
            boxShadow: `0 ${24 - i * 4}px ${48 - i * 6}px -20px rgba(0,0,0,${0.55 - i * 0.08})`,
          }}
        >
          <span className="font-serif text-[2rem] leading-none font-medium text-amber">{f.n}</span>
          <h3 className="mt-3 mb-1.5 text-lg font-bold text-white">{f.title}</h3>
          <p className="text-[0.7rem] leading-[1.6] text-white/70">{f.text}</p>
        </div>
      </motion.div>
      {isLast && <div className="h-10" />}
    </div>
  );
}

export function About() {
  return (
    // overflow-hidden intentionally NOT on the section — it breaks
    // position:sticky for everything nested inside it.
    <section id="about" className="relative bg-background py-19">
      <Fireflies />

      <Container className="relative grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="sticky" style={{ top: `${BASE_TOP}px` }}>
            <Reveal>
              <div>
                <Eyebrow>ABOUT VIASCHOLAR</Eyebrow>
                <SectionHeading>A grant program that stays organized and easy to audit.</SectionHeading>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="relative">
          {ABOUT_FEATURES.map((f, i) => (
            <StackedFeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

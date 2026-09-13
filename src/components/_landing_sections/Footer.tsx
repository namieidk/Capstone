import { Container } from "./shared";

const EXPLORE_LINKS = ["About", "Qualifications", "Requirements", "Reviews", "FAQ", "Contact"];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#2f5949] to-[#1c3a2f] pt-12 pb-6">
      {/* Top edge: a soft scalloped rhythm — a third divider language on
          the page (wave up top, torn paper on Reviews, gentle bumps here)
          so no two section seams repeat the same shape. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 h-12 w-full text-background sm:h-14"
      >
        <path
          d="M0,0 L0,22 Q60,42 120,22 Q180,4 240,24 Q300,44 360,22 Q420,2 480,24 Q540,44 600,20 Q660,0 720,22 Q780,44 840,20 Q900,-2 960,22 Q1020,44 1080,22 Q1140,2 1200,24 Q1260,44 1320,20 Q1380,0 1440,20 L1440,0 Z"
          fill="currentColor"
        />
      </svg>

      {/* A couple of soft ambient glows so the lighter navy still has
          depth instead of reading as a flat mid-tone slab. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -left-20 top-10 size-72 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 size-80 rounded-full bg-amber/10 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <span className="font-serif text-[1.3rem] font-medium text-white">ViaScholar</span>
            <p className="mt-3 max-w-80 text-[0.92rem] leading-[1.7] text-white/60">
              A web-based scholarship management system built for CRDC&apos;s private grant program — from application to disbursement, all in one place.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-serif text-lg font-medium text-white">Explore</h4>
            <ul className="flex flex-col gap-2.5">
              {EXPLORE_LINKS.map((link) => <li key={link}><a href={`#${link.toLowerCase()}`} className="text-[0.92rem] text-white/60 hover:text-amber">{link}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-serif text-lg font-medium text-white">Contact</h4>
            <ul className="flex flex-col gap-2.5 text-[0.92rem] text-white/60"><li>gdacaac.plf@gmail.com</li><li>(082) 555 0142</li><li>2F Matina Pavilion Bldg, Davao City</li></ul>
          </div>
        </div>

        {/* Big faded wordmark, echoing the "glaiza" watermark treatment —
            gradient-clipped text that fades toward the bottom edge. */}
        <div aria-hidden className="pointer-events-none mb-2 select-none text-center">
          <span
            className="bg-gradient-to-b from-white/25 to-white/0 bg-clip-text font-serif text-[11vw] italic leading-none text-transparent sm:text-[5.5rem]"
            style={{ WebkitTextStroke: "0.5px rgba(255,255,255,0.06)" }}
          >
            ViaScholar
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10 pt-5">
          <p className="text-[0.85rem] text-white/50">© 2026 ViaScholar. All rights reserved.</p>
          <p className="text-[0.85rem] text-white/50">CRDC Private Scholarship Program</p>
        </div>
      </Container>
    </footer>
  );
}
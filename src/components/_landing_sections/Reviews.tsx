import { Fireflies } from "./Fireflies";
import { Container, Eyebrow, Reveal } from "./shared";

interface Review {
  quote: string;
  name: string;
  role: string;
}

const REVIEWS: Review[] = [
  {
    quote:
      "Before ViaScholar, I had to message our coordinator on Messenger every term. Now everything — grades, contracts, even the check schedule — is just there. It feels professional.",
    name: "Mariella S.",
    role: "BS Accountancy, 4th year",
  },
  {
    quote:
      "The dashboard's analytics give us a clear picture of every applicant's eligibility and academic standing at a glance. What used to take weeks of manual review now takes minutes, and every decision is backed by clear data.",
    name: "Engr. Paolo R.",
    role: "HR Coordinator, partner company",
  },
  {
    quote:
      "Uploading documents used to feel risky over email. The OCR check told me my ITR was unreadable before I submitted — saved me from disqualification.",
    name: "Jonas L.",
    role: "BS Computer Science, 2nd year",
  },
];

const MARQUEE_REVIEWS = [
  ...REVIEWS.map((review) => ({ ...review, copy: "primary" })),
  ...REVIEWS.map((review) => ({ ...review, copy: "duplicate" })),
];

export function Reviews() {
  const EDGE_FADE = "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)";

  return (
    <section id="reviews" className="relative overflow-hidden bg-background py-19">
      {/* Glassy green atmosphere: soft, low-opacity blurred color fields
          rather than a flat fill, so it reads as tinted glass, not paint. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-teal-50/50 to-background" />
        <div className="absolute -left-24 -top-32 size-[26rem] rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute -right-20 top-1/3 size-[22rem] rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 size-[24rem] rounded-full bg-green-100/40 blur-3xl" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Top edge: a torn-paper edge rather than the smooth horizon used
          elsewhere on the page — jagged, uneven facets instead of curves,
          so this section reads as its own distinct moment. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 w-full text-background sm:h-12"
      >
        <path
          d="M0,0 L0,18 L52,9 L104,22 L163,6 L221,20 L278,4 L339,17 L402,3 L461,19 L523,8 L588,23 L649,5 L712,16 L771,2 L836,21 L899,7 L958,18 L1021,4 L1083,20 L1144,9 L1206,22 L1269,6 L1332,19 L1393,3 L1440,15 L1440,0 Z"
          fill="currentColor"
        />
      </svg>

      {/* Bottom edge: same torn-paper language, independent jitter so it
          doesn't mirror the top and read as a stamped duplicate. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 w-full text-background sm:h-12"
      >
        <path
          d="M0,48 L0,30 L58,39 L119,26 L176,42 L233,28 L296,44 L358,29 L419,43 L479,27 L541,41 L602,25 L664,40 L727,26 L788,44 L848,30 L912,42 L974,27 L1037,41 L1099,25 L1161,40 L1223,28 L1286,43 L1349,29 L1440,38 L1440,48 Z"
          fill="currentColor"
        />
      </svg>

      <Fireflies />
      <Container className="relative">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-135">
              <Eyebrow>FROM SCHOLARS AND COORDINATORS</Eyebrow>
              <h2 className="mt-2 font-serif text-[2.4rem] font-medium leading-[1.18] text-navy">
                Trusted by the people it serves.
              </h2>
            </div>
            <div className="md:text-right">
              <span className="mb-1 block text-lg tracking-[2px] text-amber">★★★★★</span>
              <span className="text-[0.92rem] text-muted-foreground">4.9 average from 120+ active scholars</span>
            </div>
          </div>
        </Reveal>

        <div className="overflow-hidden" style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}>
          <div className="flex w-max gap-5 px-6 [animation:vs-reviews-marquee_36s_linear_infinite] hover:[animation-play-state:paused] md:px-8">
            {MARQUEE_REVIEWS.map((r) => (
              <div
                key={`${r.name}-${r.copy}`}
                className="h-full w-85 shrink-0 rounded-[18px] border border-white/60 bg-white/60 p-7 shadow-va-sm backdrop-blur-md transition-shadow duration-300 hover:shadow-va-md"
              >
                <span className="mb-3.5 block text-[1.6rem] text-amber">““</span>
                <p className="mb-6 text-[0.96rem] leading-[1.7] text-foreground">{r.quote}</p>
                <div className="mb-4 h-px bg-line" />
                <p className="mb-0.5 text-[0.96rem] font-bold text-navy">{r.name}</p>
                <p className="text-[0.84rem] text-muted-foreground">{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
      <style>{`@keyframes vs-reviews-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
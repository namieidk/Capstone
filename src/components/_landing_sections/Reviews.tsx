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
      <Fireflies />
      <Container>
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
              <div key={`${r.name}-${r.copy}`} className="h-full w-85 shrink-0 rounded-[18px] border border-line bg-card p-7 shadow-va-sm transition-shadow duration-300 hover:shadow-va-md">
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
import Image from "next/image";
import { Fireflies } from "./Fireflies";
import { Container, Eyebrow, Reveal, SectionHeading } from "./shared";

interface Requirement {
  image: string;
  title: string;
  text: string;
}

const REQUIREMENTS: Requirement[] = [
  {
    image: "/valid.jpg",
    title: "Valid government ID",
    text: "A clear photo or scan of any current government-issued ID belonging to the applicant.",
  },
  {
    image: "/birth.jpg",
    title: "Proof of relationship",
    text: "Birth certificate or affidavit linking the applicant to the endorsing employee.",
  },
  {
    image: "/form.jpg",
    title: "Latest grade report",
    text: "Official transcript or report card from the most recent completed semester.",
  },
];

// clipPathUnits="objectBoundingBox" keeps every coordinate in the 0–1
// range relative to the element's own box, so the wave stays proportional
// at any card width instead of being defined in fixed pixels that would
// distort on resize. Two variants, alternated by index, so the row doesn't
// read as three stamped copies of the same shape:
//   - "dip"  bottom edge bulges DOWN into the text area (more photo shown)
//   - "arc"  bottom edge arches UP into the photo (more card color shows
//            through at the sides, like a scalloped cut)
function RequirementWaveDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <clipPath id="req-wave-dip" clipPathUnits="objectBoundingBox">
          <path d="M0,0 H1 V0.8 C0.75,0.8 0.75,1 0.5,1 C0.25,1 0.25,0.8 0,0.8 Z" />
        </clipPath>
        <clipPath id="req-wave-arc" clipPathUnits="objectBoundingBox">
          <path d="M0,0 H1 V0.95 C0.75,0.95 0.75,0.75 0.5,0.75 C0.25,0.75 0.25,0.95 0,0.95 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function Requirements() {
  return (
    <section id="requirements" className="relative overflow-hidden bg-background py-19">
      <Fireflies />
      {/* Rendered once, referenced by every card via url(#req-wave-...) */}
      <RequirementWaveDefs />
      <Container>
        <Reveal>
          <div className="text-center">
            <div className="flex justify-center">
              <Eyebrow>WHAT TO PREPARE</Eyebrow>
            </div>
            <SectionHeading className="text-center">Application requirements</SectionHeading>
            <p className="mx-auto mb-11 max-w-140 text-center text-[0.7rem] leading-[1.75] text-muted-foreground">
              Upload clear scans or photographs of each item below directly into your ViaScholar dashboard.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REQUIREMENTS.map((r, i) => {
            const clipId = i % 2 === 0 ? "req-wave-dip" : "req-wave-arc";
            return (
              <Reveal key={r.title} delay={i * 100}>
                {/* No `group`, no hover lift/shadow, no image zoom — these
                    are informational cards with nothing to click, so the
                    old hover:-translate-y / hover:shadow / group-hover
                    scale were affordances promising an interaction that
                    doesn't exist. Left as a plain static card instead. */}
                <div className="h-full overflow-hidden rounded-[20px] border border-line bg-card shadow-va-sm">
                  <div
                    className="relative h-40 overflow-hidden"
                    style={{ clipPath: `url(#${clipId})` }}
                  >
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="px-6 pt-3 pb-6">
                    <h3 className="mb-2 text-lg font-bold text-navy">{r.title}</h3>
                    <p className="text-sm leading-[1.6] text-muted-foreground">{r.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
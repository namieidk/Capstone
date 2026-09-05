import { Check } from "lucide-react";
import { Container, Eyebrow, SectionHeading } from "./shared";

const QUALIFICATIONS: string[] = [
  "Filipino citizen residing in or studying within Davao City",
  "Immediate relative of an employee of a partner private company (or endorsed applicant)",
  "Incoming or current college student enrolled in an accredited HEI",
  "Maintain a minimum 90% General Weighted Average (GWA) every semester",
  "No failing grades, incomplete marks, or dropped subjects",
];

export function Qualifications() {
  return (
    <section id="qualifications" className="bg-tint py-17.5">
      <Container className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Eyebrow>WHO CAN APPLY</Eyebrow>
          <SectionHeading>Qualifications</SectionHeading>
          <p className="max-w-110 text-[1.02rem] leading-[1.75] text-muted-foreground">
            We look for students with consistent academic discipline and a clear commitment to finishing their degree.
            Meeting every item below makes you eligible for review.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {QUALIFICATIONS.map((q) => (
            <div
              key={q}
              className="flex items-center gap-4 rounded-[14px] border border-line/60 bg-card px-6 py-5 shadow-va-sm"
            >
              <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span className="text-[0.98rem] leading-[1.4] text-foreground">{q}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

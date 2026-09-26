import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Container, Eyebrow, Reveal, SectionHeading } from "./shared";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Who is eligible to apply for a ViaScholar grant?",
    a: "Applicants must be Filipino citizens studying in Davao City, immediate relatives of an employee of a partner private company (or formally endorsed by one), and currently enrolled in an accredited college or university with at least a 90% General Weighted Average.",
  },
  {
    q: "When is the application deadline?",
    a: "Applications for the current academic year close on August 15. Late submissions are only accepted on a case-by-case basis for returning scholars.",
  },
  {
    q: "How are scholarship slots assigned to applicants?",
    a: "Coordinators review each applicant's eligibility, academic standing, and document verification status through ViaScholar's descriptive analytics dashboard, which summarizes this data alongside available slot capacity to support a fair, well-informed decision.",
  },
  {
    q: "What documents do I need to upload?",
    a: "You'll need a valid government ID, proof of relationship, your latest grade report, an income statement, a letter of intent, and a certificate of enrollment.",
  },
  {
    q: "How long does the evaluation take?",
    a: "Most applications are reviewed within 2 to 3 weeks of submission, provided all required documents pass the initial OCR verification.",
  },
  {
    q: "What happens if my grades fall below 90%?",
    a: "Coordinators review each scholar's submitted grade report every semester and reach out as soon as a report falls below the threshold, giving the scholar a chance to recover before the next disbursement.",
  },
  {
    q: "Can I apply if I'm already receiving another scholarship?",
    a: "Yes, as long as the combined support does not exceed your total cost of education and is disclosed during application.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative overflow-hidden bg-background py-19 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Left: heading stays in view while the list scrolls */}
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <Eyebrow>FAQ</Eyebrow>
              <SectionHeading className="text-left">Frequently Asked Questions</SectionHeading>
              <p className="mt-4 max-w-sm text-[1rem] leading-relaxed text-muted-foreground">
                Eligibility, deadlines, and documents — quick answers to what students ask most before applying.
              </p>
            </div>
          </Reveal>

          {/* Right: clean divider list */}
          <Reveal>
            <AccordionPrimitive.Root type="single" collapsible defaultValue="0" className="border-t border-navy/15">
              {FAQS.map((item, i) => (
                <AccordionPrimitive.Item key={item.q} value={String(i)} className="group/item border-b border-navy/15">
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="group flex w-full items-center gap-4 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                      <span className="w-7 shrink-0 text-[0.78rem] font-semibold tracking-widest text-muted-foreground/70 transition-colors duration-300 group-data-[state=open]:text-amber">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[1.02rem] font-semibold leading-snug text-navy md:text-[1.08rem]">
                        {item.q}
                      </span>
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-navy/15 text-navy transition-all duration-300 group-hover:border-navy/40 group-data-[state=open]:border-navy group-data-[state=open]:bg-navy group-data-[state=open]:text-white">
                        <ChevronDown
                          className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-180"
                          strokeWidth={2.25}
                        />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>

                  <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-[accordion-up_0.25s_ease-out] data-[state=open]:animate-[accordion-down_0.25s_ease-out]">
                    <p className="max-w-xl pb-7 pl-11 text-[0.95rem] leading-[1.75] text-muted-foreground">{item.a}</p>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

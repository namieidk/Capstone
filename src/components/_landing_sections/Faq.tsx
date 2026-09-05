import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Eyebrow, SectionHeading } from "./shared";

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
    <section id="faq" className="py-19">
      <Container>
        <Eyebrow>FREQUENTLY ASKED QUESTIONS</Eyebrow>
        <SectionHeading>Eligibility, deadlines, and documents</SectionHeading>
        <p className="mb-10 max-w-140 text-[1.05rem] text-muted-foreground">
          Quick answers to the questions students ask most before applying to ViaScholar.
        </p>

        <Accordion type="single" collapsible defaultValue="0">
          {FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={String(i)}>
              <AccordionTrigger className="px-8 py-7 text-[1.125rem] font-bold text-navy hover:decoration-transparent">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-7">
                <div className="max-w-190 text-[0.98rem] leading-[1.7] text-muted-foreground">{item.a}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}

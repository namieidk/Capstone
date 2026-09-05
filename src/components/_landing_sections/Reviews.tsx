import { Container, Eyebrow } from "./shared";

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

export function Reviews() {
  return (
    <section id="reviews" className="bg-navy py-19">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-135">
            <Eyebrow>FROM SCHOLARS AND COORDINATORS</Eyebrow>
            <h2 className="mt-4 text-[2.4rem] font-bold leading-[1.18] text-white">Trusted by the people it serves.</h2>
          </div>
          <div className="md:text-right">
            <span className="mb-1 block text-lg tracking-[2px] text-amber">★★★★★</span>
            <span className="text-[0.92rem] text-white/60">4.9 average from 120+ active scholars</span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-[18px] border border-white/10 bg-white/5 p-7">
              <span className="mb-3.5 block text-[1.6rem] text-amber">““</span>
              <p className="mb-6 text-[0.96rem] leading-[1.7] text-[#e6e6e2]">{r.quote}</p>
              <div className="mb-4 h-px bg-white/10" />
              <p className="mb-0.5 text-[0.96rem] font-bold text-white">{r.name}</p>
              <p className="text-[0.84rem] text-white/40">{r.role}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

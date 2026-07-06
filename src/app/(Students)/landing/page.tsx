"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import {
  GlobalStyles,
  Field,
  BuildingIcon,
  MatchIcon,
  ShieldIcon,
  CheckIcon,
  IdIcon,
  PersonCheckIcon,
  DocIcon,
  ReceiptIcon,
  LetterIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  ClockIcon,
  s,
} from "../../../components/landingpage";

function Nav() {
  const links = ["About", "Qualifications", "Requirements", "Reviews", "FAQ", "Contact"];
  return (
    <header style={s.navHeader}>
      <div className="vs-container" style={s.navInner}>
        <a href="#top" style={s.navLogo}>
          <span style={{ ...s.navLogoMark, overflow: "hidden", background: "#F8F4EA" }}>
            <img
              src="/logo.png"
              alt="ViaScholar logo"
              style={{
                width: "120%",
                height: "120%",
                objectFit: "contain",
                display: "block",
                transform: "scale(2.8)",
              }}
            />
          </span>
          ViaScholar
        </a>
        <nav className="vs-nav-links" style={s.navLinks}>
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="vs-btn-nav" style={s.navLink}>
              {l}
            </a>
          ))}
        </nav>
        <div style={s.navButtons}>
          <Link href="/login" className="vs-btn-primary" style={s.applyBtn}>
            Apply now
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" style={s.heroSection}>
      <div className="vs-container vs-hero-grid" style={{ ...s.heroGrid, alignItems: "center" }}>
        <div>
          <span style={s.badge}>✦ CRDC PRIVATE SCHOLARSHIP PROGRAM</span>
          <h1 className="vs-headline" style={s.headline}>
            Funding deserving
            <br />
            minds. <em style={s.headlineAccent}>Tracked</em> with  clarity.
            <br />
           
          </h1>
          <p style={s.heroSub}>
            ViaScholar is the private scholarship management system built for
            Cawayan River Development Corporation (CRDC). Descriptive
            analytics dashboards summarize every applicants eligibility and
            every scholars academic standing in real time, giving
            coordinators clear, evidence-based context for every decision —
            then keep each grantees records, contracts, and disbursements
            on one dashboard through graduation.
          </p>
          <div style={s.heroActions}>
            <Link href="/apply" className="vs-btn-primary" style={s.primaryBtn}>
              Start your application →
            </Link>
            <a href="#qualifications" className="vs-btn-secondary" style={s.secondaryBtn}>
              See qualifications
            </a>
          </div>
        </div>

        <DashboardCard />
      </div>

      <div className="vs-container">
        <div className="vs-stat-row" style={s.statRow}>
          <Stat number="4 yrs" label="Full tenure support" />
          <Stat number="90%" label="Retention threshold" />
          <Stat number="Real-time" label="Analytics dashboards" />
        </div>
      </div>
    </section>
  );
}

interface StatProps {
  number: string;
  label: string;
}

function Stat({ number, label }: StatProps) {
  return (
    <div>
      <p style={s.statNumber}>{number}</p>
      <p style={s.statLabel}>{label}</p>
    </div>
  );
}

function DashboardCard() {
  return (
    <div style={{ ...s.dashCard, padding: 0, overflow: "hidden", minHeight: 420, width: "100%" }}>
      <img
        src="/landing.jpg"
        alt="ViaScholar dashboard preview"
        style={{
          width: "100%",
          height: "100%",
          minHeight: 420,
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

interface AboutFeature {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const ABOUT_FEATURES: AboutFeature[] = [
  {
    icon: <BuildingIcon />,
    title: "Built for CRDC's scholarship program",
    text: "ViaScholar was developed specifically for Cawayan River Development Corporation (CRDC) to administer its private scholarship grant for the relatives of partner-company employees, replacing manual, spreadsheet-based tracking.",
  },
  {
    icon: <MatchIcon />,
    title: "Data-driven insight, not guesswork",
    text: "Descriptive analytics dashboards summarize applicant eligibility, academic standing, and program trends in real time, giving coordinators clear, evidence-based context to support every decision.",
  },
  {
    icon: <ShieldIcon />,
    title: "Auditable workflow",
    text: "Submissions, HR verification, contract signing, and check disbursements live in one secure portal — no more lost Messenger threads or unstructured email attachments.",
  },
];

function About() {
  return (
    <section id="about" style={s.aboutSection}>
      <div className="vs-container vs-grid-2" style={s.aboutGrid}>
        <div>
          <span className="vs-eyebrow">ABOUT VIASCHOLAR</span>
          <h2 style={s.sectionHeading}>A grant program that stays organized and easy to audit.</h2>
          <p style={s.aboutParagraph}>
            Private scholarships traditionally rely on manual shortlisting —
            slow, hard to audit, and easy to second-guess. ViaScholar
            replaces that process with real-time descriptive analytics and a
            single system of record, so coordinators and providers can trust
            every decision and every update.
          </p>
        </div>

        <div style={s.featureStack}>
          {ABOUT_FEATURES.map((f) => (
            <div key={f.title} className="vs-card-hover" style={s.featureCard}>
              <div style={s.featureIconBox}>{f.icon}</div>
              <div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureText}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const QUALIFICATIONS: string[] = [
  "Filipino citizen residing in or studying within Davao City",
  "Immediate relative of an employee of a partner private company (or endorsed applicant)",
  "Incoming or current college student enrolled in an accredited HEI",
  "Maintain a minimum 90% General Weighted Average (GWA) every semester",
  "No failing grades, incomplete marks, or dropped subjects",
];

function Qualifications() {
  return (
    <section id="qualifications" style={s.qualSection}>
      <div className="vs-container vs-grid-2" style={s.qualGrid}>
        <div>
          <span className="vs-eyebrow">WHO CAN APPLY</span>
          <h2 style={s.sectionHeading}>Qualifications</h2>
          <p style={s.qualParagraph}>
            We look for students with consistent academic discipline and a
            clear commitment to finishing their degree. Meeting every item
            below makes you eligible for review.
          </p>
        </div>

        <div style={s.checkList}>
          {QUALIFICATIONS.map((q) => (
            <div key={q} className="vs-card-hover" style={s.checkRow}>
              <span style={s.checkCircle}>
                <CheckIcon />
              </span>
              <span style={s.checkText}>{q}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface Requirement {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const REQUIREMENTS: Requirement[] = [
  { icon: <IdIcon />, title: "Valid government ID", text: "A clear photo or scan of any current government-issued ID belonging to the applicant." },
  { icon: <PersonCheckIcon />, title: "Proof of relationship", text: "Birth certificate or affidavit linking the applicant to the endorsing employee." },
  { icon: <DocIcon />, title: "Latest grade report", text: "Official transcript or report card from the most recent completed semester." },
];

function Requirements() {
  return (
    <section id="requirements" style={s.reqSection}>
      <div className="vs-container">
        <span className="vs-eyebrow">WHAT TO PREPARE</span>
        <h2 style={s.sectionHeading}>Application requirements</h2>
        <p style={s.reqParagraph}>
          Upload clear scans or photographs of each item below directly
          into your ViaScholar dashboard. Our OCR-based verification will
          flag missing fields before you submit.
        </p>

        <div className="vs-card-grid-3x2" style={s.reqGrid}>
          {REQUIREMENTS.map((r) => (
            <div key={r.title} className="vs-card-hover" style={s.reqCard}>
              <div style={s.reqIconBox}>{r.icon}</div>
              <h3 style={s.reqCardTitle}>{r.title}</h3>
              <p style={s.reqCardText}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface Review {
  quote: string;
  name: string;
  role: string;
}

const REVIEWS: Review[] = [
  { quote: "Before ViaScholar, I had to message our coordinator on Messenger every term. Now everything — grades, contracts, even the check schedule — is just there. It feels professional.", name: "Mariella S.", role: "BS Accountancy, 4th year" },
  { quote: "The dashboard's analytics give us a clear picture of every applicant's eligibility and academic standing at a glance. What used to take weeks of manual review now takes minutes, and every decision is backed by clear data.", name: "Engr. Paolo R.", role: "HR Coordinator, partner company" },
  { quote: "Uploading documents used to feel risky over email. The OCR check told me my ITR was unreadable before I submitted — saved me from disqualification.", name: "Jonas L.", role: "BS Computer Science, 2nd year" },
];

function Reviews() {
  return (
    <section id="reviews" style={s.reviewSection}>
      <div className="vs-container">
        <div style={s.reviewHeaderRow}>
          <div>
            <span style={s.eyebrowDark}>FROM SCHOLARS AND COORDINATORS</span>
            <h2 style={s.reviewHeading}>Trusted by the people it serves.</h2>
          </div>
          <div style={s.ratingBlock}>
            <span style={s.stars}>★★★★★</span>
            <span style={s.ratingText}>4.9 average from 120+ active scholars</span>
          </div>
        </div>

        <div className="vs-card-3" style={s.reviewGrid}>
          {REVIEWS.map((r) => (
            <div key={r.name} className="vs-card-hover" style={s.reviewCard}>
              <span style={s.quoteIcon}>&#8220;&#8220;</span>
              <p style={s.reviewQuote}>{r.quote}</p>
              <div style={s.reviewDivider} />
              <p style={s.reviewName}>{r.name}</p>
              <p style={s.reviewRole}>{r.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  { q: "Who is eligible to apply for a ViaScholar grant?", a: "Applicants must be Filipino citizens studying in Davao City, immediate relatives of an employee of a partner private company (or formally endorsed by one), and currently enrolled in an accredited college or university with at least a 90% General Weighted Average." },
  { q: "When is the application deadline?", a: "Applications for the current academic year close on August 15. Late submissions are only accepted on a case-by-case basis for returning scholars." },
  { q: "How are scholarship slots assigned to applicants?", a: "Coordinators review each applicant's eligibility, academic standing, and document verification status through ViaScholar's descriptive analytics dashboard, which summarizes this data alongside available slot capacity to support a fair, well-informed decision." },
  { q: "What documents do I need to upload?", a: "You'll need a valid government ID, proof of relationship, your latest grade report, an income statement, a letter of intent, and a certificate of enrollment." },
  { q: "How long does the evaluation take?", a: "Most applications are reviewed within 2 to 3 weeks of submission, provided all required documents pass the initial OCR verification." },
  { q: "What happens if my grades fall below 90%?", a: "Coordinators review each scholar's submitted grade report every semester and reach out as soon as a report falls below the threshold, giving the scholar a chance to recover before the next disbursement." },
  { q: "Can I apply if I'm already receiving another scholarship?", a: "Yes, as long as the combined support does not exceed your total cost of education and is disclosed during application." },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" style={s.faqSection}>
      <div className="vs-container">
        <span className="vs-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
        <h2 style={s.sectionHeading}>Eligibility, deadlines, and documents</h2>
        <p style={s.faqSubtext}>Quick answers to the questions students ask most before applying to ViaScholar.</p>

        <div style={s.faqList}>
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="vs-faq-row" style={{ ...s.faqItem, borderBottom: i === FAQS.length - 1 ? "none" : "1px solid #E4DCC8" }}>
                <button onClick={() => setOpenIndex(isOpen ? -1 : i)} style={s.faqQuestionRow} aria-expanded={isOpen}>
                  <span style={s.faqQuestion}>{item.q}</span>
                  <span style={s.faqToggle}>{isOpen ? "\u00D7" : "+"}</span>
                </button>
                {isOpen && <p style={s.faqAnswer}>{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="apply" style={s.finalSection}>
      <div className="vs-container">
        <div className="vs-final-cta-inner" style={s.finalCard}>
          <div>
            <span style={s.eyebrowOnTan}>READY WHEN YOU ARE</span>
            <h2 style={s.finalHeading}>Apply for a ViaScholar grant today.</h2>
          </div>
          <div style={s.finalActionCol}>
            <Link href="/apply" className="vs-btn-primary" style={s.finalBtn}>
              Start application →
            </Link>
            <Link href="/login" style={s.finalLink}>
              Or sign up for an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" style={s.contactSection}>
      <div className="vs-container vs-grid-2" style={s.contactGrid}>
        <div>
          <span className="vs-eyebrow">GET IN TOUCH</span>
          <h2 style={s.sectionHeading}>Still have questions?</h2>
          <p style={s.contactParagraph}>
            Our coordinators are based in Davao City and usually respond
            within one business day. Reach out however is easiest for you.
          </p>

          <div style={s.contactInfoList}>
            <ContactInfoRow icon={<MailIcon />} label="Email" value="gdacaac.plf@gmail.com" />
            <ContactInfoRow icon={<PhoneIcon />} label="Phone" value="(082) 555 0142" />
            <ContactInfoRow icon={<PinIcon />} label="Office" value="2F Matina Pavilion Bldg, Davao City" />
            <ContactInfoRow icon={<ClockIcon />} label="Hours" value="Mon – Fri, 9:00 AM – 5:00 PM" />
          </div>
        </div>

        <ContactFormCard />
      </div>
    </section>
  );
}

interface ContactInfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ContactInfoRow({ icon, label, value }: ContactInfoRowProps) {
  return (
    <div style={s.contactInfoRow}>
      <span style={s.contactIconBox}>{icon}</span>
      <div>
        <p style={s.contactInfoLabel}>{label}</p>
        <p style={s.contactInfoValue}>{value}</p>
      </div>
    </div>
  );
}

function ContactFormCard() {
  const [sent, setSent] = useState(false);
  return (
    <div style={s.contactFormCard}>
      <h3 style={s.contactFormTitle}>Send us a message</h3>
      <p style={s.contactFormSub}>We will get back to you by email.</p>

      {sent ? (
        <div style={s.contactSentBanner}>Thanks — your message has been sent.</div>
      ) : (
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setSent(true);
          }}
          style={s.contactForm}
        >
          <Field label="Your name" required>
            <input type="text" style={s.input} required />
          </Field>
          <Field label="Email" required>
            <input type="email" style={s.input} required />
          </Field>
          <Field label="Message" required>
            <textarea style={{ ...s.input, height: 110, resize: "vertical" }} required />
          </Field>
          <button type="submit" className="vs-btn-primary" style={s.contactSubmitBtn}>
            Send message
          </button>
        </form>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer style={s.footer}>
      <div className="vs-container" style={s.footerInner}>
        <p style={s.footerText}>© 2026 ViaScholar. All rights reserved.</p>
        <p style={s.footerText}>gdacaac.plf@gmail.com · (082) 555 0142 · Davao City</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="vs">
      <GlobalStyles />
      <Nav />
      <main>
        <Hero />
        <About />
        <Qualifications />
        <Requirements />
        <Reviews />
        <FAQ />
        <FinalCTA />
      </main>
      <Contact />
      <Footer />
    </div>
  );
}
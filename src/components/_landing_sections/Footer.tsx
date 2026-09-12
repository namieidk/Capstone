import { Container } from "./shared";

const EXPLORE_LINKS = ["About", "Qualifications", "Requirements", "Reviews", "FAQ", "Contact"];

export function Footer() {
  return (
    <footer className="relative bg-navy pt-16 pb-7">
      <div className="pointer-events-none absolute inset-x-0 -top-16 h-16 bg-gradient-to-b from-transparent to-navy" />
      <Container>
        <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <span className="font-serif text-[1.3rem] font-medium text-white">ViaScholar</span>
            <p className="mt-3 max-w-80 text-[0.92rem] leading-[1.7] text-white/60">
              A web-based scholarship management system built for CRDC&apos;s private grant program — from application to disbursement, all in one place.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-serif text-lg font-medium text-white">Explore</h4>
            <ul className="flex flex-col gap-3">
              {EXPLORE_LINKS.map((link) => <li key={link}><a href={`#${link.toLowerCase()}`} className="text-[0.92rem] text-white/60 hover:text-amber">{link}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-serif text-lg font-medium text-white">Contact</h4>
            <ul className="flex flex-col gap-3 text-[0.92rem] text-white/60"><li>gdacaac.plf@gmail.com</li><li>(082) 555 0142</li><li>2F Matina Pavilion Bldg, Davao City</li></ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10 pt-6">
          <p className="text-[0.85rem] text-white/50">© 2026 ViaScholar. All rights reserved.</p>
          <p className="text-[0.85rem] text-white/50">CRDC Private Scholarship Program</p>
        </div>
      </Container>
    </footer>
  );
}
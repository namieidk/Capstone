import { Container } from "./shared";

export function Footer() {
  return (
    <footer className="border-t border-line py-6.5">
      <Container className="flex flex-wrap justify-between gap-2.5">
        <p className="text-[0.85rem] text-muted-foreground">© 2026 ViaScholar. All rights reserved.</p>
        <p className="text-[0.85rem] text-muted-foreground">gdacaac.plf@gmail.com · (082) 555 0142 · Davao City</p>
      </Container>
    </footer>
  );
}

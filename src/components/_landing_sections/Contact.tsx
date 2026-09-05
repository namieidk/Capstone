"use client";

import type { LucideIcon } from "lucide-react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Container, Eyebrow, SectionHeading } from "./shared";

interface ContactInfoRowProps {
  Icon: LucideIcon;
  label: string;
  value: string;
}

const CONTACT_INFO: ContactInfoRowProps[] = [
  { Icon: Mail, label: "Email", value: "gdacaac.plf@gmail.com" },
  { Icon: Phone, label: "Phone", value: "(082) 555 0142" },
  {
    Icon: MapPin,
    label: "Office",
    value: "2F Matina Pavilion Bldg, Davao City",
  },
  { Icon: Clock, label: "Hours", value: "Mon – Fri, 9:00 AM – 5:00 PM" },
];

export function ContactFormCard() {
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-[20px] border border-line bg-card p-8 shadow-va-sm">
      <h3 className="text-[1.4rem] font-bold text-navy">Send us a message</h3>
      <p className="mt-1 mb-6 text-[0.92rem] text-muted-foreground">We will get back to you by email.</p>

      {sent ? (
        <div className="rounded-xl bg-good-bg px-5 py-4 text-[0.95rem] font-semibold text-good">
          Thanks — your message has been sent.
        </div>
      ) : (
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setSent(true);
          }}
          className="grid gap-5"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="contact-name" className="text-[0.94rem] text-navy">
              Your name <span className="text-bad">*</span>
            </Label>
            <Input id="contact-name" name="name" type="text" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="contact-email" className="text-[0.94rem] text-navy">
              Email <span className="text-bad">*</span>
            </Label>
            <Input id="contact-email" name="email" type="email" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="contact-message" className="text-[0.94rem] text-navy">
              Message <span className="text-bad">*</span>
            </Label>
            <Textarea id="contact-message" name="message" className="min-h-28" required />
          </div>
          <Button type="submit" className="mt-1 h-10 w-fit self-start rounded-full px-6 text-[0.94rem] font-semibold">
            Send message
          </Button>
        </form>
      )}
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" className="border-t border-line bg-tint py-19">
      <Container className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow>GET IN TOUCH</Eyebrow>
          <SectionHeading>Still have questions?</SectionHeading>
          <p className="mb-8 max-w-110 text-[1.02rem] leading-[1.75] text-muted-foreground">
            Our coordinators are based in Davao City and usually respond within one business day. Reach out however is
            easiest for you.
          </p>

          <div className="flex flex-col gap-4.5">
            {CONTACT_INFO.map((c) => (
              <div key={c.label} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-navy text-white">
                  <c.Icon className="size-4" />
                </span>
                <div>
                  <p className="mb-0.5 text-[0.78rem] text-muted-foreground">{c.label}</p>
                  <p className="text-[0.98rem] font-semibold text-navy">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContactFormCard />
      </Container>
    </section>
  );
}

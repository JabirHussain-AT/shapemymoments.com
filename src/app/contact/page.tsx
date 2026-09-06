import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ShapeMyMoments for custom event planning, photographer bookings and partnerships.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  return (
    <div className="section-padding pt-10">
      <div className="container-page">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Contact
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Let&apos;s talk about your celebration
          </h1>
          <p className="mt-3 text-muted-foreground">
            Prefer a conversation first? Reach out — or jump straight into{" "}
            <a href="/plan-event" className="font-medium text-primary underline">
              Plan My Event
            </a>
            .
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { getWhatsAppUrl } from "@/lib/utils";
import { DEMO_FAQS } from "@/lib/demo-data";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.length < 2) errs.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (form.message.length < 10) errs.message = "Please write a longer message";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Message sent. We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
      <form
        onSubmit={submit}
        className="rounded-2xl border border-border bg-white p-6 premium-shadow sm:p-8"
      >
        <h2 className="text-xl font-bold">Send a message</h2>
        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <FieldError>{errors.name}</FieldError>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <FieldError>{errors.email}</FieldError>
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <FieldError>{errors.message}</FieldError>
          </div>
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Sending…" : "Send Message"}
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-xl font-bold">Reach us directly</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-primary" />
              <a href="mailto:hello@shapemymoment.com" className="hover:underline">
                hello@shapemymoment.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-primary" />
              <a href="tel:+918089909386" className="hover:underline">
                +91 80899 09386
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              Kalpetta, Wayanad, Kerala
            </li>
          </ul>
          <a
            href={getWhatsAppUrl("Hi! I'd like to talk about an event.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex"
          >
            <Button variant="secondary">
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </Button>
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-xl font-bold">FAQ</h2>
          <div className="mt-4 space-y-4">
            {DEMO_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-border p-4"
              >
                <summary className="cursor-pointer list-none font-semibold marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

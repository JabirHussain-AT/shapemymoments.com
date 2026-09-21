"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/input";
import { ConfettiBurst } from "@/components/animations/motion";
import { EVENT_SERVICES, CONTACT_METHODS } from "@/types";
import { formatCurrency } from "@/lib/utils";

const EVENT_OPTIONS = [
  "Birthday",
  "Wedding",
  "Engagement",
  "Anniversary",
  "Baby Shower",
  "Corporate",
  "Proposal",
  "Surprise",
  "Other",
] as const;

const STEPS = [
  "Celebration",
  "Details",
  "Services",
  "Vision",
  "Contact",
  "Review",
];

type FormState = {
  eventType: string;
  eventDate: string;
  location: string;
  expectedGuests: string;
  budget: string;
  duration: string;
  services: string[];
  vision: string;
  theme: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredContact: string;
};

const initial: FormState = {
  eventType: "",
  eventDate: "",
  location: "",
  expectedGuests: "",
  budget: "",
  duration: "4 hours",
  services: [],
  vision: "",
  theme: "",
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  preferredContact: "WhatsApp",
};

export function PlanEventWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confetti, setConfetti] = useState(false);
  const [form, setForm] = useState<FormState>(() => ({
    ...initial,
    eventType: params.get("type") || "",
    theme: params.get("package") || "",
  }));

  const progress = ((step + 1) / STEPS.length) * 100;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
    setErrors((prev) => ({ ...prev, services: "" }));
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !form.eventType) e.eventType = "Please select an event type";
    if (step === 1) {
      if (!form.eventDate) e.eventDate = "Date is required";
      if (!form.location || form.location.length < 2) e.location = "Location is required";
      if (!form.expectedGuests || Number(form.expectedGuests) < 1)
        e.expectedGuests = "Enter guest count";
      if (!form.duration) e.duration = "Duration is required";
    }
    if (step === 2 && form.services.length === 0)
      e.services = "Select at least one service";
    if (step === 3 && form.vision.trim().length < 10)
      e.vision = "Tell us a bit more about your vision (10+ characters)";
    if (step === 4) {
      if (form.name.trim().length < 2) e.name = "Name is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
      if (form.phone.length < 10) e.phone = "Valid phone required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/event-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: form.eventType === "Surprise" ? "Surprise" : form.eventType,
          eventDate: form.eventDate,
          location: form.location,
          expectedGuests: Number(form.expectedGuests),
          budget: form.budget ? Number(form.budget) : 0,
          duration: form.duration,
          services: form.services,
          vision: form.vision,
          theme: form.theme || undefined,
          name: form.name,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp || form.phone,
          preferredContact: form.preferredContact,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Submission failed");
      }
      if (!reduce) {
        setConfetti(true);
      }
      toast.success("Event request submitted successfully.");
      router.push(`/plan-event/success?id=${json.data.requestId}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const summary = useMemo(
    () => [
      ["Celebration", form.eventType],
      ["Date", form.eventDate],
      ["Location", form.location],
      ["Guests", form.expectedGuests],
      ["Budget", form.budget ? formatCurrency(Number(form.budget)) : "Custom / Flexible Quote"],
      ["Duration", form.duration],
      ["Services", form.services.join(", ")],
      ["Theme", form.theme || "—"],
      ["Contact", `${form.name} · ${form.email} · ${form.phone}`],
      ["Preferred", form.preferredContact],
    ],
    [form]
  );

  return (
    <div className="mx-auto max-w-3xl">
      <ConfettiBurst trigger={confetti} />

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="font-semibold text-primary">{STEPS[step]}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
        <div className="mt-3 hidden gap-1 sm:flex">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex-1 rounded-full px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wide ${
                i <= step ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 premium-shadow sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold">What are you celebrating?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose the occasion — we&apos;ll tailor everything around it.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {EVENT_OPTIONS.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("eventType", type)}
                      className={`rounded-xl border px-4 py-4 text-left text-sm font-semibold transition ${
                        form.eventType === type
                          ? "border-primary bg-secondary text-primary"
                          : "border-border bg-card hover:border-primary/40 text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <FieldError>{errors.eventType}</FieldError>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Tell us about your event</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="eventDate">Event date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => update("eventDate", e.target.value)}
                    />
                    <FieldError>{errors.eventDate}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Kalpetta"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                    />
                    <FieldError>{errors.location}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="guests">Expected guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min={1}
                      placeholder="30"
                      value={form.expectedGuests}
                      onChange={(e) => update("expectedGuests", e.target.value)}
                    />
                    <FieldError>{errors.expectedGuests}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="budget">Estimated Budget (₹) (Optional / Custom)</Label>
                    <Input
                      id="budget"
                      type="number"
                      min={0}
                      placeholder="Custom amount or leave blank"
                      value={form.budget}
                      onChange={(e) => update("budget", e.target.value)}
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground font-semibold">
                      ✨ No fixed budget required — we design custom offer packages!
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="duration">Event duration</Label>
                    <Select
                      id="duration"
                      value={form.duration}
                      onChange={(e) => update("duration", e.target.value)}
                    >
                      <option>2 hours</option>
                      <option>3 hours</option>
                      <option>4 hours</option>
                      <option>6 hours</option>
                      <option>Full day</option>
                      <option>Multi-day</option>
                    </Select>
                    <FieldError>{errors.duration}</FieldError>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold">What would you like us to handle?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select everything you want ShapeMyMoment to arrange.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {EVENT_SERVICES.map((service) => {
                    const active = form.services.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
                          active
                            ? "border-primary bg-secondary text-primary"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            active ? "border-primary bg-primary text-white" : "border-border"
                          }`}
                        >
                          {active && <Check className="h-3 w-3" />}
                        </span>
                        {service}
                      </button>
                    );
                  })}
                </div>
                <FieldError>{errors.services}</FieldError>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Tell us your vision</h2>
                <div>
                  <Label htmlFor="theme">Theme (optional)</Label>
                  <Input
                    id="theme"
                    placeholder="Luxury / Pink / Kids / Minimal / Custom"
                    value={form.theme}
                    onChange={(e) => update("theme", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vision">Tell us what you have in mind</Label>
                  <Textarea
                    id="vision"
                    placeholder="Describe the vibe, must-haves, colours, surprises…"
                    value={form.vision}
                    onChange={(e) => update("vision", e.target.value)}
                    rows={6}
                  />
                  <FieldError>{errors.vision}</FieldError>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Contact information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                    <FieldError>{errors.name}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                    <FieldError>{errors.email}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                    <FieldError>{errors.phone}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      placeholder="Same as phone if empty"
                      value={form.whatsapp}
                      onChange={(e) => update("whatsapp", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferred">Preferred contact method</Label>
                    <Select
                      id="preferred"
                      value={form.preferredContact}
                      onChange={(e) => update("preferredContact", e.target.value)}
                    >
                      {CONTACT_METHODS.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Review & Submit</h2>
                </div>
                <p className="mb-6 text-sm text-muted-foreground">
                  Confirm your request. Our team will craft a customized plan.
                </p>
                <dl className="space-y-3 rounded-xl bg-muted/60 p-4">
                  {summary.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:grid-cols-[140px_1fr]"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="text-sm font-medium">{value || "—"}</dd>
                    </div>
                  ))}
                  <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Vision
                    </dt>
                    <dd className="text-sm leading-relaxed">{form.vision}</dd>
                  </div>
                </dl>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={back}
            disabled={step === 0 || submitting}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next}>
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={submit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>Let ShapeMyMoment Plan It</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

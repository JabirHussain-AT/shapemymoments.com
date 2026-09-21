"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Heart,
  MapPin,
  Star,
  Clock,
  Languages,
  Camera,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/input";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import { EVENT_TYPES } from "@/types";
import type { DemoPhotographer, DemoReview } from "@/lib/data";

function PublicAvailabilityCalendar({ bookedDates = [], name }: { bookedDates?: string[]; name: string }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const isBooked = bookedDates.includes(dateStr);
    return { dayNum, dateStr, isBooked };
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Schedule Availability Calendar ({monthNames[month]} {year})
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Public schedule calendar for {name}. Green dates are open for booking!
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> Available
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" /> Reserved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted-foreground pb-1">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-xs">
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-9 rounded-lg bg-transparent" />
        ))}
        {days.map(({ dayNum, dateStr, isBooked }) => (
          <a
            key={dateStr}
            href={getWhatsAppUrl(`Hi! I'd like to check date booking availability for ${name} on date ${dateStr}.`)}
            target="_blank"
            rel="noopener noreferrer"
            title={isBooked ? `Reserved on ${dateStr}` : `Available on ${dateStr} — Tap to inquire`}
            className={`h-9 flex flex-col items-center justify-center rounded-lg font-bold transition text-xs ${
              isBooked
                ? "bg-rose-500/15 text-rose-600 border border-rose-500/30 cursor-not-allowed opacity-80"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 cursor-pointer"
            }`}
          >
            <span>{dayNum}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function PhotographerProfile({
  photographer: p,
  reviews,
}: {
  photographer: DemoPhotographer;
  reviews: DemoReview[];
}) {
  const [shortlisted, setShortlisted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<{
    eventType: string;
    eventDate: string;
    location: string;
    hoursRequired: string;
    budget: string;
    message: string;
    name: string;
    phone: string;
    email: string;
  }>({
    eventType: p.eventTypes[0] || "Birthday",
    eventDate: "",
    location: "",
    hoursRequired: "4",
    budget: "",
    message: "",
    name: "",
    phone: "",
    email: "",
  });

  const calculatedHourlyRate = p.hourlyRate || Math.round((p.startingPrice || 10000) / 4);

  const defaultIncludes = p.includes || [
    "High-resolution edited digital photos & files",
    "Professional lighting & camera equipment",
    "Color correction & artistic retouching",
    "Full digital cloud album link",
    "Pre-event consultation & timeline planning",
  ];

  const defaultExcludes = p.excludes || [
    "Travel & outstation accommodation beyond 100km radius",
    "Printed physical photo albums (available as add-on)",
    "Additional overtime hours beyond agreed booking schedule",
  ];

  const defaultGuarantees = p.guarantees || [
    "ShapeMyMoment 100% On-Time Service Delivery Guarantee",
    "Direct Concierge Booking & Price Protection (Zero hidden fees)",
    "Verified Partner Checkmark & Quality Audit",
    "Secure Payment Escrow Protection",
  ];

  const shortlist = () => {
    setShortlisted((v) => !v);
    toast.success(
      shortlisted ? "Removed from shortlist." : "Photographer added to shortlist."
    );
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.eventDate) errs.eventDate = "Required";
    if (form.location.length < 2) errs.location = "Required";
    if (form.message.length < 10) errs.message = "Please add more detail";
    if (form.name.length < 2) errs.name = "Required";
    if (form.phone.length < 10) errs.phone = "Valid phone required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/photographers/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photographerId: p.id,
          ...form,
          hoursRequired: Number(form.hoursRequired),
          budget: form.budget ? Number(form.budget) : undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Request sent successfully.");
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="relative h-52 w-full sm:h-72 lg:h-80">
        <Image
          src={p.coverImage || p.profilePhoto}
          alt={`${p.name} cover`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="container-page relative -mt-16 pb-16 sm:-mt-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="rounded-2xl border border-border bg-card p-5 premium-shadow sm:p-8 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-card shadow-md sm:h-32 sm:w-32">
                  <Image
                    src={p.profilePhoto}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold sm:text-3xl">{p.name}</h1>
                    {p.verified && (
                      <Badge variant="success" className="gap-1">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </Badge>
                    )}
                    {p.featured && <Badge variant="gold">Featured</Badge>}
                    {p.subscriptionPlan === "PREMIUM" && (
                      <Badge variant="default">Premium</Badge>
                    )}
                  </div>
                  <p className="mt-2 flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" /> {p.location}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <Star className="h-4 w-4 fill-current text-amber-500" />{" "}
                      {Number(p.reviewCount) > 0 ? p.rating.toFixed(1) : "1.0"}{" "}
                      {Number(p.reviewCount) > 0 ? `(${p.reviewCount})` : "(New Partner)"}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" /> {p.yearsOfExperience}+ years
                    </span>
                    <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                      Hourly: {formatCurrency(calculatedHourlyRate)} / hr
                    </span>
                  </div>
                </div>
              </div>

              <section>
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground text-sm">{p.bio}</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold">Experience</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                  {p.experience}
                </p>
              </section>

              <section className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="text-lg font-semibold">Specializations</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.specializations.map((s) => (
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Event types</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.eventTypes.map((s) => (
                      <Badge key={s} variant="pink">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </section>

              {/* Public Availability Calendar */}
              <section>
                <PublicAvailabilityCalendar bookedDates={p.bookedDates} name={p.name} />
              </section>

              {/* Guarantees */}
              <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-foreground">ShapeMyMoment Partner Guarantees</h3>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 text-xs">
                  {defaultGuarantees.map((guarantee, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-background p-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-bold text-foreground">{guarantee}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Includes & Excludes */}
              <section className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-emerald-500/20 bg-card p-4 space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> What&apos;s Included
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {defaultIncludes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-rose-500/20 bg-card p-4 space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 text-rose-500">
                    <XCircle className="h-4 w-4" /> What&apos;s Excluded
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {defaultExcludes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {p.portfolio && p.portfolio.filter((item: any) => Boolean(typeof item === "string" ? item : item?.url || item?.image)).length > 0 && (
                <section>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                      <Camera className="h-5 w-5 text-primary" /> Portfolio Showcase
                    </h2>
                    <a
                      href={getWhatsAppUrl(`Hi ShapeMyMoment Team! I am browsing ${p.name}'s portfolio showcase and would like to customize an event package for better planning and assurance.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline" className="text-xs font-bold gap-1.5 border-emerald-500/30 text-emerald-600">
                        <MessageCircle className="h-3.5 w-3.5" /> Customize or Chat with Team
                      </Button>
                    </a>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {p.portfolio
                      .map((item: any, i: number) => {
                        const imgUrl = typeof item === "string" ? item : (item?.url || item?.image || "");
                        if (!imgUrl) return null;
                        const caption = typeof item === "string" ? `Work ${i + 1}` : (item?.caption || item?.title || `${p.name} portfolio ${i + 1}`);
                        const itemMsg = `Hi ShapeMyMoment Team! I am viewing ${p.name}'s portfolio item ("${caption}") and would like to customize this style or chat with your team for better planning & assurance.`;
                        return (
                          <div
                            key={i}
                            className="group relative h-64 overflow-hidden rounded-2xl border border-border bg-muted flex flex-col justify-end p-3"
                          >
                            <Image
                              src={imgUrl}
                              alt={caption}
                              fill
                              className="object-cover transition hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                            <div className="relative z-10 space-y-2">
                              <p className="text-xs font-bold text-white truncate">{caption}</p>
                              <a
                                href={getWhatsAppUrl(itemMsg)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                              >
                                <Button size="sm" className="w-full h-8 text-[11px] font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                                  <MessageCircle className="h-3.5 w-3.5" /> Customize or Chat with Team
                                </Button>
                              </a>
                            </div>
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                </section>
              )}

              {p.packages && p.packages.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold">Packages</h2>
                  <div className="mt-4 grid gap-4">
                    {p.packages.map((pkg) => (
                      <div
                        key={pkg.name}
                        className="rounded-xl border border-border bg-muted/40 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{pkg.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {pkg.description}
                            </p>
                          </div>
                          <p className="shrink-0 font-bold text-primary">
                            {formatCurrency(pkg.price)}
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {pkg.hours ? `${pkg.hours} hours · ` : ""}{pkg.includes?.join(" · ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="text-lg font-semibold">Service locations</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.serviceLocations.join(", ")}
                  </p>
                </div>
                {p.languages && p.languages.length > 0 && (
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                      <Languages className="h-5 w-5" /> Languages
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {p.languages.join(", ")}
                    </p>
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-lg font-semibold">Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No reviews yet.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {reviews.map((r) => (
                      <article
                        key={r.id}
                        className="rounded-xl border border-border p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{r.name}</p>
                          <p className="text-sm text-primary">
                            {"★".repeat(r.rating)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {r.eventType} · {r.date}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">{r.review}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-md lg:sticky lg:top-24 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Starting Package Rate</p>
              <p className="text-3xl font-extrabold text-foreground">
                {formatCurrency(p.startingPrice)}
              </p>
              <p className="text-xs text-emerald-600 font-bold mt-1">
                Hourly Rate: {formatCurrency(calculatedHourlyRate)} / hr
              </p>
            </div>

            <div className="grid gap-2">
              <Button className="w-full font-bold" onClick={() => setShowForm(true)}>
                Request Booking
              </Button>
              <a
                href={getWhatsAppUrl(`Hi! I would like to inquire about booking ${p.name} (${p.category}) on ShapeMyMoment.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full gap-2 text-xs font-bold border-emerald-500/30 text-emerald-600">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Inquiry
                </Button>
              </a>
              <Button
                variant="ghost"
                className="w-full text-xs"
                onClick={shortlist}
              >
                <Heart
                  className={`h-4 w-4 ${shortlisted ? "fill-primary text-primary" : ""}`}
                />
                {shortlisted ? "Shortlisted" : "Add to Shortlist"}
              </Button>
            </div>

            {showForm && (
              <form onSubmit={submitLead} className="space-y-3 border-t border-border pt-4">
                <h3 className="font-semibold text-sm">Request booking lead</h3>
                <div>
                  <Label>Event type</Label>
                  <Select
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Event date</Label>
                  <Input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  />
                  <FieldError>{errors.eventDate}</FieldError>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                  <FieldError>{errors.location}</FieldError>
                </div>
                <div>
                  <Label>Hours required</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.hoursRequired}
                    onChange={(e) =>
                      setForm({ ...form, hoursRequired: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Budget (optional)</Label>
                  <Input
                    type="number"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <FieldError>{errors.message}</FieldError>
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <FieldError>{errors.name}</FieldError>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <FieldError>{errors.phone}</FieldError>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <FieldError>{errors.email}</FieldError>
                </div>
                <Button type="submit" className="w-full font-bold" disabled={submitting}>
                  {submitting ? "Sending…" : "Send Lead Request"}
                </Button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

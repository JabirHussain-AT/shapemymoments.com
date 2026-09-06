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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { EVENT_TYPES } from "@/types";
import type { DemoPhotographer, DemoReview } from "@/lib/data";

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
          src={p.coverImage}
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
            <div className="rounded-2xl border border-border bg-white p-5 premium-shadow sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-white shadow-md sm:h-32 sm:w-32">
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
                  <p className="mt-2 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {p.location}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <Star className="h-4 w-4 fill-current" /> {p.rating} ({p.reviewCount})
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" /> {p.yearsOfExperience}+ years
                    </span>
                    <Badge
                      variant={p.availability === "Available" ? "success" : "warning"}
                    >
                      {p.availability}
                    </Badge>
                  </div>
                </div>
              </div>

              <section className="mt-8">
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{p.bio}</p>
              </section>

              <section className="mt-8">
                <h2 className="text-lg font-semibold">Experience</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {p.experience}
                </p>
              </section>

              <section className="mt-8 grid gap-6 sm:grid-cols-2">
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

              <section className="mt-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Camera className="h-5 w-5 text-primary" /> Portfolio
                </h2>
                <div className="columns-2 gap-3 sm:columns-3">
                  {p.portfolio.map((item, i) => (
                    <div
                      key={i}
                      className="mb-3 break-inside-avoid overflow-hidden rounded-xl"
                    >
                      <Image
                        src={item.url}
                        alt={item.caption || `${p.name} portfolio ${i + 1}`}
                        width={400}
                        height={i % 2 === 0 ? 500 : 360}
                        className="h-auto w-full object-cover transition hover:scale-[1.02]"
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8">
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
                        {pkg.hours} hours · {pkg.includes.join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="text-lg font-semibold">Service locations</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.serviceLocations.join(", ")}
                  </p>
                </div>
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Languages className="h-5 w-5" /> Languages
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.languages.join(", ")}
                  </p>
                </div>
              </section>

              <section className="mt-8">
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

          <aside className="h-fit rounded-2xl border border-border bg-white p-5 premium-shadow lg:sticky lg:top-24">
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(p.startingPrice)}
            </p>
            <div className="mt-5 grid gap-2">
              <Button className="w-full" onClick={() => setShowForm(true)}>
                Request This Photographer
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={shortlist}
              >
                <Heart
                  className={`h-4 w-4 ${shortlisted ? "fill-primary text-primary" : ""}`}
                />
                {shortlisted ? "Shortlisted" : "Add to Shortlist"}
              </Button>
              <Link href="/plan-event">
                <Button variant="ghost" className="w-full">
                  Or plan full event
                </Button>
              </Link>
            </div>

            {showForm && (
              <form onSubmit={submitLead} className="mt-6 space-y-3 border-t border-border pt-5">
                <h3 className="font-semibold">Request booking</h3>
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
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Sending…" : "Send Request"}
                </Button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Star,
  Clock,
  Camera,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  X,
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
  reviews: initialReviews,
}: {
  photographer: DemoPhotographer;
  reviews: DemoReview[];
}) {
  const [reviewsList, setReviewsList] = useState<DemoReview[]>(initialReviews);
  const [shortlisted, setShortlisted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revEventType, setRevEventType] = useState(EVENT_TYPES[0] || "Wedding");
  const [revText, setRevText] = useState("");
  const [revPhotoUrl, setRevPhotoUrl] = useState("");
  const [revPhotos, setRevPhotos] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
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

  const handleAddPhotoUrl = () => {
    if (!revPhotoUrl) return;
    setRevPhotos((prev) => [...prev, revPhotoUrl]);
    setRevPhotoUrl("");
    toast.success("Photo attached!");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revText) {
      toast.error("Please enter your name and review text.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: revName,
          rating: revRating,
          eventType: revEventType,
          review: revText,
          images: revPhotos,
          photographerId: p.id,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to submit review");

      toast.success("Thank you! Your review has been submitted.");
      const newRev: DemoReview = {
        id: json.data?.id || `rev-${Date.now()}`,
        name: revName,
        rating: revRating,
        eventType: revEventType,
        review: revText,
        images: revPhotos,
        status: "APPROVED",
        featured: false,
        date: new Date().toISOString().split("T")[0],
      };
      setReviewsList((prev) => [newRev, ...prev]);
      setShowReviewForm(false);
      setRevName("");
      setRevText("");
      setRevPhotos([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const currentReviewCount = reviewsList.length;
  const avgRating = currentReviewCount > 0
    ? (reviewsList.reduce((acc, r) => acc + Number(r.rating || 0), 0) / currentReviewCount).toFixed(1)
    : (p.rating > 0 ? p.rating.toFixed(1) : "1.0");

  const shortlist = () => {
    setShortlisted((v) => !v);
    toast.success(
      shortlisted ? "Removed from shortlist." : "Added to shortlist."
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
                    <Badge className="bg-emerald-600 text-white font-bold gap-1 shadow-2xs">
                      🤝 Partnered with ShapeMyMoment
                    </Badge>
                  </div>
                  {p.location && (
                    <p className="mt-2 flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" /> {p.location}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <Star className="h-4 w-4 fill-current text-amber-500" />{" "}
                      {avgRating}{" "}
                      {currentReviewCount > 0 ? `(${currentReviewCount})` : "(New Partner)"}
                    </span>
                    {p.yearsOfExperience > 0 && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" /> {p.yearsOfExperience}+ years
                      </span>
                    )}
                    {p.hourlyRate ? (
                      <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                        Hourly: {formatCurrency(p.hourlyRate)} / hr
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <section>
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                  {p.bio || `Creative partner profile for ${p.name} on ShapeMyMoment South India Network.`}
                </p>
              </section>

              {p.experience && (
                <section>
                  <h2 className="text-lg font-semibold">Experience</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                    {p.experience}
                  </p>
                </section>
              )}

              <section className="grid gap-6 sm:grid-cols-2">
                {p.specializations && p.specializations.length > 0 && (
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
                )}
                {p.eventTypes && p.eventTypes.length > 0 && (
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
                )}
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
                  {[
                    "ShapeMyMoment 100% On-Time Service Delivery Guarantee",
                    "Direct Concierge Booking & Price Protection (Zero hidden fees)",
                    "Partner Network Quality Audit & Coordination",
                    "Secure Escrow Protection & Support",
                  ].map((guarantee, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-background p-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-bold text-foreground">{guarantee}</span>
                    </div>
                  ))}
                </div>
              </section>

              {p.portfolio && p.portfolio.filter((item: unknown) => {
                const itemObj = item as { url?: string; image?: string };
                return Boolean(typeof item === "string" ? item : itemObj?.url || itemObj?.image);
              }).length > 0 && (
                <section>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold">
                      <Camera className="h-5 w-5 text-primary shrink-0" /> Portfolio Showcase
                    </h2>
                    <a
                      href={getWhatsAppUrl(`Hi ShapeMyMoment Team! I am browsing ${p.name}'s portfolio showcase and would like to customize an event package for better planning and assurance.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs font-bold gap-1.5 border-emerald-500/30 text-emerald-600">
                        <MessageCircle className="h-3.5 w-3.5 shrink-0" /> Customize or Chat with Team
                      </Button>
                    </a>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {p.portfolio
                      .map((item: unknown, i: number) => {
                        const itemObj = item as { url?: string; image?: string; caption?: string; title?: string };
                        const imgUrl = typeof item === "string" ? item : (itemObj?.url || itemObj?.image || "");
                        if (!imgUrl) return null;
                        const caption = typeof item === "string" ? `Work ${i + 1}` : (itemObj?.caption || itemObj?.title || `${p.name} portfolio ${i + 1}`);
                        const itemMsg = `Hi ShapeMyMoment Team! I am viewing ${p.name}'s portfolio item ("${caption}") and would like to customize this style or chat with your team for better planning & assurance.`;
                        return (
                          <div
                            key={i}
                            className="group relative h-60 sm:h-64 w-full max-w-full overflow-hidden rounded-2xl border border-border bg-muted flex flex-col justify-end p-3"
                          >
                            <Image
                              src={imgUrl}
                              alt={caption}
                              fill
                              className="object-cover transition hover:scale-[1.02] cursor-pointer"
                              onClick={() => setSelectedImage(imgUrl)}
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
                                <Button size="sm" className="w-full h-8 text-[10px] sm:text-[11px] font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2">
                                  <MessageCircle className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">Customize or Chat with Team</span>
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

              {/* Reviews Section */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                  <h2 className="text-lg font-bold">Reviews &amp; Customer Feedbacks</h2>
                  <Button
                    onClick={() => setShowReviewForm((v) => !v)}
                    size="sm"
                    className="bg-primary text-white font-bold text-xs gap-1.5 shrink-0"
                  >
                    ★ {showReviewForm ? "Close Review Form" : "Write a Review & Add Photos"}
                  </Button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-4 shadow-sm text-xs">
                    <h3 className="font-extrabold text-sm text-foreground">Write a Review for {p.name}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="font-bold">Your Name *</Label>
                        <Input
                          className="text-xs mt-1"
                          placeholder="e.g. Ananya Nair"
                          value={revName}
                          onChange={(e) => setRevName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label className="font-bold">Event Type *</Label>
                        <select
                          className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold mt-1"
                          value={revEventType}
                          onChange={(e) => setRevEventType(e.target.value as typeof revEventType)}
                        >
                          {EVENT_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label className="font-bold">Star Rating *</Label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRevRating(star)}
                            className="p-1 cursor-pointer transition hover:scale-125"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                star <= revRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/40"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 font-bold text-amber-600 dark:text-amber-400">
                          {revRating} Star{revRating > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="font-bold">Your Review *</Label>
                      <Textarea
                        rows={3}
                        className="text-xs mt-1"
                        placeholder="Share your experience..."
                        value={revText}
                        onChange={(e) => setRevText(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label className="font-bold">Attach Event Photos (Image URLs)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          className="text-xs"
                          placeholder="Image URL..."
                          value={revPhotoUrl}
                          onChange={(e) => setRevPhotoUrl(e.target.value)}
                        />
                        <Button type="button" size="sm" variant="secondary" onClick={handleAddPhotoUrl} className="text-xs font-bold shrink-0">
                          + Attach
                        </Button>
                      </div>
                      {revPhotos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {revPhotos.map((url, i) => (
                            <div key={i} className="relative h-12 w-12 rounded-lg border border-border overflow-hidden">
                              <Image src={url} alt={`Attach ${i}`} fill className="object-cover" />
                              <button
                                type="button"
                                onClick={() => setRevPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={submittingReview} className="bg-primary text-white font-bold">
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </form>
                )}

                {reviewsList.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground text-center py-4">No customer reviews yet.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {reviewsList.map((r) => (
                      <article
                        key={r.id}
                        className="rounded-xl border border-border p-4 space-y-2 bg-card"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-foreground">{r.name}</p>
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-400" /> {r.rating}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">&ldquo;{r.review}&rdquo;</p>

                        {r.images && r.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {r.images.map((imgUrl, i) => (
                              <div
                                key={i}
                                className="relative h-14 w-14 rounded-lg border border-border overflow-hidden cursor-pointer hover:opacity-90"
                                onClick={() => setSelectedImage(imgUrl)}
                              >
                                <Image src={imgUrl} alt={`Review photo ${i + 1}`} fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase">
                          {r.eventType} · {r.date ? String(r.date).split("T")[0] : "Recent"}
                        </p>
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
              <p className="text-2xl font-extrabold text-foreground">
                {p.startingPrice > 0 ? formatCurrency(p.startingPrice) : "Custom Partner Rates"}
              </p>
              {p.hourlyRate ? (
                <p className="text-xs text-emerald-600 font-bold mt-1">
                  Hourly Rate: {formatCurrency(p.hourlyRate)} / hr
                </p>
              ) : null}
            </div>

            {/* Responsive Green Button (No Text Overflow) */}
            <a
              href={getWhatsAppUrl(`Hi! I would like to connect via ShapeMyMoment to inquire about booking ${p.name} (${p.category}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button className="w-full max-w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md font-extrabold text-xs sm:text-sm py-3 px-3.5 h-auto leading-snug text-center whitespace-normal rounded-2xl flex items-center justify-center">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Connect via ShapeMyMoment (+91 80899 09386)</span>
              </Button>
            </a>

            <div className="grid gap-2">
              <Button className="w-full font-bold text-xs" onClick={() => setShowForm(true)}>
                Request Direct Quotation
              </Button>
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl bg-black/90 border border-white/20 p-4 flex flex-col items-center justify-center space-y-3"
          >
            <Image
              src={selectedImage}
              alt="Enlarged Portfolio"
              width={1200}
              height={800}
              className="object-contain max-h-[75vh] w-auto rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

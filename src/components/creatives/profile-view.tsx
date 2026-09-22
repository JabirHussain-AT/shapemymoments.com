"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Star,
  Instagram,
  Globe,
  Youtube,
  MessageCircle,
  Share2,
  CheckCircle2,
  Sparkles,
  CalendarDays,
  ShieldCheck,
  Clock,
  ShieldAlert,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import { EVENT_TYPES } from "@/types";
import type { DemoCreative, DemoReview } from "@/lib/data";

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
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" /> Schedule Availability Calendar ({monthNames[month]} {year})
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time reserved and available dates for {name}. Tap any date to inquire on WhatsApp!
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block shadow-2xs" /> 🟢 Available
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="h-3 w-3 rounded-full bg-rose-500 inline-block shadow-2xs" /> 🔴 Reserved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-extrabold text-muted-foreground pb-1">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs">
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-10 rounded-xl bg-transparent" />
        ))}
        {days.map(({ dayNum, dateStr, isBooked }) => (
          <a
            key={dateStr}
            href={getWhatsAppUrl(`Hi! I'd like to check date booking availability for ${name} on date ${dateStr}.`)}
            target="_blank"
            rel="noopener noreferrer"
            title={isBooked ? `Reserved on ${dateStr}` : `Available on ${dateStr} — Tap to inquire`}
            className={`h-10 flex flex-col items-center justify-center rounded-xl font-extrabold transition text-xs ${
              isBooked
                ? "bg-rose-500/15 text-rose-600 border border-rose-500/30 cursor-not-allowed opacity-80"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 cursor-pointer shadow-2xs"
            }`}
          >
            <span>{dayNum}</span>
            <span className="text-[9px] font-semibold opacity-70">
              {isBooked ? "Reserved" : "Open"}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function CreativeProfileView({
  creative: c,
  reviews: initialReviews,
}: {
  creative: DemoCreative;
  reviews: DemoReview[];
}) {
  const [reviewsList, setReviewsList] = useState<DemoReview[]>(initialReviews);
  const [shortlisted, setShortlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showInstagramWarning, setShowInstagramWarning] = useState(false);
  const [activePortfolioCat, setActivePortfolioCat] = useState("ALL");

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revEventType, setRevEventType] = useState(EVENT_TYPES[0] || "Wedding");
  const [revText, setRevText] = useState("");
  const [revPhotoUrl, setRevPhotoUrl] = useState("");
  const [revPhotos, setRevPhotos] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleAddPhotoUrl = () => {
    if (!revPhotoUrl) return;
    setRevPhotos((prev) => [...prev, revPhotoUrl]);
    setRevPhotoUrl("");
    toast.success("Photo attached to review!");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revText) {
      toast.error("Please enter your name and review feedback.");
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
          photographerId: c.id,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to submit review");

      toast.success("Thank you! Your review and photos have been submitted.");
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

  const validPortfolioItems = (c.portfolio || [])
    .map((item: unknown, idx: number) => ({
      imgUrl: typeof item === "string" ? item : (item as { url?: string; image?: string })?.url || (item as { url?: string; image?: string })?.image || "",
      caption: typeof item === "string" ? `Work ${idx + 1}` : (item as { caption?: string; title?: string })?.caption || (item as { caption?: string; title?: string })?.title || `Work ${idx + 1}`,
      eventType: typeof item === "string" ? "Wedding" : (item as { eventType?: string })?.eventType || "Wedding",
    }))
    .filter((i: { imgUrl: string }) => Boolean(i.imgUrl));

  const portfolioCategories = Array.from(new Set(validPortfolioItems.map((i: { eventType: string }) => i.eventType)));

  const filteredPortfolio = validPortfolioItems.filter(
    (item: { eventType: string }) => activePortfolioCat === "ALL" || item.eventType === activePortfolioCat
  );

  const rawInstagram = (c.socialLinks as { instagram?: string } | undefined)?.instagram;
  let formattedInstagramUrl = rawInstagram || "";
  if (formattedInstagramUrl && !formattedInstagramUrl.startsWith("http://") && !formattedInstagramUrl.startsWith("https://")) {
    formattedInstagramUrl = `https://instagram.com/${formattedInstagramUrl.replace(/^@/, "")}`;
  }

  const toggleShortlist = () => {
    setShortlisted((v) => !v);
    toast.success(
      shortlisted ? "Removed from saved shortlist" : "Saved to your shortlist!"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${c.name} — ${c.category}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const whatsappMessage = `Hi ${c.name}! I saw your ${c.category} profile on ShapeMyMoment and would like to inquire about availability and packages.`;

  // Dynamic Rating & Count
  const currentReviewCount = reviewsList.length;
  const avgRating = currentReviewCount > 0
    ? (reviewsList.reduce((acc, r) => acc + Number(r.rating || 0), 0) / currentReviewCount).toFixed(1)
    : (c.rating > 0 ? c.rating.toFixed(1) : "1.0");

  return (
    <div className="bg-background min-h-screen">
      {/* Cover Image */}
      <div className="relative h-60 w-full sm:h-80 lg:h-96 bg-muted overflow-hidden">
        <Image
          src={c.coverImage || c.profilePhoto}
          alt={c.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/70"
            title="Share Profile"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={toggleShortlist}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/30 backdrop-blur-md transition ${
              shortlisted
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-black/40 text-white hover:bg-black/70"
            }`}
            title="Save Profile"
          >
            <Heart className={`h-4 w-4 ${shortlisted ? "fill-white" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Profile Header Info */}
      <div className="container-page relative -mt-20 z-10 pb-12">
        <div className="rounded-3xl border border-border bg-background p-6 shadow-xl sm:p-8 space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Profile Avatar */}
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-lg">
                <Image
                  src={c.profilePhoto}
                  alt={c.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-semibold">
                    {c.category}
                  </Badge>

                  <Badge className="bg-emerald-600 text-white font-bold gap-1 shadow-2xs">
                    🤝 Partnered with ShapeMyMoment
                  </Badge>

                  {c.yearsOfExperience > 0 && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {c.yearsOfExperience} yrs experience
                    </span>
                  )}
                </div>

                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {c.name}
                </h1>

                {c.location && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    {c.location}
                  </p>
                )}

                {/* Social & External Links */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {rawInstagram && (
                    <button
                      type="button"
                      onClick={() => setShowInstagramWarning(true)}
                      className="flex items-center gap-1.5 font-bold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer bg-pink-500/10 hover:bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/30 text-xs transition"
                    >
                      <Instagram className="h-3.5 w-3.5" /> Instagram Profile 🔗
                    </button>
                  )}
                  {(c.socialLinks as { instagram?: string; website?: string; youtube?: string } | undefined)?.website && (
                    <a
                      href={(c.socialLinks as { instagram?: string; website?: string; youtube?: string }).website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" /> Portfolio Site
                    </a>
                  )}
                  {(c.socialLinks as { instagram?: string; website?: string; youtube?: string } | undefined)?.youtube && (
                    <a
                      href={(c.socialLinks as { instagram?: string; website?: string; youtube?: string }).youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-semibold text-red-600 hover:underline"
                    >
                      <Youtube className="h-3.5 w-3.5" /> YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Price & Primary Hourly Rate Card */}
            <div className="flex flex-col items-start md:items-end border-t border-border/80 pt-4 md:border-0 md:pt-0 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-lg">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span>{avgRating}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {currentReviewCount > 0 ? `(${currentReviewCount} reviews)` : "(New Partner)"}
                </span>
              </div>

              {/* Dynamic Rates */}
              <div className="mt-3 text-left md:text-right space-y-1 w-full md:w-auto">
                {c.hourlyRate ? (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <Clock className="h-3.5 w-3.5" /> Hourly Rate: {formatCurrency(c.hourlyRate)} / hr
                  </div>
                ) : null}
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1">
                    Starting Full Day Rate
                  </p>
                  <p className="text-xl font-extrabold text-foreground">
                    {c.startingPrice > 0 ? formatCurrency(c.startingPrice) : "Custom Partner Rates"}
                  </p>
                </div>
              </div>

              {/* Responsive WhatsApp Button (No Mobile Text Overflow) */}
              <a
                href={getWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full"
              >
                <Button
                  size="lg"
                  className="w-full max-w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md font-extrabold text-xs sm:text-sm py-3 px-3.5 h-auto leading-snug text-center whitespace-normal rounded-2xl flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  <span>Connect via ShapeMyMoment (+91 80899 09386)</span>
                </Button>
              </a>
              <p className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1">
                <span>🔒 Direct artist booking via ShapeMyMoment Concierge</span>
              </p>
            </div>
          </div>

          {/* Concierge Protection Notice */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Partnered with ShapeMyMoment Network</p>
                <p className="text-xs text-muted-foreground">
                  All availability inquiries, quotes &amp; bookings for {c.name} are handled through ShapeMyMoment Concierge (+91 80899 09386) for guaranteed service quality and booking security.
                </p>
              </div>
            </div>
            <a
              href={getWhatsAppUrl(`Hi! I'd like to check date availability for ${c.name} (${c.category}) through ShapeMyMoment.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-full sm:w-auto"
            >
              <Button size="sm" className="w-full sm:w-auto text-xs font-bold">Inquire Availability</Button>
            </a>
          </div>

          {/* Bio & Skills */}
          <div className="border-t border-border/60 pt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
            <div>
              <h3 className="text-base font-bold text-foreground">About &amp; Specialization</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.bio || `Creative partner profile for ${c.name} on ShapeMyMoment South India Network.`}
              </p>
              {c.experience && (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
                  <strong className="text-foreground font-semibold">Experience Highlight:</strong> {c.experience}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground">Skills &amp; Specialties</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(c.specializations && c.specializations.length > 0 ? c.specializations : [c.category]).map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary"
                  >
                    ✨ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Public Interactive Availability Calendar */}
        <div className="mt-10">
          <PublicAvailabilityCalendar bookedDates={c.bookedDates} name={c.name} />
        </div>

        {/* ShapeMyMoment Partner Guarantees Card */}
        <div className="mt-10 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-foreground">ShapeMyMoment Partner Guarantees</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "ShapeMyMoment 100% On-Time Service Delivery Guarantee",
              "Direct Concierge Booking & Price Protection (Zero hidden fees)",
              "Partner Network Quality Audit & Coordination",
              "Secure Escrow & Customer Support",
            ].map((guarantee, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-background p-3.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-bold text-foreground">{guarantee}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Works Gallery */}
        <div className="mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Portfolio Showcase</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Click any image to enlarge or customize style with our team</p>
            </div>
            <a
              href={getWhatsAppUrl(`Hi ShapeMyMoment Team! I am browsing ${c.name}'s portfolio showcase and would like to customize an event package for better planning and assurance.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto shrink-0"
            >
              <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs font-bold gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10">
                <MessageCircle className="h-4 w-4" /> Customize Package or Chat with Team
              </Button>
            </a>
          </div>

          {/* Public Category Filter Pills */}
          {portfolioCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 pt-2 max-w-full flex-wrap border-b border-border/80">
              <button
                type="button"
                onClick={() => setActivePortfolioCat("ALL")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition shrink-0 ${
                  activePortfolioCat === "ALL"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                All Works ({validPortfolioItems.length})
              </button>
              {portfolioCategories.map((cat: string) => {
                const count = validPortfolioItems.filter((i: { eventType: string }) => i.eventType === cat).length;
                const active = activePortfolioCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActivePortfolioCat(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "bg-card border border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-80 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {filteredPortfolio.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredPortfolio.map((item: { imgUrl: string; caption: string; eventType: string }, idx: number) => {
                const imgUrl = item.imgUrl;
                const caption = item.caption;
                const eventType = item.eventType;
                const itemWhatsappMsg = `Hi ShapeMyMoment Team! I am viewing ${c.name}'s portfolio item ("${caption}" - ${eventType}) and would like to customize this style or chat with your team for better planning and assurance.`;
                return (
                  <div
                    key={idx}
                    className="group relative h-64 sm:h-72 w-full max-w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-xs flex flex-col justify-end"
                  >
                    <Image
                      src={imgUrl}
                      alt={caption}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105 cursor-pointer"
                      onClick={() => setSelectedImage(imgUrl)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 transition duration-300 pointer-events-none" />
                    <div className="relative z-10 p-3 space-y-2">
                      <div>
                        <p className="text-xs font-bold text-white truncate">{caption}</p>
                        <span className="inline-block rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          {eventType}
                        </span>
                      </div>

                      <a
                        href={getWhatsAppUrl(itemWhatsappMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="sm" className="w-full h-8 text-[10px] sm:text-[11px] font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm px-2">
                          <MessageCircle className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">Customize or Chat with Team</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-foreground">
                No public portfolio images uploaded yet for {c.name}.
              </p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Request private work samples directly via ShapeMyMoment Concierge on WhatsApp (+91 80899 09386).
              </p>
              <a
                href={getWhatsAppUrl(`Hi! I would like to request past work samples and portfolio for ${c.name} (${c.category}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="sm" variant="outline" className="text-xs gap-2 mt-1 font-bold">
                  <MessageCircle className="h-4 w-4 text-emerald-600" /> Request Work Samples via Concierge
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Reviews & Customer Feedback Section */}
        <div className="mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Customer Feedbacks &amp; Reviews</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real customer feedback and ratings for {c.name}.
              </p>
            </div>

            <Button
              onClick={() => setShowReviewForm((v) => !v)}
              size="sm"
              className="bg-primary text-white font-bold text-xs gap-2 shrink-0"
            >
              ★ {showReviewForm ? "Close Review Form" : "Write a Review & Add Photos"}
            </Button>
          </div>

          {/* Interactive Customer Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="rounded-3xl border border-primary/30 bg-primary/5 p-6 space-y-4 shadow-md">
              <h3 className="font-extrabold text-base text-foreground">Leave a Review for {c.name}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold">Your Name *</Label>
                  <Input
                    className="text-xs mt-1"
                    placeholder="e.g. Rahul Verma"
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Event Type *</Label>
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
                <Label className="text-xs font-bold">Star Rating *</Label>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRevRating(star)}
                      className="p-1 cursor-pointer transition hover:scale-125"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= revRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {revRating} Star{revRating > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold">Your Review &amp; Experience *</Label>
                <Textarea
                  rows={3}
                  className="text-xs mt-1"
                  placeholder="Share your experience working with this creative partner..."
                  value={revText}
                  onChange={(e) => setRevText(e.target.value)}
                  required
                />
              </div>

              {/* Photo Attachments */}
              <div>
                <Label className="text-xs font-bold">Attach Photos of the Function (Image URLs)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    className="text-xs"
                    placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                    value={revPhotoUrl}
                    onChange={(e) => setRevPhotoUrl(e.target.value)}
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={handleAddPhotoUrl} className="text-xs font-bold shrink-0">
                    + Attach Photo
                  </Button>
                </div>
                {revPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {revPhotos.map((url, i) => (
                      <div key={i} className="relative h-14 w-14 rounded-xl border border-border overflow-hidden">
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

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submittingReview} className="bg-primary text-white font-bold">
                  {submittingReview ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="grid gap-4 sm:grid-cols-2">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-foreground text-sm">{rev.name}</p>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" /> {rev.rating}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  &ldquo;{rev.review}&rdquo;
                </p>

                {/* Customer Review Photo Gallery */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {rev.images.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="relative h-16 w-16 rounded-xl border border-border overflow-hidden cursor-pointer hover:opacity-90"
                        onClick={() => setSelectedImage(imgUrl)}
                      >
                        <Image src={imgUrl} alt={`Review photo ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase pt-1">
                  {rev.eventType} · {rev.date ? String(rev.date).split("T")[0] : "Recent"}
                </p>
              </div>
            ))}

            {reviewsList.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full py-4 text-center">
                No customer reviews yet. Be the first to leave a feedback!
              </p>
            )}
          </div>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full bg-card/90 backdrop-blur-md p-3 rounded-2xl border border-border">
              <p className="text-xs font-bold text-foreground">
                Liked this work style? Chat with our team for customization &amp; planning assurance!
              </p>
              <a
                href={getWhatsAppUrl(`Hi ShapeMyMoment Team! I am viewing an enlarged portfolio image by ${c.name} (${selectedImage}) and would like to customize this style or chat with your team for better planning & assurance.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-md">
                  <MessageCircle className="h-4 w-4" /> Customize or Chat with Team
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Direct Booking Warning Modal Dialog */}
      {showInstagramWarning && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="rounded-3xl border border-amber-500/40 bg-card p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setShowInstagramWarning(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/15 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-foreground">Direct Booking Disclaimer Warning</h3>
                <p className="text-xs text-muted-foreground">Third-Party External Link</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-foreground">
              <p className="font-bold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" /> Important Notice Regarding Direct Off-Platform Bookings:
              </p>
              <p className="text-xs leading-relaxed">
                ShapeMyMoment provides zero-commission partner discovery. However, if you choose to communicate or book <strong className="text-foreground">{c.name}</strong> directly on Instagram or other external platforms:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-[11px] font-semibold text-foreground/90 pt-1">
                <li>ShapeMyMoment <strong>will NOT be responsible or liable</strong> for any direct payments, advance deposits, cancellations, or service quality disputes.</li>
                <li>Our 100% On-Time Delivery Guarantee &amp; Price Protection apply <strong>ONLY</strong> to official bookings made through ShapeMyMoment Concierge (+91 80899 09386).</li>
              </ul>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href={formattedInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowInstagramWarning(false)}
                className="w-full block"
              >
                <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:opacity-95 text-white font-extrabold text-xs gap-2 py-2.5 shadow-md">
                  <Instagram className="h-4 w-4" /> Proceed to Instagram Profile →
                </Button>
              </a>

              <a
                href={getWhatsAppUrl(`Hi! I want to inquire and book ${c.name} (${c.category}) through ShapeMyMoment Concierge for full price protection & booking guarantee.`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowInstagramWarning(false)}
                className="w-full block"
              >
                <Button variant="outline" className="w-full border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs gap-2 py-2.5">
                  <MessageCircle className="h-4 w-4 text-emerald-600" /> Book Safely via ShapeMyMoment (+91 80899 09386)
                </Button>
              </a>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstagramWarning(false)}
                className="w-full text-xs text-muted-foreground hover:text-foreground font-semibold"
              >
                Cancel &amp; Stay on ShapeMyMoment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

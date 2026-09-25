"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, BadgeCheck, MapPin, Star, MessageCircle, Sparkles, Compass, ArrowUpRight } from "lucide-react";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/section";
import { HoverLift } from "@/components/animations/motion";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import { getDemoPhotographers, type DemoPhotographer } from "@/lib/data";
import { EVENT_TYPES } from "@/types";

const CATEGORY_TABS = [
  { id: "all", label: "✨ All Categories" },
  { id: "photo", label: "📷 Photographers" },
  { id: "henna", label: "🌿 Henna Artists" },
  { id: "makeup", label: "💄 Makeup Artists" },
  { id: "hamper", label: "🎁 Hampers & Gifts" },
  { id: "cake", label: "🎂 Cake Bakers" },
] as const;

function getCategoryBadge(category: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("henna") || c.includes("mehendi")) {
    return <Badge className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 shadow-2xs">🌿 Henna Artist</Badge>;
  }
  if (c.includes("makeup") || c.includes("style") || c.includes("beauty")) {
    return <Badge className="bg-purple-600 text-white font-bold text-[10px] px-2 py-0.5 shadow-2xs">💄 Makeup Artist</Badge>;
  }
  if (c.includes("hamper") || c.includes("gift")) {
    return <Badge className="bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 shadow-2xs">🎁 Hamper Maker</Badge>;
  }
  if (c.includes("cake") || c.includes("baker") || c.includes("dessert")) {
    return <Badge className="bg-pink-600 text-white font-bold text-[10px] px-2 py-0.5 shadow-2xs">🎂 Cake Baker</Badge>;
  }
  return <Badge className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 shadow-2xs">📷 Photographer</Badge>;
}

export function PhotographerDirectory({
  initial,
}: {
  initial: DemoPhotographer[];
}) {
  const [liveList, setLiveList] = useState<DemoPhotographer[]>(initial);
  const [category, setCategory] = useState("all");
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    setLiveList(initial);
  }, [initial]);

  const refreshLive = useCallback(async () => {
    try {
      const res = await fetch("/api/creatives", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLiveList(json.data);
      }
    } catch (e) {
      console.warn("Failed to refresh live photographers:", e);
    }
  }, []);

  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("smm_partner_channel");
      bc.onmessage = (event) => {
        if (event.data?.type === "CREATIVE_UPDATED") {
          refreshLive();
        }
      };
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === "smm_creative_updated") {
        refreshLive();
      }
    };

    const onFocus = () => {
      refreshLive();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshLive]);

  const results = useMemo(() => {
    return getDemoPhotographers(liveList, {
      category: category !== "all" ? category : undefined,
      q: q || undefined,
      location: location || undefined,
      eventType: eventType || undefined,
      minExperience: minExperience ? Number(minExperience) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      availability: availability || undefined,
      sort,
    });
  }, [liveList, category, q, location, eventType, minExperience, maxPrice, minRating, availability, sort]);

  return (
    <div className="space-y-8">
      {/* Equal Care Verified Creative Partners Banner */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              We have <span className="text-primary font-black">1000+ verified creative partners</span> across South India!
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Photographers, Henna Artists, Makeup Stylists, Gift Hamper Creators &amp; Custom Cake Bakers for your special moments.
            </p>
          </div>
        </div>
        <a
          href={getWhatsAppUrl("Hi ShapeMyMoment Team! I am looking for a creative partner (photographer, henna artist, makeup artist, hampers or cake baker) for my event and would like quick recommendations.")}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm">
            <MessageCircle className="h-4 w-4" /> Quick Match via Concierge
          </Button>
        </a>
      </div>

      {/* Top Category Filter Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isActive = category === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold transition shadow-2xs cursor-pointer ${
                isActive
                  ? "bg-primary text-white ring-2 ring-primary/40 shadow-sm"
                  : "bg-card border border-border text-foreground hover:bg-muted/60"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-xs lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Search &amp; Filters
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] h-7 px-2"
              onClick={() => {
                setCategory("all");
                setQ("");
                setLocation("");
                setEventType("");
                setMinExperience("");
                setMaxPrice("");
                setMinRating("");
                setAvailability("");
                setSort("recommended");
              }}
            >
              Reset All
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold">Search (Name / Skill / Category)</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9 text-xs"
                  placeholder="e.g. Mehendi, Wed73, Bridal, Cakes..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>

            {/* Highlighted Function Location Selector */}
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 space-y-1.5">
              <Label className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                Select Your Function Location *
              </Label>
              <Input
                placeholder="e.g. Wayanad, Kozhikode, Kochi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-xs border-emerald-500/30 bg-background font-bold"
              />
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                We suggest the nearest verified partners for your city!
              </p>
            </div>

            <div>
              <Label className="text-xs font-bold">Event Type</Label>
              <Select value={eventType} onChange={(e) => setEventType(e.target.value)} className="text-xs mt-1">
                <option value="">All Event Types</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">Min Experience (Years)</Label>
              <Input
                type="number"
                min={0}
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                className="text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-bold">Max Starting Price (₹)</Label>
              <Input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-bold">Min Rating</Label>
              <Select value={minRating} onChange={(e) => setMinRating(e.target.value)} className="text-xs mt-1">
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">Availability Status</Label>
              <Select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="text-xs mt-1"
              >
                <option value="">Any Availability</option>
                <option value="Available">🟢 Available</option>
                <option value="Limited">🟡 Limited Slots</option>
                <option value="Booked">🔴 Fully Booked</option>
              </Select>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold text-muted-foreground">
              Showing <strong className="text-foreground">{results.length}</strong> creative partners
              {initial.length !== results.length || category !== "all" ? " (filtered)" : ""}
            </p>
            <div className="sm:w-56">
              <Select value={sort} onChange={(e) => setSort(e.target.value)} className="text-xs font-semibold">
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="featured">Featured</option>
              </Select>
            </div>
          </div>

          {results.length === 0 ? (
            <EmptyState
              title="No creative partners found"
              description="Try changing your function location, category, or search filters."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <HoverLift key={p.id}>
                  <PhotographerCard photographer={p} />
                </HoverLift>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Advisory Connect Reminder Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-card to-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              🤝 Connect &amp; Advisory Call
            </Badge>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold">
              <span className="line-through text-muted-foreground">₹99</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40">
                FREE Offer
              </span>
            </div>
          </div>
          <h3 className="text-lg font-black text-foreground tracking-tight">
            Can&apos;t decide or want help matching the right creative partner?
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Chat with our team for an advisory connect call! Regular price <span className="line-through">₹99</span>, currently <strong className="text-emerald-600 dark:text-emerald-400 font-bold">FREE as a limited-time offer</strong>. We help analyze your event date, budget, and function location to suggest the best nearest available creative partners with direct pricing and complete transparency.
          </p>
        </div>

        <a
          href={getWhatsAppUrl("Hi ShapeMyMoment Team! I would like an advisory consultation call (₹99 FREE Offer) to help decide the best creative partner for my event.")}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs gap-2 shadow-md">
            <MessageCircle className="h-5 w-5" /> Chat for Advisory Call (<span className="line-through opacity-70">₹99</span> FREE)
          </Button>
        </a>
      </div>
    </div>
  );
}

export function PhotographerCard({
  photographer: p,
}: {
  photographer: DemoPhotographer;
}) {
  const hasReviews = Number(p.reviewCount) > 0;
  const displayRating = hasReviews ? p.rating.toFixed(1) : "1.0";
  const ratingText = hasReviews ? `(${p.reviewCount})` : "(New)";

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition hover:-translate-y-0.5">
      <div className="relative aspect-[4/3]">
        <Image
          src={p.profilePhoto}
          alt={p.name}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
          {getCategoryBadge(p.category)}
          {p.verified && (
            <Badge variant="success" className="gap-1 bg-white/95 text-blue-600 font-bold text-[10px]">
              <BadgeCheck className="h-3 w-3" /> Verified
            </Badge>
          )}
          {p.featured && <Badge variant="gold" className="text-[10px]">Featured</Badge>}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-foreground text-base leading-snug">{p.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {p.location}
            </p>
          </div>
          {/* Rating Badge (1.0 if no reviews) */}
          <div className="text-right shrink-0">
            <p className="flex items-center gap-1 font-bold text-xs text-foreground bg-background border border-border px-2 py-0.5 rounded-full shadow-2xs">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {displayRating}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{ratingText}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-medium">
          {p.yearsOfExperience}+ yrs exp · {p.specializations.slice(0, 2).join(", ")}
        </p>

        {/* Rate & Direct Actions */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Starting Rate</p>
            <p className="text-xs font-extrabold text-foreground">{formatCurrency(p.startingPrice)}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={getWhatsAppUrl(`Hi ${p.name}! I am interested in your services on ShapeMyMoment and would like to connect for availability.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="h-8 px-2.5 text-[11px] font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                <MessageCircle className="h-3.5 w-3.5" /> Chat
              </Button>
            </a>

            <Link href={`/photographers/${p.slug}`}>
              <Button size="sm" variant="outline" className="h-8 px-2 text-[11px] font-bold gap-1">
                Portfolio <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  MapPin,
  Star,
  Sparkles,
  ArrowUpRight,
  MessageCircle,
  Search,
  Users,
  Compass,
  Camera,
  Flower2,
  Palette,
  Gift,
  Cake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import type { DemoCreative } from "@/lib/data";

const CATEGORIES = [
  { id: "All", label: "All Network", icon: Sparkles },
  { id: "Photographers", label: "Photographers", icon: Camera },
  { id: "Henna Artists", label: "Henna Artists", icon: Flower2 },
  { id: "Makeup Artists", label: "Makeup Artists", icon: Palette },
  { id: "Hamper Makers", label: "Hamper Makers", icon: Gift },
  { id: "Cake Bakers", label: "Cake Bakers", icon: Cake },
];

const ALL_MAJOR_LOCATIONS = [
  "All South India",
  "Kalpetta",
  "Wayanad",
  "Sulthan Bathery",
  "Mananthavady",
  "Kozhikode",
  "Kannur",
  "Kochi",
  "Ernakulam",
  "Thiruvananthapuram",
  "Thrissur",
  "Palakkad",
  "Kottayam",
  "Alappuzha",
  "Malappuram",
  "Mysuru",
  "Bengaluru",
  "Chennai",
  "Coimbatore",
];

export function CreativeShowcase({ creatives }: { creatives: DemoCreative[] }) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All South India");

  const filtered = useMemo(() => {
    const result = creatives.filter((c) => {
      const catStr = c.category as string;
      const matchCat =
        activeTab === "All" ||
        catStr === activeTab ||
        (activeTab === "Henna Artists" && (catStr === "Henna Designers" || catStr === "Henna Artists")) ||
        (activeTab === "Hamper Makers" && (catStr === "Hampers" || catStr === "Hamper Makers"));

      const matchLoc =
        selectedLocation === "All" ||
        selectedLocation === "All South India" ||
        c.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        (c.serviceLocations &&
          c.serviceLocations.some((s: string) =>
            s.toLowerCase().includes(selectedLocation.toLowerCase())
          ));

      const qLower = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        c.name.toLowerCase().includes(qLower) ||
        c.category.toLowerCase().includes(qLower) ||
        c.location.toLowerCase().includes(qLower) ||
        (c.specializations &&
          c.specializations.some((s: string) => s.toLowerCase().includes(qLower)));
      return matchCat && matchLoc && matchQuery;
    });

    if (activeTab !== "All") {
      return result.slice(0, 6);
    }
    return result;
  }, [creatives, activeTab, selectedLocation, searchQuery]);

  return (
    <section id="creatives-section" className="section-padding bg-muted/30">
      <div className="container-page space-y-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Verified South India Creative Network
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Featured Creatives &amp; Event Artists
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground text-sm leading-relaxed">
              Explore verified photographers, henna artists, makeup specialists, hamper makers, and cake bakers with transparent locations and direct portfolio access.
            </p>
          </div>

          <a
            href={getWhatsAppUrl("Hi ShapeMyMoment Team! I would like to inquire about event creative services and partner options.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
            >
              <MessageCircle className="h-4 w-4" /> Inquire on WhatsApp
            </Button>
          </a>
        </div>

        {/* 1000+ Options Exploration Banner */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                We have <span className="text-primary">1000+ verified partner options</span> across South India!
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Love to explore? Browse detailed profile portfolios below. Or chat directly with our concierge team to quickly connect with nearest partners.
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl("Hi ShapeMyMoment Team! I am looking for a creative partner for my event and would like quick recommendations.")}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm">
              <MessageCircle className="h-4 w-4" /> Connect with Concierge Team
            </Button>
          </a>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
              }`}
            >
              <cat.icon className="h-4 w-4 shrink-0" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Highlighted Function Location Filter & Search Bar */}
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr] bg-card p-4 rounded-2xl border-2 border-primary/30 shadow-sm">
          {/* Search by Name / Category / Skill */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Search by Name, Category, or Skill
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search (e.g. Wed73, Bridal, Mehendi, Airbrush, Photography)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Highlighted Function Location Selector */}
          <div className="space-y-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2.5">
            <label className="block text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              Select Your Function Location (Nearest Partner Suggestion) *
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded-xl border border-emerald-500/30 bg-background px-3 py-2 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              {ALL_MAJOR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  📍 {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Creatives Showcase Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((creative) => {
              // Rating calculation: 1.0 star if no reviews, otherwise actual rating
              const hasReviews = Number(creative.reviewCount) > 0;
              const displayRating = hasReviews ? creative.rating.toFixed(1) : "1.0";
              const ratingText = hasReviews ? `(${creative.reviewCount})` : "(New Partner)";

              return (
                <motion.div
                  key={creative.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Cover Banner */}
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <Image
                      src={creative.coverImage || creative.profilePhoto}
                      alt={creative.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <Badge className="absolute left-3 top-3 bg-black/60 text-white backdrop-blur-md">
                      {creative.category}
                    </Badge>

                    {creative.verified && (
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-blue-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </div>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="relative flex flex-1 flex-col p-5 pt-0">
                    <div className="-mt-8 mb-3 flex items-end justify-between">
                      {/* Avatar */}
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-4 border-background bg-background shadow-md">
                        <Image
                          src={creative.profilePhoto}
                          alt={creative.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Rating Badge (1.0 if no reviews) */}
                      <div className="flex items-center gap-1.5 rounded-full border border-border bg-background/95 px-2.5 py-1 text-xs font-bold text-foreground shadow-xs">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{displayRating}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {ratingText}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition">
                      {creative.name}
                    </h3>

                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      {creative.location}
                    </p>

                    <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {creative.bio}
                    </p>

                    {/* Skill Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {creative.specializations.slice(0, 3).map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Rate & WhatsApp Chat Action (Custom Quote Removed) */}
                    <div className="mt-5 border-t border-border/60 pt-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">
                            Starting Rate
                          </p>
                          <p className="text-sm font-extrabold text-foreground">
                            {formatCurrency(creative.startingPrice)}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          🟢 Available
                        </span>
                      </div>

                      {/* Action Buttons: Direct WhatsApp Chat & Portfolio */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={getWhatsAppUrl(
                            `Hi ${creative.name}! I am interested in your ${creative.category} services on ShapeMyMoment and would like to connect for availability.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button
                            size="sm"
                            className="w-full h-9 px-2 text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          >
                            <MessageCircle className="h-3.5 w-3.5" /> Chat
                          </Button>
                        </a>

                        <Link href={`/creatives/${creative.slug}`}>
                          <Button size="sm" variant="outline" className="w-full h-9 px-2 text-xs font-bold gap-1">
                            Portfolio <ArrowUpRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
              <p className="text-lg font-bold">No partner creatives matched your filters</p>
              <p className="text-xs text-muted-foreground">
                Try selecting a broader location or clearing your search keywords.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab("All");
                  setSearchQuery("");
                  setSelectedLocation("All South India");
                }}
              >
                Reset Search Filters
              </Button>
            </div>
          )}
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
              Can&apos;t decide or want custom partner recommendations?
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Chat with our team for an advisory connect call! Regular price <span className="line-through">₹99</span>, currently <strong className="text-emerald-600 dark:text-emerald-400 font-bold">FREE as a limited-time offer</strong>. We help analyze your event date, budget, and function location to suggest the best nearest available partners with direct pricing and complete transparency.
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
    </section>
  );
}

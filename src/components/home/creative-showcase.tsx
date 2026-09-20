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
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import type { DemoCreative } from "@/lib/data";

const CATEGORIES = [
  { id: "All", label: "All Network", icon: "✨" },
  { id: "Photographers", label: "Photographers", icon: "📸" },
  { id: "Henna Artists", label: "Henna Artists", icon: "🌸" },
  { id: "Makeup Artists", label: "Makeup Artists", icon: "💄" },
  { id: "Hamper Makers", label: "Hamper Makers", icon: "🎁" },
  { id: "Cake Bakers", label: "Cake Bakers", icon: "🎂" },
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
  const [selectedLocation, setSelectedLocation] = useState("All");

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

      const matchQuery =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.specializations.some((s: string) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCat && matchLoc && matchQuery;
    });

    // Enforce max 3 items per section if viewing single category tab
    if (activeTab !== "All") {
      return result.slice(0, 3);
    }
    return result;
  }, [creatives, activeTab, selectedLocation, searchQuery]);

  return (
    <section id="creatives-section" className="section-padding bg-muted/30">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Verified Creative Network
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              South India&apos;s Featured Creatives &amp; Artists
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Explore verified photographers, henna artists, makeup specialists, hamper makers, and cake bakers with transparent ratings, locations, and instant portfolio access.
            </p>
          </div>

          <Link href="/creatives/register">
            <Button
              variant="outline"
              className="gap-2 border-black bg-black text-white hover:bg-zinc-800 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800 shadow-xs"
            >
              Join as Creative <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border/80 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search & Location Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, skill (e.g. Bridal, Airbrush, Organic)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
            >
              {ALL_MAJOR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Creatives Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((creative) => (
              <motion.div
                key={creative.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Cover Image */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={creative.coverImage}
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

                {/* Profile Info */}
                <div className="relative flex flex-1 flex-col p-5 pt-0">
                  {/* Profile Photo Avatar */}
                  <div className="-mt-8 mb-3 flex items-end justify-between">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-4 border-background bg-background shadow-md">
                      <Image
                        src={creative.profilePhoto}
                        alt={creative.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 rounded-full border border-border bg-background/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{creative.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground font-normal">
                        ({creative.reviewCount})
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

                  {/* Skills Tags */}
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

                  {/* Footer Stats & Actions */}
                  <div className="mt-5 border-t border-border/60 pt-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                        Flexible Rate / Offer
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="line-through text-xs text-muted-foreground/60 font-normal">
                          {formatCurrency(creative.startingPrice)}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-xs">
                          Custom Quote
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppUrl(
                          `Hi ${creative.name}! I found your ${creative.category} profile on ShapeMyMoment and would like to check availability.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                        title="WhatsApp Enquiry (+91 80899 09386)"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>

                      <Link href={`/creatives/${creative.slug}`}>
                        <Button size="sm" className="h-9 px-3 text-xs gap-1">
                          Portfolio <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-lg font-semibold">No creatives found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try clearing your search query or location filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setActiveTab("All");
                  setSearchQuery("");
                  setSelectedLocation("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

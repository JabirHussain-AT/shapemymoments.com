"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, BadgeCheck, MapPin, Star } from "lucide-react";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/section";
import { formatCurrency } from "@/lib/utils";
import { getDemoPhotographers, type DemoPhotographer } from "@/lib/data";
import { EVENT_TYPES } from "@/types";

export function PhotographerDirectory({
  initial,
}: {
  initial: DemoPhotographer[];
}) {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("recommended");

  const results = useMemo(() => {
    return getDemoPhotographers({
      q: q || undefined,
      location: location || undefined,
      eventType: eventType || undefined,
      minExperience: minExperience ? Number(minExperience) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      availability: availability || undefined,
      sort,
    });
  }, [q, location, eventType, minExperience, maxPrice, minRating, availability, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-2xl border border-border bg-white p-5 premium-shadow lg:sticky lg:top-24">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Filters
        </h2>
        <div className="space-y-4">
          <div>
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Name or specialty"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Location</Label>
            <Input
              placeholder="City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <Label>Event type</Label>
            <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
              <option value="">All</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Min experience (years)</Label>
            <Input
              type="number"
              min={0}
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
            />
          </div>
          <div>
            <Label>Max starting price</Label>
            <Input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div>
            <Label>Min rating</Label>
            <Select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="">Any</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
              <option value="4.8">4.8+</option>
            </Select>
          </div>
          <div>
            <Label>Availability</Label>
            <Select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="">Any</option>
              <option value="Available">Available</option>
              <option value="Limited">Limited</option>
              <option value="Booked">Booked</option>
            </Select>
          </div>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
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
            Reset filters
          </Button>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{results.length}</strong> photographers
            {initial.length !== results.length ? " (filtered)" : ""}
          </p>
          <div className="sm:w-56">
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
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
            title="No photographers found"
            description="Try changing your location or filters."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <PhotographerCard key={p.id} photographer={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PhotographerCard({
  photographer: p,
}: {
  photographer: DemoPhotographer;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white premium-shadow transition hover:-translate-y-0.5">
      <div className="relative aspect-[4/3]">
        <Image
          src={p.profilePhoto}
          alt={p.name}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.verified && (
            <Badge variant="success" className="gap-1 bg-white/95">
              <BadgeCheck className="h-3 w-3" /> Verified
            </Badge>
          )}
          {p.featured && <Badge variant="gold">Featured</Badge>}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {p.location}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="flex items-center gap-1 font-semibold text-primary">
              <Star className="h-3.5 w-3.5 fill-current" /> {p.rating}
            </p>
            <p className="text-xs text-muted-foreground">{p.reviewCount} reviews</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {p.yearsOfExperience}+ years · {p.specializations.slice(0, 2).join(", ")}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">From {formatCurrency(p.startingPrice)}</p>
            <Badge
              variant={p.availability === "Available" ? "success" : "warning"}
              className="mt-1"
            >
              {p.availability}
            </Badge>
          </div>
          <Link href={`/photographers/${p.slug}`}>
            <Button size="sm">View Profile</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

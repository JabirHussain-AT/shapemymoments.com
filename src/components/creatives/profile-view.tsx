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
  Instagram,
  Globe,
  Youtube,
  MessageCircle,
  Share2,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import type { DemoCreative, DemoReview } from "@/lib/data";

export function CreativeProfileView({
  creative: c,
  reviews,
}: {
  creative: DemoCreative;
  reviews: DemoReview[];
}) {
  const [shortlisted, setShortlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  return (
    <div className="bg-background min-h-screen">
      {/* Cover Image */}
      <div className="relative h-60 w-full sm:h-80 lg:h-96 bg-muted overflow-hidden">
        <Image
          src={c.coverImage}
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
        <div className="rounded-3xl border border-border bg-background p-6 shadow-xl sm:p-8">
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

                  {c.verified && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                      <BadgeCheck className="h-4 w-4" /> Verified Partner
                    </div>
                  )}

                  <span className="text-xs text-muted-foreground font-medium">
                    {c.yearsOfExperience} yrs experience
                  </span>
                </div>

                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {c.name}
                </h1>

                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  {c.location}
                </p>

                {/* Social & External Links */}
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  {(c.socialLinks as any)?.instagram && (
                    <a
                      href={(c.socialLinks as any).instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-semibold text-pink-600 hover:underline"
                    >
                      <Instagram className="h-3.5 w-3.5" /> Instagram
                    </a>
                  )}
                  {(c.socialLinks as any)?.website && (
                    <a
                      href={(c.socialLinks as any).website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" /> Portfolio Site
                    </a>
                  )}
                  {(c.socialLinks as any)?.youtube && (
                    <a
                      href={(c.socialLinks as any).youtube}
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

            {/* Price & Primary WhatsApp Action */}
            <div className="flex flex-col items-start md:items-end border-t border-border/80 pt-4 md:border-0 md:pt-0">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-lg">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span>{c.rating.toFixed(1)}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  ({c.reviewCount} verified reviews)
                </span>
              </div>

              <div className="mt-2 text-left md:text-right">
                <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                  Flexible Rate / Offer
                </p>
                <div className="flex items-center gap-2 md:justify-end">
                  <span className="line-through text-sm font-semibold text-muted-foreground/60">
                    {formatCurrency(c.startingPrice)}
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    Custom Offer Package
                  </span>
                </div>
              </div>

              <a
                href={getWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full md:w-auto"
              >
                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md">
                  <MessageCircle className="h-5 w-5" /> Connect via ShapeMyMoment (+91 80899 09386)
                </Button>
              </a>
              <p className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1">
                <span>🔒 Direct artist booking via ShapeMyMoment Concierge</span>
              </p>
            </div>
          </div>

          {/* Concierge Protection Notice */}
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Verified ShapeMyMoment Partner</p>
                <p className="text-xs text-muted-foreground">
                  All availability inquiries, quotes & bookings for {c.name} are handled through ShapeMyMoment Concierge (+91 80899 09386) for guaranteed service quality and booking security.
                </p>
              </div>
            </div>
            <a
              href={getWhatsAppUrl(`Hi! I'd like to check date availability for ${c.name} (${c.category}) through ShapeMyMoment.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button size="sm" className="text-xs">Inquire Availability</Button>
            </a>
          </div>

          {/* Bio & Skills */}
          <div className="mt-8 border-t border-border/60 pt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
            <div>
              <h3 className="text-base font-bold text-foreground">About &amp; Specialization</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.bio}</p>
              {c.experience && (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
                  <strong className="text-foreground font-semibold">Experience Highlight:</strong> {c.experience}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground">Skills &amp; Specialties</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.specializations.map((skill: string) => (
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

        {/* Portfolio Works Gallery */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Portfolio &amp; Past Works</h2>
              <p className="text-sm text-muted-foreground">Click any image to enlarge showcase</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {c.portfolio.map((item: any, idx: number) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(item.url)}
                className="group relative h-64 w-full overflow-hidden rounded-2xl border border-border bg-muted cursor-pointer shadow-xs"
              >
                <Image
                  src={item.url}
                  alt={item.caption || `Work ${idx + 1}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 transition duration-300 group-hover:opacity-100">
                  <p className="text-xs font-semibold">{item.caption}</p>
                  <p className="text-[10px] text-white/80">{item.eventType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packages & Rates */}
        {c.packages && c.packages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">Services &amp; Packages</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {c.packages.map((pkg: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-xs"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{pkg.name}</h3>
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          🎁 Offer Package
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="line-through text-xs font-semibold text-muted-foreground/60 mr-1.5">
                          {formatCurrency(pkg.price)}
                        </span>
                        <span className="text-base font-extrabold text-emerald-600">
                          Custom Offer Quote
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>

                    {pkg.includes && pkg.includes.length > 0 && (
                      <ul className="mt-4 space-y-2 text-xs font-medium text-muted-foreground">
                        {pkg.includes.map((inc: string, j: number) => (
                          <li key={j} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <a
                    href={getWhatsAppUrl(`Hi ${c.name}! I'd like to book the "${pkg.name}" package.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      Inquire Package <ChevronRight className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Customer Feedbacks &amp; Reviews</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-border bg-background p-5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-foreground text-sm">{rev.name}</p>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" /> {rev.rating}
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  &ldquo;{rev.review}&rdquo;
                </p>
                <p className="mt-3 text-[10px] text-muted-foreground/70 font-semibold uppercase">
                  {rev.eventType} · {rev.date}
                </p>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-sm text-muted-foreground">
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
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl">
            <Image
              src={selectedImage}
              alt="Enlarged Portfolio"
              width={1200}
              height={800}
              className="object-contain max-h-[85vh] w-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

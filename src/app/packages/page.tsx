import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLivePackagesFromDb, getLiveReviewsFromDb } from "@/lib/data";
import { absoluteUrl, formatCurrency } from "@/lib/utils";
import { FadeIn } from "@/components/animations/motion";

export const metadata: Metadata = {
  title: "ShapeMyMoment Event Packages — Plan Your Perfect Celebration",
  description:
    "Explore customizable event packages for birthdays, weddings, corporate events and more. Starting prices configurable — every package can be tailored.",
  alternates: { canonical: absoluteUrl("/packages") },
};

export default async function PackagesPage() {
  const packages = await getLivePackagesFromDb();
  const reviews = (await getLiveReviewsFromDb()).slice(0, 3);

  return (
    <div className="section-padding pt-10">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Event packages
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Packages designed to be customized
          </h1>
          <p className="mt-3 text-muted-foreground">
            Starting points for your celebration. Tell us your budget and vision —
            we&apos;ll shape the final package around you.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            <p className="text-lg font-semibold text-foreground">Custom Event Packages</p>
            <p className="mt-1 text-sm">
              No pre-set package catalog right now. Tell us your vision and we will build a tailored event plan for your budget!
            </p>
            <Link href="/plan-event" className="mt-4 inline-block">
              <Button>Plan My Event</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {packages.map((pkg, i) => (
              <FadeIn key={pkg.id} delay={i * 0.05}>
                <article className="overflow-hidden rounded-2xl border border-border bg-card premium-shadow">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={pkg.images[0]}
                      alt={pkg.name}
                      fill
                      className="object-cover"
                      sizes="(max-width:1024px) 100vw, 50vw"
                    />
                    {pkg.featured && (
                      <Badge variant="gold" className="absolute left-3 top-3">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-xl font-bold">{pkg.name}</h2>
                      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800">
                        🎁 Offer Package
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">
                        Predefined Price:{" "}
                        <span className="line-through font-semibold text-muted-foreground/70">
                          {formatCurrency(pkg.startingPrice)}
                        </span>{" "}
                        <span className="rounded-xs bg-red-100 px-1 py-0.5 text-[10px] font-bold text-red-600">
                          Disabled
                        </span>
                      </p>
                      <p className="mt-1 text-xl font-extrabold text-emerald-600">
                        Custom Offer Package (Tailored to Your Budget)
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {pkg.description}
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {pkg.services.map((s) => (
                        <li key={s} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary" /> {s}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Link href={`/plan-event?package=${pkg.slug}`}>
                        <Button className="w-full sm:w-auto">
                          {pkg.startingPrice >= 60000
                            ? "Build My Package"
                            : "Customize Package"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}

        {reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-center text-2xl font-bold">What clients say</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <p className="text-sm text-primary">{"★".repeat(r.rating)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">“{r.review}”</p>
                  <p className="mt-3 text-sm font-semibold">{r.name}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

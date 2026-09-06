import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDemoPackages, getDemoReviews } from "@/lib/data";
import { absoluteUrl, formatCurrency } from "@/lib/utils";
import { FadeIn } from "@/components/animations/motion";

export const metadata: Metadata = {
  title: "ShapeMyMoment Event Packages — Plan Your Perfect Celebration",
  description:
    "Explore customizable event packages for birthdays, weddings, corporate events and more. Starting prices configurable — every package can be tailored.",
  alternates: { canonical: absoluteUrl("/packages") },
};

export default function PackagesPage() {
  const packages = getDemoPackages();
  const reviews = getDemoReviews({ featured: true }).slice(0, 3);

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

        <div className="grid gap-6 lg:grid-cols-2">
          {packages.map((pkg, i) => (
            <FadeIn key={pkg.id} delay={i * 0.05}>
              <article className="overflow-hidden rounded-2xl border border-border bg-white premium-shadow">
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
                  <h2 className="text-xl font-bold">{pkg.name}</h2>
                  <p className="mt-2 text-2xl font-bold text-primary">
                    Starting from {formatCurrency(pkg.startingPrice)}
                    {pkg.startingPrice >= 60000 ? "+" : ""}
                  </p>
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
      </div>
    </div>
  );
}

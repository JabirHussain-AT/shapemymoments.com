import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/hero-section";
import {
  WhatWeDo,
  EventTypesGrid,
  TrustSection,
  FeaturedPackages,
  FeaturedPhotographers,
  ReviewsSection,
  FinalCta,
} from "@/components/home/home-sections";
import {
  getDemoEventTypes,
  getDemoPackages,
  getDemoReviews,
  getFeaturedPhotographers,
} from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title:
    "ShapeMyMoment — You Enjoy the Moment. We Handle Everything Else.",
  description:
    "From planning to the final detail, ShapeMyMoment brings your entire event together — so you can stop worrying and start enjoying.",
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  const eventTypes = getDemoEventTypes();
  const packages = getDemoPackages();
  const photographers = getFeaturedPhotographers(4);
  const reviews = getDemoReviews({ featured: true });

  return (
    <>
      <HeroSection />
      <WhatWeDo />
      <section className="pb-4">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            You bring the idea. We bring it to life.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Tell us what you&apos;re imagining, your budget, your date and your
            vision. We&apos;ll bring together the right people, services and
            details to make it happen.
          </p>
        </div>
      </section>
      <EventTypesGrid types={[...eventTypes]} />
      <TrustSection />
      <FeaturedPackages packages={[...packages]} />
      <FeaturedPhotographers photographers={[...photographers]} />
      <ReviewsSection reviews={[...reviews]} />
      <FinalCta />
    </>
  );
}

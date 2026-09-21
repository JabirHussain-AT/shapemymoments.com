import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/hero-section";
import {
  WhatWeDo,
  EventTypesGrid,
  TrustSection,
  FeaturedPackages,
  ReviewsSection,
  FinalCta,
} from "@/components/home/home-sections";
import { CreativeShowcase } from "@/components/home/creative-showcase";
import {
  getDemoEventTypes,
  getDemoPackages,
  getDemoReviews,
  getLiveCreativesFromDb,
} from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

import { HiringSection } from "@/components/home/hiring-section";

export const metadata: Metadata = {
  title:
    "ShapeMyMoment — South India's Growing Event & Creative Network",
  description:
    "Discover South India's top Photographers, Artisanal Gift Hampers, Henna Designers & Makeup Artists. Plan your event seamlessly.",
  alternates: { canonical: absoluteUrl("/") },
};

export default async function HomePage() {
  const eventTypes = getDemoEventTypes();
  const packages = getDemoPackages();
  const creatives = await getLiveCreativesFromDb();
  const reviews = getDemoReviews({ featured: true });

  return (
    <>
      <HeroSection />
      <CreativeShowcase creatives={[...creatives]} />
      <WhatWeDo />
      <section className="pb-4 pt-10">
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
      <ReviewsSection reviews={[...reviews]} />
      <HiringSection />
      <FinalCta />
    </>
  );
}

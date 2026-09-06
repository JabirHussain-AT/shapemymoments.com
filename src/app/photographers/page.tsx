import type { Metadata } from "next";
import { PhotographerDirectory } from "@/components/photographers/directory";
import { getDemoPhotographers } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ShapeMyMoments Photographers — Find the Perfect Photographer",
  description:
    "Browse verified event photographers. Filter by location, event type, price and rating — or include photography in your full event plan.",
  alternates: { canonical: absoluteUrl("/photographers") },
  openGraph: {
    title: "Find Photographers | ShapeMyMoments",
    description: "Discover trusted photographers for your celebration.",
  },
};

export default function PhotographersPage() {
  const photographers = getDemoPhotographers();

  return (
    <div className="section-padding pt-10">
      <div className="container-page">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Photographer marketplace
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find the perfect photographer
          </h1>
          <p className="mt-3 text-muted-foreground">
            Browse portfolios, compare packages and request the right creative —
            or let ShapeMyMoments include photography in your full event plan.
          </p>
        </div>
        <PhotographerDirectory initial={[...photographers]} />
      </div>
    </div>
  );
}

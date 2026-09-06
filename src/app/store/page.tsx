import type { Metadata } from "next";
import {
  ComingSoonTeaser,
  STORE_CATEGORIES,
} from "@/components/coming-soon/teaser";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Event Store — Coming Soon",
  description:
    "We're building a curated collection of decorations, party supplies, gifts and invitations.",
  alternates: { canonical: absoluteUrl("/store") },
};

export default function StorePage() {
  return (
    <ComingSoonTeaser
      title="The party essentials are coming."
      description="We're building a curated collection of everything you'll need to make your celebration unforgettable."
      categories={STORE_CATEGORIES}
      interest="store"
    />
  );
}

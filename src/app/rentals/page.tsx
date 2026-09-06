import type { Metadata } from "next";
import {
  ComingSoonTeaser,
  RENTAL_CATEGORIES,
} from "@/components/coming-soon/teaser";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rentals — Coming Soon",
  description:
    "Everything you need without buying everything — furniture, lighting, sound, décor and event equipment rentals.",
  alternates: { canonical: absoluteUrl("/rentals") },
};

export default function RentalsPage() {
  return (
    <ComingSoonTeaser
      title="Everything you need. Without buying everything."
      description="A premium rental marketplace for chairs, tables, lighting, sound, backdrops, photo booths and more — launching soon."
      categories={RENTAL_CATEGORIES}
      interest="rentals"
    />
  );
}

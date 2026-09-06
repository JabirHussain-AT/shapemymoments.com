import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ShapeMyMoments exists because people spend too much time worrying about events instead of enjoying them. Mission: make celebrations effortless.",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return (
    <div className="section-padding pt-10">
      <div className="container-page max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          About ShapeMyMoments
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Make celebrations effortless.
        </h1>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            ShapeMyMoments exists because people spend too much time worrying
            about events instead of enjoying them.
          </p>
          <p>
            We bring planning, vendors, photography, rentals and future event
            products into one ecosystem — so you can hand over the stress and
            stay present for the moments that matter.
          </p>
          <p>
            We are not another event vendor directory. We are your event partner:
            we help you <strong className="text-foreground">plan</strong>,{" "}
            <strong className="text-foreground">source</strong>,{" "}
            <strong className="text-foreground">arrange</strong>,{" "}
            <strong className="text-foreground">coordinate</strong>,{" "}
            <strong className="text-foreground">manage</strong> and{" "}
            <strong className="text-foreground">celebrate</strong>.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Mission
            </p>
            <p className="mt-3 text-xl font-bold">Make celebrations effortless.</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Vision
            </p>
            <p className="mt-3 text-xl font-bold">
              Become the trusted destination for planning and experiencing
              unforgettable moments.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link href="/plan-event">
            <Button size="lg">Plan My Event</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

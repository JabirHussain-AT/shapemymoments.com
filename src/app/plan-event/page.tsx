import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanEventWizard } from "@/components/forms/plan-event-wizard";
import { LoadingSpinner } from "@/components/ui/section";
import { absoluteUrl } from "@/lib/utils";
import { PlanEventAtmosphere } from "@/components/forms/plan-event-atmosphere";

export const metadata: Metadata = {
  title: "Plan Your Event",
  description:
    "Tell ShapeMyMoment what you're celebrating. We'll create a customized event plan and quotation.",
  alternates: { canonical: absoluteUrl("/plan-event") },
  openGraph: {
    title: "Plan Your Event | ShapeMyMoment",
    description: "Custom event planning from idea to celebration.",
  },
};

export default function PlanEventPage() {
  return (
    <div className="relative section-padding pt-10">
      <PlanEventAtmosphere />
      <div className="container-page relative">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Custom event planning &amp; WhatsApp Concierge
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Plan Your Event
          </h1>
          <p className="mt-3 text-muted-foreground">
            Tell us what you want — ShapeMyMoment takes care of the rest.
          </p>

          {/* Direct WhatsApp Callout Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-emerald-900 shadow-xs">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
              💬
            </span>
            <div className="text-left text-xs sm:text-sm">
              <p className="font-extrabold">Instant WhatsApp Planning &amp; Hotline:</p>
              <a
                href="https://wa.me/918089909386?text=Hi%20ShapeMyMoment!%20I%20want%20to%20plan%20an%20event."
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 underline hover:text-emerald-800"
              >
                +91 80899 09386
              </a>
            </div>
            <a
              href="https://wa.me/918089909386?text=Hi%20ShapeMyMoment!%20I%20want%20to%20plan%20an%20event."
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          }
        >
          <PlanEventWizard />
        </Suspense>
      </div>
    </div>
  );
}

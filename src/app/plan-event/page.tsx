import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanEventWizard } from "@/components/forms/plan-event-wizard";
import { LoadingSpinner } from "@/components/ui/section";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Plan Your Event",
  description:
    "Tell ShapeMyMoments what you're celebrating. We'll create a customized event plan and quotation.",
  alternates: { canonical: absoluteUrl("/plan-event") },
  openGraph: {
    title: "Plan Your Event | ShapeMyMoments",
    description: "Custom event planning from idea to celebration.",
  },
};

export default function PlanEventPage() {
  return (
    <div className="section-padding pt-10">
      <div className="container-page">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Custom event planning
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Plan Your Event
          </h1>
          <p className="mt-3 text-muted-foreground">
            Tell us what you want — ShapeMyMoments takes care of the rest.
          </p>
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

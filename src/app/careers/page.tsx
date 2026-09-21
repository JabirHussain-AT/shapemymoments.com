import type { Metadata } from "next";
import { HiringSection } from "@/components/home/hiring-section";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Careers — ShapeMyMoment",
  description:
    "Explore career opportunities at ShapeMyMoment. View vacancy status and submit open applications for future openings across South India.",
  alternates: { canonical: absoluteUrl("/careers") },
};

export default function CareersPage() {
  return (
    <div className="py-8 min-h-[70vh]">
      <HiringSection />
    </div>
  );
}

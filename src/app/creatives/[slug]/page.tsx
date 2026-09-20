import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreativeProfileView } from "@/components/creatives/profile-view";
import { getDemoCreative, getDemoReviews } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getDemoCreative(slug);
  if (!c) return { title: "Creative Profile Not Found" };
  return {
    title: `${c.name} — ${c.category} | ShapeMyMoment`,
    description: c.bio,
    alternates: { canonical: absoluteUrl(`/creatives/${slug}`) },
    openGraph: {
      title: `${c.name} (${c.category}) | ShapeMyMoment`,
      description: c.bio,
      images: [c.coverImage],
    },
  };
}

export default async function CreativeProfilePage({ params }: Props) {
  const { slug } = await params;
  const creative = getDemoCreative(slug);
  if (!creative) notFound();

  const reviews = getDemoReviews({ photographerId: creative.id });

  return <CreativeProfileView creative={creative} reviews={[...reviews]} />;
}

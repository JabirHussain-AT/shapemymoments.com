import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotographerProfile } from "@/components/photographers/profile";
import { getDemoPhotographer, getDemoReviews } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getDemoPhotographer(slug);
  if (!p) return { title: "Photographer Not Found" };
  return {
    title: `${p.name} — Photographer`,
    description: p.bio,
    alternates: { canonical: absoluteUrl(`/photographers/${slug}`) },
    openGraph: {
      title: `${p.name} | ShapeMyMoment`,
      description: p.bio,
      images: [p.coverImage],
    },
  };
}

export default async function PhotographerProfilePage({ params }: Props) {
  const { slug } = await params;
  const photographer = getDemoPhotographer(slug);
  if (!photographer) notFound();

  const reviews = getDemoReviews({ photographerId: photographer.id });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: photographer.name,
    description: photographer.bio,
    image: photographer.profilePhoto,
    address: photographer.location,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: photographer.rating,
      reviewCount: photographer.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PhotographerProfile
        photographer={photographer}
        reviews={[...reviews]}
      />
    </>
  );
}

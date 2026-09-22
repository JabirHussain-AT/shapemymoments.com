import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotographerProfile } from "@/components/photographers/profile";
import { type DemoPhotographer, type DemoReview } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { connectDB } from "@/lib/mongodb";
import { Photographer, Review } from "@/models";

type Props = { params: Promise<{ slug: string }> };

async function getPhotographer(slug: string): Promise<DemoPhotographer | null> {
  try {
    await connectDB();
    const isObjectId = Boolean(slug.match(/^[0-9a-fA-F]{24}$/));
    const query = isObjectId ? { _id: slug } : { slug };
    const p = (await Photographer.findOne(query).lean()) as Record<string, unknown> | null;
    if (p) {
      return {
        id: String(p._id),
        slug: String(p.slug),
        name: String(p.name),
        phone: p.phone ? String(p.phone) : "",
        category: String(p.category || "Photographers"),
        profilePhoto: String(p.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"),
        coverImage: String(p.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80"),
        location: String(p.location || ""),
        bio: String(p.bio || ""),
        experience: String(p.experience || (p.yearsOfExperience ? `${p.yearsOfExperience} years experience` : "")),
        yearsOfExperience: Number(p.yearsOfExperience || 0),
        specializations: Array.isArray(p.specializations) ? (p.specializations as string[]) : [],
        eventTypes: Array.isArray(p.eventTypes) ? (p.eventTypes as string[]) : [],
        startingPrice: Number(p.startingPrice || 0),
        rating: Number(p.rating || 0),
        reviewCount: Number(p.reviewCount || 0),
        verified: Boolean(p.verified),
        featured: Boolean(p.featured),
        status: String(p.status || "APPROVED"),
        serviceLocations: Array.isArray(p.serviceLocations) ? (p.serviceLocations as string[]) : [String(p.location || "")],
        availability: String(p.availability || "Available"),
        languages: Array.isArray(p.languages) ? (p.languages as string[]) : [],
        portfolio: Array.isArray(p.portfolio)
          ? p.portfolio
              .map((item: unknown) => ({
                url: typeof item === "string" ? item : String((item as { url?: string; image?: string })?.url || (item as { url?: string; image?: string })?.image || ""),
                caption: typeof item === "string" ? "" : String((item as { caption?: string; title?: string })?.caption || (item as { caption?: string; title?: string })?.title || ""),
                eventType: typeof item === "string" ? "Event" : String((item as { eventType?: string })?.eventType || "Event"),
              }))
              .filter((item: { url: string }) => Boolean(item.url))
          : [],
        packages: Array.isArray(p.packages)
          ? (p.packages as { name: string; price: number; description?: string; hours?: string; includes?: string[] }[])
          : [],
        bookedDates: Array.isArray(p.bookedDates) ? (p.bookedDates as string[]) : [],
        hourlyRate: Number(p.hourlyRate || 0),
        includes: Array.isArray(p.includes) ? (p.includes as string[]) : [],
        excludes: Array.isArray(p.excludes) ? (p.excludes as string[]) : [],
        guarantees: Array.isArray(p.guarantees) ? (p.guarantees as string[]) : [],
        socialLinks: (p.socialLinks as Record<string, string>) || {},
        subscriptionPlan: String(p.subscriptionPlan || "FREE"),
      };
    }
  } catch (err) {
    console.error("Failed to query MongoDB photographer:", err);
  }
  return null;
}

async function getReviews(photographerId: string) {
  try {
    await connectDB();
    const docs = await Review.find({ photographerId }).lean();
    if (docs && docs.length > 0) {
      return docs.map((r: Record<string, unknown>): DemoReview => ({
        id: String(r._id),
        name: String(r.name || "Client"),
        avatar: r.avatar ? String(r.avatar) : undefined,
        rating: Number(r.rating || 5),
        review: String(r.review || ""),
        eventType: String(r.eventType || "Event"),
        photographerId: String(r.photographerId || photographerId),
        status: String(r.status || "APPROVED"),
        featured: Boolean(r.featured),
        date: r.date ? new Date(r.date as string | number | Date).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.error("Failed to query MongoDB reviews:", err);
  }
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPhotographer(slug);
  if (!p) return { title: "Photographer Not Found" };
  return {
    title: `${p.name} — Photographer`,
    description: p.bio,
    alternates: { canonical: absoluteUrl(`/photographers/${slug}`) },
    openGraph: {
      title: `${p.name} | ShapeMyMoment`,
      description: p.bio,
      images: p.coverImage ? [p.coverImage] : [],
    },
  };
}

export default async function PhotographerProfilePage({ params }: Props) {
  const { slug } = await params;
  const photographer = await getPhotographer(slug);
  if (!photographer) notFound();

  const reviews = await getReviews(photographer.id);

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

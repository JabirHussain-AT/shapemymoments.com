import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreativeProfileView } from "@/components/creatives/profile-view";
import { getDemoCreative, getDemoReviews, type DemoCreative } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { connectDB } from "@/lib/mongodb";
import { Photographer, Review } from "@/models";

type Props = { params: Promise<{ slug: string }> };

async function getCreative(slug: string): Promise<DemoCreative | null> {
  try {
    await connectDB();
    const isObjectId = Boolean(slug.match(/^[0-9a-fA-F]{24}$/));
    const query = isObjectId ? { _id: slug } : { slug };
    const p: any = await Photographer.findOne(query).lean();
    if (p) {
      return {
        id: String(p._id),
        slug: p.slug,
        name: p.name,
        category: p.category || "Photographers",
        profilePhoto: p.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        coverImage: p.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80",
        location: p.location || "Wayanad, Kerala",
        bio: p.bio || "Creative partner profile with ShapeMyMoment.",
        experience: p.experience || `${p.yearsOfExperience || 1} years experience`,
        yearsOfExperience: p.yearsOfExperience || 1,
        specializations: Array.isArray(p.specializations) ? p.specializations : [],
        eventTypes: Array.isArray(p.eventTypes) ? p.eventTypes : ["Wedding", "Birthday"],
        startingPrice: p.startingPrice || 10000,
        rating: p.rating || 4.9,
        reviewCount: p.reviewCount || 0,
        verified: Boolean(p.verified),
        featured: Boolean(p.featured),
        status: p.status || "APPROVED",
        serviceLocations: Array.isArray(p.serviceLocations) ? p.serviceLocations : [p.location || "Wayanad"],
        availability: p.availability || "Available",
        languages: Array.isArray(p.languages) ? p.languages : ["English", "Malayalam"],
        portfolio: Array.isArray(p.portfolio)
          ? p.portfolio
              .map((item: any) => ({
                url: typeof item === "string" ? item : (item?.url || item?.image || ""),
                caption: typeof item === "string" ? "" : (item?.caption || item?.title || ""),
                eventType: typeof item === "string" ? "Event" : (item?.eventType || "Event"),
              }))
              .filter((item: any) => Boolean(item.url))
          : [],
        packages: Array.isArray(p.packages) ? p.packages : [],
        bookedDates: Array.isArray(p.bookedDates) ? p.bookedDates : [],
        hourlyRate: p.hourlyRate || Math.round((p.startingPrice || 10000) / 4),
        includes: Array.isArray(p.includes)
          ? p.includes
          : [
              "High-resolution edited digital photos & files",
              "Professional lighting & camera equipment",
              "Color correction & artistic retouching",
              "Full digital cloud album link",
              "Pre-event consultation & timeline planning",
            ],
        excludes: Array.isArray(p.excludes)
          ? p.excludes
          : [
              "Travel & outstation accommodation beyond 100km radius",
              "Printed physical albums (available as add-on)",
              "Additional overtime hours beyond agreed schedule",
            ],
        guarantees: Array.isArray(p.guarantees)
          ? p.guarantees
          : [
              "ShapeMyMoment 100% On-Time Service Delivery Guarantee",
              "Direct Concierge Booking & Price Protection (Zero hidden fees)",
              "Verified Partner Checkmark & Quality Audit",
              "Secure Payment Escrow Protection",
            ],
        socialLinks: p.socialLinks || {},
        subscriptionPlan: p.subscriptionPlan || "FREE",
      };
    }
  } catch (err) {
    console.error("Failed to query MongoDB creative:", err);
  }
  return getDemoCreative(slug);
}

async function getReviews(creativeId: string) {
  try {
    await connectDB();
    const docs = await Review.find({ photographerId: creativeId }).lean();
    if (docs && docs.length > 0) {
      return docs.map((r: any) => ({
        id: String(r._id),
        name: r.name,
        avatar: r.avatar,
        rating: r.rating,
        review: r.review,
        eventType: r.eventType,
        photographerId: String(r.photographerId || creativeId),
        status: r.status,
        featured: Boolean(r.featured),
        date: r.date ? new Date(r.date).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.error("Failed to query MongoDB reviews:", err);
  }
  return getDemoReviews({ photographerId: creativeId });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCreative(slug);
  if (!c) return { title: "Creative Profile Not Found" };
  return {
    title: `${c.name} — ${c.category} | ShapeMyMoment`,
    description: c.bio,
    alternates: { canonical: absoluteUrl(`/creatives/${slug}`) },
    openGraph: {
      title: `${c.name} (${c.category}) | ShapeMyMoment`,
      description: c.bio,
      images: c.coverImage ? [c.coverImage] : [],
    },
  };
}

export default async function CreativeProfilePage({ params }: Props) {
  const { slug } = await params;
  const creative = await getCreative(slug);
  if (!creative) notFound();

  const reviews = await getReviews(creative.id);

  return <CreativeProfileView creative={creative} reviews={[...reviews]} />;
}

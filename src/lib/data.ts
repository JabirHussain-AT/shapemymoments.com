import {
  DEMO_EVENT_TYPES,
  DEMO_PACKAGES,
  DEMO_PHOTOGRAPHERS,
  DEMO_CREATIVES,
  DEMO_REVIEWS,
  DEMO_FAQS,
  DEMO_EVENT_REQUESTS,
} from "@/lib/demo-data";

export type DemoCreative = {
  id: string;
  slug: string;
  name: string;
  category: string;
  profilePhoto: string;
  coverImage?: string;
  location: string;
  bio: string;
  experience?: string;
  yearsOfExperience: number;
  specializations: string[];
  eventTypes: string[];
  startingPrice: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  status: string;
  serviceLocations: string[];
  availability?: string;
  languages?: string[];
  portfolio?: Array<{
    url?: string;
    image?: string;
    title?: string;
    category?: string;
    caption?: string;
    eventType?: string;
  }>;
  packages?: Array<{
    name: string;
    price: number;
    description?: string;
    hours?: string;
    includes?: string[];
  }>;
  bookedDates?: string[];
  hourlyRate?: number;
  includes?: string[];
  excludes?: string[];
  guarantees?: string[];
  socialLinks?: Record<string, string>;
  subscriptionPlan?: string;
  profileViews?: number;
  portfolioViews?: number;
};

export type DemoPhotographer = DemoCreative;

export type DemoPackage = {
  id: string;
  name: string;
  slug: string;
  description: string;
  startingPrice: number;
  eventTypes: string[];
  services: string[];
  images: string[];
  highlights: string[];
  featured: boolean;
  active: boolean;
};

export type DemoReview = {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  review: string;
  eventType: string;
  photographerId?: string;
  packageId?: string;
  status: string;
  featured: boolean;
  date: string;
};

export type DemoEventRequest = {
  id: string;
  requestId: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount: number;
  budget: number;
  notes?: string;
  status: string;
  createdAt: string;
};

export function getDemoCreatives(filters?: {
  category?: string;
  q?: string;
  location?: string;
  eventType?: string;
  minExperience?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: string;
  sort?: string;
}): DemoCreative[] {
  let list: DemoCreative[] = [...(DEMO_CREATIVES as DemoCreative[])].filter((c) => c.status === "APPROVED");

  if (filters?.category && filters.category !== "All") {
    const cat = filters.category.toLowerCase();
    list = list.filter((c) => c.category.toLowerCase() === cat);
  }

  if (filters?.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.specializations.some((s: string) => s.toLowerCase().includes(q))
    );
  }
  if (filters?.location) {
    const loc = filters.location.toLowerCase();
    list = list.filter(
      (c) =>
        c.location.toLowerCase().includes(loc) ||
        c.serviceLocations.some((s: string) => s.toLowerCase().includes(loc))
    );
  }
  if (filters?.eventType) {
    list = list.filter((c) =>
      (c.eventTypes as readonly string[]).includes(filters.eventType!)
    );
  }
  if (filters?.minExperience) {
    list = list.filter((c) => c.yearsOfExperience >= filters.minExperience!);
  }
  if (filters?.maxPrice) {
    list = list.filter((c) => c.startingPrice <= filters.maxPrice!);
  }
  if (filters?.minRating) {
    list = list.filter((c) => c.rating >= filters.minRating!);
  }

  switch (filters?.sort) {
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "experience":
      list.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
      break;
    case "price-asc":
      list.sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case "price-desc":
      list.sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    default:
      list.sort((a, b) => {
        if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
        return b.rating - a.rating;
      });
  }

  return list;
}

export function getDemoCreative(slug: string): DemoCreative | null {
  return (
    (DEMO_CREATIVES as DemoCreative[]).find(
      (c: DemoCreative) => c.slug === slug || c.id === slug
    ) || null
  );
}

export function getDemoPhotographers(filters?: {
  q?: string;
  location?: string;
  eventType?: string;
  minExperience?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: string;
  sort?: string;
}): DemoPhotographer[] {
  let list = (DEMO_PHOTOGRAPHERS as DemoPhotographer[]).filter((p) => p.status === "APPROVED");

  if (filters?.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.specializations.some((s: string) => s.toLowerCase().includes(q))
    );
  }
  if (filters?.location) {
    const loc = filters.location.toLowerCase();
    list = list.filter(
      (p) =>
        p.location.toLowerCase().includes(loc) ||
        p.serviceLocations.some((s: string) => s.toLowerCase().includes(loc))
    );
  }
  if (filters?.eventType) {
    list = list.filter((p) =>
      (p.eventTypes as readonly string[]).includes(filters.eventType!)
    );
  }
  if (filters?.minExperience) {
    list = list.filter((p) => p.yearsOfExperience >= filters.minExperience!);
  }
  if (filters?.maxPrice) {
    list = list.filter((p) => p.startingPrice <= filters.maxPrice!);
  }
  if (filters?.minRating) {
    list = list.filter((p) => p.rating >= filters.minRating!);
  }

  switch (filters?.sort) {
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "experience":
      list.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
      break;
    case "price-asc":
      list.sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case "price-desc":
      list.sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    default:
      list.sort((a, b) => {
        if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
        return b.rating - a.rating;
      });
  }

  return list;
}

export function getDemoPhotographer(slug: string): DemoPhotographer | null {
  return ((DEMO_PHOTOGRAPHERS as DemoPhotographer[]).find((p) => p.slug === slug) as DemoPhotographer) || null;
}

export function getDemoPackages(): DemoPackage[] {
  return (DEMO_PACKAGES as DemoPackage[]).filter((p) => p.active);
}

export function getDemoPackage(slug: string): DemoPackage | null {
  return (DEMO_PACKAGES as DemoPackage[]).find((p) => p.slug === slug) || null;
}

export function getDemoReviews(opts?: {
  photographerId?: string;
  packageId?: string;
  featured?: boolean;
}): DemoReview[] {
  let list: DemoReview[] = (DEMO_REVIEWS as DemoReview[]).filter((r) => r.status === "APPROVED").map(
    (r) => ({
      id: r.id,
      name: r.name,
      avatar: "avatar" in r ? r.avatar : undefined,
      rating: r.rating,
      review: r.review,
      eventType: r.eventType,
      photographerId: "photographerId" in r ? r.photographerId : undefined,
      packageId: "packageId" in r ? r.packageId : undefined,
      status: r.status,
      featured: r.featured,
      date: r.date,
    })
  );
  if (opts?.photographerId) {
    list = list.filter((r) => r.photographerId === opts.photographerId);
  }
  if (opts?.packageId) {
    list = list.filter((r) => r.packageId === opts.packageId);
  }
  if (opts?.featured) {
    list = list.filter((r) => r.featured);
  }
  return list;
}

export function getDemoEventTypes() {
  return DEMO_EVENT_TYPES;
}

export function getDemoFaqs() {
  return DEMO_FAQS;
}

export function getDemoEventRequests(): DemoEventRequest[] {
  return DEMO_EVENT_REQUESTS as DemoEventRequest[];
}

export async function getLiveCreativesFromDb(): Promise<DemoCreative[]> {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Photographer } = await import("@/models");
    await connectDB();
    const docs = await Photographer.find().sort({ createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((p: any) => ({
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
              "High-resolution edited digital photos",
              "Professional lighting & camera gear",
              "Color correction & retouching",
              "Full digital cloud album link",
              "Pre-event consultation & timeline planning",
            ],
        excludes: Array.isArray(p.excludes)
          ? p.excludes
          : [
              "Travel & accommodation beyond 100km radius",
              "Printed physical photo albums (available as add-on)",
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
      }));
    }
  } catch (err) {
    console.warn("MongoDB query error in getLiveCreativesFromDb:", err);
  }
  return getDemoCreatives();
}

export const SITE_DEFAULTS = {
  name: "ShapeMyMoment",
  tagline: "You enjoy the moment. We handle everything else.",
  email: "help@shapemymoment.com",
  phone: "+91 80899 09386",
  address: "Kalpetta, Wayanad, Kerala",
  hero: {
    headline: "Your Moment.\nOur Responsibility.",
    subheadline:
      "From the first idea to the final celebration, we plan, arrange and coordinate everything — so you can be fully present for the moments that matter.",
    primaryCta: "Plan My Event",
    secondaryCta: "Meet Our Photographers",
  },
};

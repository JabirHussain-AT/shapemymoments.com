import {
  DEMO_EVENT_TYPES,
  DEMO_PACKAGES,
  DEMO_PHOTOGRAPHERS,
  DEMO_REVIEWS,
  DEMO_FAQS,
  DEMO_EVENT_REQUESTS,
} from "@/lib/demo-data";

export type DemoPhotographer = (typeof DEMO_PHOTOGRAPHERS)[number];
export type DemoPackage = (typeof DEMO_PACKAGES)[number];
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

export function getDemoPhotographers(filters?: {
  q?: string;
  location?: string;
  eventType?: string;
  minExperience?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: string;
  sort?: string;
}) {
  let list = [...DEMO_PHOTOGRAPHERS].filter((p) => p.status === "APPROVED");

  if (filters?.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.specializations.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (filters?.location) {
    const loc = filters.location.toLowerCase();
    list = list.filter(
      (p) =>
        p.location.toLowerCase().includes(loc) ||
        p.serviceLocations.some((s) => s.toLowerCase().includes(loc))
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
  if (filters?.availability) {
    list = list.filter(
      (p) => p.availability.toLowerCase() === filters.availability!.toLowerCase()
    );
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
    case "featured":
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
    default:
      list.sort((a, b) => {
        if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
        return b.rating - a.rating;
      });
  }

  return list;
}

export function getDemoPhotographer(slug: string) {
  return DEMO_PHOTOGRAPHERS.find((p) => p.slug === slug) || null;
}

export function getDemoPackages() {
  return DEMO_PACKAGES.filter((p) => p.active);
}

export function getDemoPackage(slug: string) {
  return DEMO_PACKAGES.find((p) => p.slug === slug) || null;
}

export function getDemoReviews(opts?: {
  photographerId?: string;
  packageId?: string;
  featured?: boolean;
}): DemoReview[] {
  let list: DemoReview[] = DEMO_REVIEWS.filter((r) => r.status === "APPROVED").map(
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

export function getDemoEventRequests() {
  return DEMO_EVENT_REQUESTS;
}

export function getFeaturedPhotographers(limit = 4) {
  return getDemoPhotographers({ sort: "featured" }).slice(0, limit);
}

export const SITE_DEFAULTS = {
  name: "ShapeMyMoment",
  tagline: "You enjoy the moment. We handle everything else.",
  email: "hello@shapemymoment.com",
  phone: "+91 98765 43210",
  address: "Kalpetta, Wayanad, Kerala",
  hero: {
    headline: "Your Moment.\nOur Responsibility.",
    subheadline:
      "From the first idea to the final celebration, we plan, arrange and coordinate everything — so you can be fully present for the moments that matter.",
    primaryCta: "Plan My Event",
    secondaryCta: "Meet Our Photographers",
  },
};

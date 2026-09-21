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

export function filterCreativesList<T extends DemoCreative>(
  sourceList: T[],
  filters?: {
    category?: string;
    q?: string;
    location?: string;
    eventType?: string;
    minExperience?: number;
    maxPrice?: number;
    minRating?: number;
    availability?: string;
    sort?: string;
  }
): T[] {
  let list = [...sourceList].filter((c) => c.status === "APPROVED" || !c.status);

  if (filters?.category && filters.category !== "All") {
    const cat = filters.category.toLowerCase().trim();
    list = list.filter((c) => {
      const cCat = (c.category || "").toLowerCase();
      if (cat === "henna artists" && (cCat === "henna designers" || cCat === "henna artists")) return true;
      if (cat === "hamper makers" && (cCat === "hampers" || cCat === "hamper makers")) return true;
      return cCat === cat;
    });
  }

  if (filters?.q) {
    const q = filters.q.toLowerCase().trim();
    list = list.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.location || "").toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q) ||
        (c.specializations && c.specializations.some((s: string) => s.toLowerCase().includes(q)))
    );
  }

  if (filters?.location) {
    const rawLoc = filters.location.toLowerCase().trim();
    if (rawLoc && rawLoc !== "all" && rawLoc !== "all south india") {
      // Related region keywords mapping for flexible matching
      const locTerms: string[] = [rawLoc];
      if (rawLoc.includes("wayanad")) {
        locTerms.push("kalpetta", "bathery", "mananthavady", "kerala");
      } else if (rawLoc.includes("kalpetta") || rawLoc.includes("bathery") || rawLoc.includes("mananthavady")) {
        locTerms.push("wayanad");
      }
      if (rawLoc.includes("kochi") || rawLoc.includes("ernakulam")) {
        locTerms.push("kochi", "ernakulam");
      }

      list = list.filter((c) => {
        const cLoc = (c.location || "").toLowerCase();
        const cServiceLocs = Array.isArray(c.serviceLocations)
          ? c.serviceLocations.map((s: string) => s.toLowerCase())
          : [];
        return locTerms.some(
          (term) => cLoc.includes(term) || cServiceLocs.some((s) => s.includes(term))
        );
      });
    }
  }

  if (filters?.eventType) {
    list = list.filter((c) =>
      Array.isArray(c.eventTypes) && c.eventTypes.includes(filters.eventType!)
    );
  }

  if (filters?.minExperience) {
    list = list.filter((c) => Number(c.yearsOfExperience || 0) >= filters.minExperience!);
  }

  if (filters?.maxPrice) {
    list = list.filter((c) => Number(c.startingPrice || 0) <= filters.maxPrice!);
  }

  if (filters?.minRating) {
    list = list.filter((c) => Number(c.rating || 0) >= filters.minRating!);
  }

  if (filters?.availability) {
    list = list.filter((c) => c.availability === filters.availability);
  }

  switch (filters?.sort) {
    case "rating":
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;
    case "experience":
      list.sort((a, b) => Number(b.yearsOfExperience || 0) - Number(a.yearsOfExperience || 0));
      break;
    case "price-asc":
      list.sort((a, b) => Number(a.startingPrice || 0) - Number(b.startingPrice || 0));
      break;
    case "price-desc":
      list.sort((a, b) => Number(b.startingPrice || 0) - Number(a.startingPrice || 0));
      break;
    default:
      list.sort((a, b) => {
        if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
        return Number(b.rating || 0) - Number(a.rating || 0);
      });
  }

  return list;
}

type CreativeFilters = {
  category?: string;
  q?: string;
  location?: string;
  eventType?: string;
  minExperience?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: string;
  sort?: string;
};

export function getDemoCreatives(
  sourceListOrFilters?: DemoCreative[] | CreativeFilters,
  filters?: CreativeFilters
): DemoCreative[] {
  if (Array.isArray(sourceListOrFilters)) {
    return filterCreativesList(sourceListOrFilters, filters);
  }
  return filterCreativesList(DEMO_CREATIVES as DemoCreative[], sourceListOrFilters);
}

export function getDemoCreative(slug: string): DemoCreative | null {
  return (
    (DEMO_CREATIVES as DemoCreative[]).find(
      (c: DemoCreative) => c.slug === slug || c.id === slug
    ) || null
  );
}

export function getDemoPhotographers(
  sourceListOrFilters?: DemoPhotographer[] | CreativeFilters,
  filters?: CreativeFilters
): DemoPhotographer[] {
  if (Array.isArray(sourceListOrFilters)) {
    return filterCreativesList(sourceListOrFilters, filters);
  }
  return filterCreativesList(DEMO_PHOTOGRAPHERS as DemoPhotographer[], sourceListOrFilters);
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
      return docs.map((p: Record<string, unknown>) => ({
        id: String(p._id),
        slug: String(p.slug),
        name: String(p.name),
        category: String(p.category || "Photographers"),
        profilePhoto: String(p.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"),
        coverImage: String(p.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80"),
        location: String(p.location || "Wayanad, Kerala"),
        bio: String(p.bio || "Creative partner profile with ShapeMyMoment."),
        experience: String(p.experience || `${p.yearsOfExperience || 1} years experience`),
        yearsOfExperience: Number(p.yearsOfExperience || 1),
        specializations: Array.isArray(p.specializations) ? (p.specializations as string[]) : [],
        eventTypes: Array.isArray(p.eventTypes) ? (p.eventTypes as string[]) : ["Wedding", "Birthday"],
        startingPrice: Number(p.startingPrice || 10000),
        rating: Number(p.rating || 4.9),
        reviewCount: Number(p.reviewCount || 0),
        verified: Boolean(p.verified),
        featured: Boolean(p.featured),
        status: String(p.status || "APPROVED"),
        serviceLocations: Array.isArray(p.serviceLocations) ? (p.serviceLocations as string[]) : [String(p.location || "Wayanad")],
        availability: String(p.availability || "Available"),
        languages: Array.isArray(p.languages) ? (p.languages as string[]) : ["English", "Malayalam"],
        portfolio: Array.isArray(p.portfolio)
          ? p.portfolio
              .map((item: unknown) => {
                const url = typeof item === "string" ? item : String((item as { url?: string; image?: string })?.url || (item as { url?: string; image?: string })?.image || "");
                const caption = typeof item === "string" ? "" : String((item as { caption?: string; title?: string })?.caption || (item as { caption?: string; title?: string })?.title || "");
                const eventType = typeof item === "string" ? "Event" : String((item as { eventType?: string })?.eventType || "Event");
                return { url, caption, eventType };
              })
              .filter((item: { url: string }) => Boolean(item.url))
          : [],
        packages: Array.isArray(p.packages)
          ? (p.packages as { name: string; price: number; description?: string; hours?: string; includes?: string[] }[])
          : [],
        bookedDates: Array.isArray(p.bookedDates) ? (p.bookedDates as string[]) : [],
        hourlyRate: Number(p.hourlyRate || Math.round((Number(p.startingPrice) || 10000) / 4)),
        includes: Array.isArray(p.includes)
          ? (p.includes as string[])
          : [
              "High-resolution edited digital photos",
              "Professional lighting & camera gear",
              "Color correction & retouching",
              "Full digital cloud album link",
              "Pre-event consultation & timeline planning",
            ],
        excludes: Array.isArray(p.excludes)
          ? (p.excludes as string[])
          : [
              "Travel & accommodation beyond 100km radius",
              "Printed physical photo albums (available as add-on)",
              "Additional overtime hours beyond agreed schedule",
            ],
        guarantees: Array.isArray(p.guarantees)
          ? (p.guarantees as string[])
          : [
              "ShapeMyMoment 100% On-Time Service Delivery Guarantee",
              "Direct Concierge Booking & Price Protection (Zero hidden fees)",
              "Verified Partner Checkmark & Quality Audit",
              "Secure Payment Escrow Protection",
            ],
        socialLinks: (p.socialLinks as Record<string, string>) || {},
        subscriptionPlan: String(p.subscriptionPlan || "FREE"),
      }));
    }
  } catch (err) {
    console.warn("MongoDB query error in getLiveCreativesFromDb:", err);
  }
  return getDemoCreatives();
}

export async function getLiveUsersFromDb() {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { User } = await import("@/models");
    await connectDB();
    const docs = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((u: Record<string, unknown>) => ({
        id: String(u._id),
        name: String(u.name || "User"),
        email: String(u.email || ""),
        phone: u.phone ? String(u.phone) : undefined,
        role: String(u.role || "CUSTOMER"),
        isActive: Boolean(u.isActive ?? true),
        createdAt: u.createdAt ? new Date(u.createdAt as string | number | Date).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MongoDB query error in getLiveUsersFromDb:", err);
  }
  return [];
}

export async function getLiveEventRequestsFromDb(): Promise<DemoEventRequest[]> {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { EventRequest } = await import("@/models");
    await connectDB();
    const docs = await EventRequest.find().sort({ createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((r: Record<string, unknown>) => ({
        id: String(r._id),
        requestId: String(r.requestId || String(r._id).slice(-6)),
        name: String(r.name || "Client"),
        email: String(r.email || ""),
        phone: String(r.phone || ""),
        eventType: String(r.eventType || "Event"),
        eventDate: String(r.eventDate || ""),
        location: String(r.location || ""),
        guestCount: Number(r.guestCount || 0),
        budget: Number(r.budget || 0),
        notes: r.notes ? String(r.notes) : "",
        status: String(r.status || "NEW"),
        createdAt: r.createdAt ? new Date(r.createdAt as string | number | Date).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MongoDB query error in getLiveEventRequestsFromDb:", err);
  }
  return getDemoEventRequests();
}

export async function getLivePhotographerLeadsFromDb() {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { PhotographerLead } = await import("@/models");
    await connectDB();
    const docs = await PhotographerLead.find().sort({ createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((l: Record<string, unknown>) => ({
        id: String(l._id),
        photographerId: String(l.photographerId),
        name: String(l.name || "Client"),
        email: String(l.email || ""),
        phone: String(l.phone || ""),
        eventType: String(l.eventType || "Event"),
        eventDate: String(l.eventDate || ""),
        location: String(l.location || ""),
        hoursRequired: Number(l.hoursRequired || 1),
        budget: l.budget ? Number(l.budget) : undefined,
        message: String(l.message || ""),
        status: String(l.status || "NEW"),
        createdAt: l.createdAt ? new Date(l.createdAt as string | number | Date).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MongoDB query error in getLivePhotographerLeadsFromDb:", err);
  }
  return [];
}

export async function getLiveReviewsFromDb(): Promise<DemoReview[]> {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Review } = await import("@/models");
    await connectDB();
    const docs = await Review.find().sort({ createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((r: Record<string, unknown>): DemoReview => ({
        id: String(r._id),
        name: String(r.name || "Client"),
        avatar: r.avatar ? String(r.avatar) : undefined,
        rating: Number(r.rating || 5),
        review: String(r.review || ""),
        eventType: String(r.eventType || "Event"),
        photographerId: r.photographerId ? String(r.photographerId) : undefined,
        status: String(r.status || "APPROVED"),
        featured: Boolean(r.featured),
        date: r.date ? new Date(r.date as string | number | Date).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MongoDB query error in getLiveReviewsFromDb:", err);
  }
  return getDemoReviews();
}

export async function getLiveAdminStatsFromDb() {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { User, Photographer, EventRequest, PhotographerLead, Review } = await import("@/models");
    await connectDB();

    const [totalUsers, totalPhotographers, totalEventRequests, pendingEventRequests, totalLeads, totalReviews] = await Promise.all([
      User.countDocuments(),
      Photographer.countDocuments({ status: "APPROVED" }),
      EventRequest.countDocuments(),
      EventRequest.countDocuments({ status: "NEW" }),
      PhotographerLead.countDocuments(),
      Review.countDocuments(),
    ]);

    const recentRequestsDocs = await EventRequest.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentRequests = recentRequestsDocs.map((r: Record<string, unknown>) => ({
      id: String(r._id),
      requestId: String(r.requestId || String(r._id).slice(-6)),
      name: String(r.name || "Client"),
      eventType: String(r.eventType || "Event"),
      status: String(r.status || "NEW"),
    }));

    const recentPhotographersDocs = await Photographer.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentPhotographers = recentPhotographersDocs.map((p: Record<string, unknown>) => ({
      id: String(p._id),
      name: String(p.name),
      location: String(p.location),
      subscriptionPlan: String(p.subscriptionPlan || "FREE"),
      status: String(p.status || "APPROVED"),
      verified: Boolean(p.verified),
    }));

    return {
      totalUsers,
      totalPhotographers,
      totalEventRequests,
      pendingEventRequests,
      totalLeads,
      totalReviews,
      recentRequests,
      recentPhotographers,
    };
  } catch (err) {
    console.warn("MongoDB query error in getLiveAdminStatsFromDb:", err);
  }

  return {
    totalUsers: 0,
    totalPhotographers: 0,
    totalEventRequests: 0,
    pendingEventRequests: 0,
    totalLeads: 0,
    totalReviews: 0,
    recentRequests: [],
    recentPhotographers: [],
  };
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

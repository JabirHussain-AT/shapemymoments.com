import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  DEMO_EVENT_TYPES,
  DEMO_PACKAGES,
  DEMO_PHOTOGRAPHERS,
  DEMO_REVIEWS,
  DEMO_FAQS,
} from "../src/lib/demo-data";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required. Copy .env.example to .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB…");
  await mongoose.connect(uri);

  const User = mongoose.model(
    "User",
    new mongoose.Schema(
      {
        name: String,
        email: { type: String, unique: true },
        phone: String,
        passwordHash: String,
        role: String,
        isActive: { type: Boolean, default: true },
        shortlist: [{ type: mongoose.Schema.Types.ObjectId }],
      },
      { timestamps: true }
    )
  );

  const EventPackage = mongoose.model(
    "EventPackage",
    new mongoose.Schema(
      {
        name: String,
        slug: { type: String, unique: true },
        description: String,
        startingPrice: Number,
        eventTypes: [String],
        services: [String],
        images: [String],
        highlights: [String],
        featured: Boolean,
        active: Boolean,
      },
      { timestamps: true }
    )
  );

  const Photographer = mongoose.model(
    "Photographer",
    new mongoose.Schema(
      {
        slug: { type: String, unique: true },
        name: String,
        profilePhoto: String,
        coverImage: String,
        location: String,
        bio: String,
        experience: String,
        yearsOfExperience: Number,
        specializations: [String],
        eventTypes: [String],
        portfolio: [mongoose.Schema.Types.Mixed],
        startingPrice: Number,
        languages: [String],
        serviceLocations: [String],
        availability: String,
        packages: [mongoose.Schema.Types.Mixed],
        rating: Number,
        reviewCount: Number,
        socialLinks: mongoose.Schema.Types.Mixed,
        verified: Boolean,
        featured: Boolean,
        status: String,
        subscriptionPlan: String,
        profileViews: Number,
        portfolioViews: Number,
      },
      { timestamps: true }
    )
  );

  const Review = mongoose.model(
    "Review",
    new mongoose.Schema(
      {
        name: String,
        avatar: String,
        rating: Number,
        review: String,
        eventType: String,
        photographerSlug: String,
        packageSlug: String,
        status: String,
        featured: Boolean,
        date: Date,
      },
      { timestamps: true }
    )
  );

  const SiteSettings = mongoose.model(
    "SiteSettings",
    new mongoose.Schema(
      {
        hero: mongoose.Schema.Types.Mixed,
        contact: mongoose.Schema.Types.Mixed,
        social: mongoose.Schema.Types.Mixed,
        faqs: [mongoose.Schema.Types.Mixed],
        eventTypes: [mongoose.Schema.Types.Mixed],
        featuredPhotographerIds: [String],
        featuredReviewIds: [String],
        notifyEmails: [mongoose.Schema.Types.Mixed],
      },
      { timestamps: true }
    )
  );

  const Subscription = mongoose.model(
    "Subscription",
    new mongoose.Schema(
      {
        photographerId: mongoose.Schema.Types.ObjectId,
        plan: String,
        status: String,
        priceMonthly: Number,
        features: [String],
        startDate: Date,
      },
      { timestamps: true }
    )
  );

  console.log("Clearing previous seed collections…");
  await Promise.all([
    User.deleteMany({
      email: {
        $in: [
          "admin@shapemymoment.com",
          "demo@shapemymoment.com",
        ],
      },
    }),
    EventPackage.deleteMany({}),
    Photographer.deleteMany({}),
    Review.deleteMany({}),
    SiteSettings.deleteMany({}),
    Subscription.deleteMany({}),
  ]);

  const adminHash = await bcrypt.hash("admin12345", 12);
  const demoHash = await bcrypt.hash("demo12345", 12);

  await User.create([
    {
      name: "Admin",
      email: "admin@shapemymoment.com",
      passwordHash: adminHash,
      role: "ADMIN",
      phone: "9876543210",
    },
    {
      name: "Demo Customer",
      email: "demo@shapemymoment.com",
      passwordHash: demoHash,
      role: "CUSTOMER",
      phone: "9876500000",
    },
  ]);

  await EventPackage.insertMany(
    DEMO_PACKAGES.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      startingPrice: p.startingPrice,
      eventTypes: [...p.eventTypes],
      services: [...p.services],
      images: [...p.images],
      highlights: [...p.highlights],
      featured: p.featured,
      active: p.active,
    }))
  );

  const photographers = await Photographer.insertMany(
    DEMO_PHOTOGRAPHERS.map((p) => ({
      slug: p.slug,
      name: p.name,
      profilePhoto: p.profilePhoto,
      coverImage: p.coverImage,
      location: p.location,
      bio: p.bio,
      experience: p.experience,
      yearsOfExperience: p.yearsOfExperience,
      specializations: [...p.specializations],
      eventTypes: [...p.eventTypes],
      portfolio: p.portfolio.map((item) => ({ ...item })),
      startingPrice: p.startingPrice,
      languages: [...p.languages],
      serviceLocations: [...p.serviceLocations],
      availability: p.availability,
      packages: p.packages.map((pkg) => ({
        ...pkg,
        includes: [...pkg.includes],
      })),
      rating: p.rating,
      reviewCount: p.reviewCount,
      socialLinks: { ...p.socialLinks },
      verified: p.verified,
      featured: p.featured,
      status: p.status,
      subscriptionPlan: p.subscriptionPlan,
      profileViews: p.profileViews,
      portfolioViews: p.portfolioViews,
    }))
  );

  const planPrices = { FREE: 0, PRO: 999, PREMIUM: 2499 } as const;
  await Subscription.insertMany(
    photographers.map((p, i) => {
      const plan = DEMO_PHOTOGRAPHERS[i].subscriptionPlan;
      return {
        photographerId: p._id,
        plan,
        status: "ACTIVE",
        priceMonthly: planPrices[plan],
        features: [],
        startDate: new Date(),
      };
    })
  );

  await Review.insertMany(
    DEMO_REVIEWS.map((r) => ({
      name: r.name,
      avatar: "avatar" in r ? r.avatar : undefined,
      rating: r.rating,
      review: r.review,
      eventType: r.eventType,
      photographerSlug: "photographerId" in r ? r.photographerId : undefined,
      packageSlug: "packageId" in r ? r.packageId : undefined,
      status: r.status,
      featured: r.featured,
      date: new Date(r.date),
    }))
  );

  await SiteSettings.create({
    hero: {
      headline: "Your Moment.\nOur Responsibility.",
      subheadline:
        "From the first idea to the final celebration, we plan, arrange and coordinate everything — so you can be fully present for the moments that matter.",
      primaryCta: "Plan My Event",
      secondaryCta: "Meet Our Photographers",
      tagline: "You enjoy the moment. We handle everything else.",
    },
    contact: {
      email: "hello@shapemymoment.com",
      phone: "+91 80899 09386",
      whatsapp: "918089909386",
      address: "Kalpetta, Wayanad, Kerala",
      city: "Kalpetta",
    },
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
    },
    faqs: DEMO_FAQS.map((f) => ({ ...f })),
    eventTypes: DEMO_EVENT_TYPES.map((t) => ({ ...t })),
    featuredPhotographerIds: DEMO_PHOTOGRAPHERS.filter((p) => p.featured).map(
      (p) => p.slug
    ),
    featuredReviewIds: DEMO_REVIEWS.filter((r) => r.featured).map((r) => r.id),
    notifyEmails: [],
  });

  console.log("Seed complete:");
  console.log(`- ${DEMO_PHOTOGRAPHERS.length} photographers`);
  console.log(`- ${DEMO_PACKAGES.length} packages`);
  console.log(`- ${DEMO_REVIEWS.length} reviews`);
  console.log(`- ${DEMO_EVENT_TYPES.length} event types`);
  console.log("- Admin: admin@shapemymoment.com / admin12345");
  console.log("- Customer: demo@shapemymoment.com / demo12345");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

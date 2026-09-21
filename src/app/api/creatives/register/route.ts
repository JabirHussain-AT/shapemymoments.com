import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User, Photographer, Subscription, Notification } from "@/models";
import { createSessionToken, hashPassword, setSessionCookie } from "@/lib/auth";
import { created, fail, handleApiError } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { PLAN_FEATURES, PLAN_PRICES } from "@/models/Subscription";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      category = "Photographers",
      location,
      startingPrice,
      bio = "",
      yearsOfExperience = 1,
      skills = "",
      profilePhoto,
      coverImage,
      portfolio = [],
      socialLinks = {},
      verifiedApproved = false,
    } = body;

    if (!name || !email) {
      return fail("Name and Email are required", 400);
    }

    if (!password || password.length < 8) {
      return fail("Password must be at least 8 characters long.", 400);
    }

    if (!/[a-zA-Z]/.test(password)) {
      return fail("Password must contain at least one letter.", 400);
    }

    if (!/[0-9]/.test(password)) {
      return fail("Password must contain at least one number.", 400);
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      return fail("Password must contain at least one special character (e.g. @, #, $, %, !).", 400);
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return fail("An account with this email address already exists.", 409);
    }

    const passwordHash = await hashPassword(password);

    // Create User record in MongoDB
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: "PHOTOGRAPHER",
    });

    const slug = slugify(name) + "-" + Math.random().toString(36).substring(2, 7);
    const specializationsList = typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(skills) ? skills : [];

    // Create Photographer/Creative document in MongoDB
    const photographer = await Photographer.create({
      userId: user._id,
      slug,
      name,
      profilePhoto:
        profilePhoto ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      coverImage:
        coverImage ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80",
      location: location || "Wayanad, Kerala",
      bio: bio || "Professional creative partner with ShapeMyMoment.",
      experience: `${yearsOfExperience} years of professional experience in ${category}`,
      yearsOfExperience: Number(yearsOfExperience) || 1,
      specializations: specializationsList.length > 0 ? specializationsList : [category],
      eventTypes: ["Wedding", "Birthday", "Engagement", "Custom Event"],
      portfolio: Array.isArray(portfolio)
        ? portfolio.map((item, idx) => ({
            url: item.url || item.image || "",
            caption: item.caption || item.title || `Work ${idx + 1}`,
            eventType: item.eventType || "Event",
            order: idx,
          }))
        : [],
      startingPrice: Number(startingPrice) || 0,
      languages: ["English", "Malayalam"],
      serviceLocations: location ? [location] : ["Wayanad", "Kozhikode", "Kochi"],
      availability: "Available",
      packages: [],
      socialLinks,
      verified: Boolean(verifiedApproved),
      featured: true,
      status: "APPROVED",
      subscriptionPlan: "FREE",
    });

    // Create default Subscription
    await Subscription.create({
      photographerId: photographer._id,
      userId: user._id,
      plan: "FREE",
      status: "ACTIVE",
      priceMonthly: PLAN_PRICES.FREE,
      features: PLAN_FEATURES.FREE,
    });

    // Create Admin Notification
    await Notification.create({
      type: "PHOTOGRAPHER_REGISTRATION",
      title: "New Creative Registration",
      message: `${name} (${category}) registered as a verified partner`,
      role: "ADMIN",
      link: "/admin/photographers",
    });

    // Generate session token so user can also access dashboard immediately
    const sessionUser = {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      photographerId: String(photographer._id),
    };
    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return created(
      {
        user: sessionUser,
        email: user.email,
        passwordSet: true,
        slug: photographer.slug,
        supportEmail: "help@shapemymoment.com",
      },
      "Creative profile and account created successfully!"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

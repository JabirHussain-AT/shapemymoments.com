import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User, Photographer, Review } from "@/models";
import { requireSession } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/api";

export async function GET() {
  try {
    const session = await requireSession(["PHOTOGRAPHER", "ADMIN", "SUPER_ADMIN"]);
    await connectDB();

    const user: any = await User.findById(session.id).select("-passwordHash").lean();
    if (!user) return fail("User account not found", 404);

    let photographer: any = await Photographer.findOne({ userId: user._id }).lean();

    if (!photographer) {
      // Fallback: try finding photographer by email match or create fallback doc
      photographer = await Photographer.findOne({ name: user.name }).lean();
    }

    if (!photographer) {
      const slug = user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
      const newDoc = await Photographer.create({
        userId: user._id,
        slug,
        name: user.name,
        profilePhoto: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80",
        location: "Wayanad, Kerala",
        bio: "Creative partner profile with ShapeMyMoment.",
        experience: "5 years experience",
        yearsOfExperience: 5,
        specializations: ["Creative"],
        eventTypes: ["Wedding", "Birthday", "Engagement"],
        portfolio: [],
        bookedDates: [],
        startingPrice: 10000,
        languages: ["English", "Malayalam"],
        serviceLocations: ["Wayanad"],
        availability: "Available",
        packages: [],
        status: "APPROVED",
        verified: false,
        featured: true,
        subscriptionPlan: "FREE",
      });
      photographer = newDoc.toObject();
    }

    const reviews = await Review.find({ photographerId: photographer._id }).sort({ createdAt: -1 }).lean();

    return ok({
      user,
      photographer,
      reviews: reviews || [],
      supportEmail: "help@shapemymoment.com",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return fail("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession(["PHOTOGRAPHER", "ADMIN", "SUPER_ADMIN"]);
    const body = await request.json();
    await connectDB();

    const {
      name,
      profilePhoto,
      coverImage,
      location,
      startingPrice,
      hourlyRate,
      bio,
      experience,
      yearsOfExperience,
      specializations,
      eventTypes,
      serviceLocations,
      languages,
      portfolio,
      bookedDates,
      packages,
      socialLinks,
      availability,
      includes,
      excludes,
      guarantees,
      dateNotes,
    } = body;

    const updateFields: Record<string, unknown> = {};
    if (name !== undefined) updateFields.name = name;
    if (profilePhoto !== undefined) updateFields.profilePhoto = profilePhoto;
    if (coverImage !== undefined) updateFields.coverImage = coverImage;
    if (location !== undefined) updateFields.location = location;
    if (startingPrice !== undefined) updateFields.startingPrice = Number(startingPrice);
    if (hourlyRate !== undefined) updateFields.hourlyRate = Number(hourlyRate);
    if (bio !== undefined) updateFields.bio = bio;
    if (experience !== undefined) updateFields.experience = experience;
    if (yearsOfExperience !== undefined) updateFields.yearsOfExperience = Number(yearsOfExperience);
    if (specializations !== undefined) {
      updateFields.specializations = Array.isArray(specializations)
        ? specializations
        : String(specializations).split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (eventTypes !== undefined) {
      updateFields.eventTypes = Array.isArray(eventTypes)
        ? eventTypes
        : String(eventTypes).split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (serviceLocations !== undefined) {
      updateFields.serviceLocations = Array.isArray(serviceLocations)
        ? serviceLocations
        : String(serviceLocations).split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (languages !== undefined) {
      updateFields.languages = Array.isArray(languages)
        ? languages
        : String(languages).split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (portfolio !== undefined) updateFields.portfolio = portfolio;
    if (bookedDates !== undefined) updateFields.bookedDates = bookedDates;
    if (packages !== undefined) updateFields.packages = packages;
    if (socialLinks !== undefined) updateFields.socialLinks = socialLinks;
    if (availability !== undefined) updateFields.availability = availability;
    if (includes !== undefined) updateFields.includes = includes;
    if (excludes !== undefined) updateFields.excludes = excludes;
    if (guarantees !== undefined) updateFields.guarantees = guarantees;
    if (dateNotes !== undefined) updateFields.dateNotes = dateNotes;

    const updatedPhotographer = await Photographer.findOneAndUpdate(
      { userId: session.id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (name !== undefined) {
      await User.findByIdAndUpdate(session.id, { name });
    }

    return ok(
      { photographer: updatedPhotographer, supportEmail: "help@shapemymoment.com" },
      "Profile & details updated successfully!"
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return fail("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}

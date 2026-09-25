import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { User, Photographer, Review } from "@/models";
import { requireSession, verifyPassword, hashPassword } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/api";

export async function GET() {
  try {
    const session = await requireSession(["PHOTOGRAPHER", "ADMIN", "SUPER_ADMIN"]);
    await connectDB();

    const user = (await User.findById(session.id).select("-passwordHash").lean()) as {
      _id: unknown;
      name?: string;
      email?: string;
      phone?: string;
      avatar?: string;
      role?: string;
    } | null;
    if (!user) return fail("User account not found", 404);

    const userName = String(user.name || "Partner");

    let photographer = (await Photographer.findOne({ userId: user._id }).lean()) as Record<string, unknown> | null;

    if (!photographer) {
      // Fallback: try finding photographer by email match or create fallback doc
      photographer = (await Photographer.findOne({ name: userName }).lean()) as Record<string, unknown> | null;
    }

    if (!photographer) {
      const slug = userName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
      const newDoc = await Photographer.create({
        userId: user._id,
        slug,
        name: userName,
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
      photographer = newDoc.toObject() as Record<string, unknown>;
    }

    if (!photographer) return fail("Photographer profile not found", 404);

    const reviews = await Review.find({ photographerId: photographer._id }).sort({ createdAt: -1 }).lean();

    return ok({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar,
        role: user.role,
      },
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
      phone,
      currentPassword,
      newPassword,
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

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return fail("Please enter your current password to set a new password", 400);
      }
      if (newPassword.length < 8) {
        return fail("New password must be at least 8 characters long", 400);
      }
      const userRecord = await User.findById(session.id).select("+passwordHash");
      if (!userRecord || !userRecord.passwordHash) {
        return fail("User record not found", 404);
      }
      const isMatch = await verifyPassword(currentPassword, userRecord.passwordHash);
      if (!isMatch) {
        return fail("Current password is incorrect", 400);
      }
      userRecord.passwordHash = await hashPassword(newPassword);
      await userRecord.save();
    }

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

    // Sync user collection fields
    const userUpdates: Record<string, unknown> = {};
    if (name !== undefined) userUpdates.name = name;
    if (phone !== undefined) userUpdates.phone = phone;
    if (profilePhoto !== undefined) userUpdates.avatar = profilePhoto;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(session.id, userUpdates);
    }

    try {
      revalidatePath("/", "page");
      revalidatePath("/photographers", "page");
      revalidatePath("/creatives", "page");
      if (updatedPhotographer?.slug) {
        revalidatePath(`/creatives/${updatedPhotographer.slug}`, "page");
        revalidatePath(`/photographers/${updatedPhotographer.slug}`, "page");
      }
    } catch (e) {
      console.warn("revalidatePath error:", e);
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

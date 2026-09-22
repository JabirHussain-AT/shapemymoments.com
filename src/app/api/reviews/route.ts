import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review, Notification } from "@/models";
import { reviewSchema, reviewModerationSchema } from "@/lib/validations";
import { created, fail, handleApiError, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const photographerId = request.nextUrl.searchParams.get("photographerId");
    const packageId = request.nextUrl.searchParams.get("packageId");
    const featured = request.nextUrl.searchParams.get("featured");

    try {
      await connectDB();
      const query: Record<string, unknown> = { status: "APPROVED" };
      if (photographerId) query.photographerId = photographerId;
      if (packageId) query.packageId = packageId;
      if (featured === "true") query.featured = true;
      const items = await Review.find(query).sort({ createdAt: -1 }).lean();
      return ok(items);
    } catch {
      return ok([]);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = reviewSchema.parse(await request.json());

    await connectDB();
    const doc = await Review.create({
      ...data,
      status: "APPROVED",
      date: new Date(),
    });

    if (data.photographerId) {
      const { Photographer } = await import("@/models");
      const isObjectId = Boolean(data.photographerId.match(/^[0-9a-fA-F]{24}$/));
      const query = isObjectId ? { _id: data.photographerId } : { slug: data.photographerId };
      const partner = await Photographer.findOne(query);

      if (partner) {
        const allReviews = await Review.find({
          photographerId: String(partner._id),
          status: "APPROVED",
        }).lean();

        const count = allReviews.length;
        const avg = count > 0 ? allReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / count : 0;

        await Photographer.findByIdAndUpdate(partner._id, {
          rating: Number(avg.toFixed(1)),
          reviewCount: count,
        });
      }
    }

    await Notification.create({
      type: "REVIEW_SUBMITTED",
      title: "New review submitted",
      message: `${data.name} left a ${data.rating}-star review`,
      role: "ADMIN",
      link: "/admin/reviews",
    });

    return created({ id: String(doc._id) }, "Thank you! Your review has been submitted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return fail("Review id required");
    const data = reviewModerationSchema.parse(rest);
    await connectDB();
    const item = await Review.findByIdAndUpdate(id, data, { new: true });
    if (!item) return fail("Review not found", 404);
    return ok(item, "Review updated");
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return fail("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}

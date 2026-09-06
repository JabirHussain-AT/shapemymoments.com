import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review, Notification } from "@/models";
import { reviewSchema, reviewModerationSchema } from "@/lib/validations";
import { created, fail, handleApiError, ok } from "@/lib/api";
import { getDemoReviews } from "@/lib/data";
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
      if (items.length) return ok(items);
    } catch {
      // fallback
    }

    return ok(
      getDemoReviews({
        photographerId: photographerId || undefined,
        packageId: packageId || undefined,
        featured: featured === "true",
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = reviewSchema.parse(await request.json());

    try {
      await connectDB();
      const doc = await Review.create({
        ...data,
        status: "PENDING",
        date: new Date(),
      });
      await Notification.create({
        type: "REVIEW_SUBMITTED",
        title: "New review submitted",
        message: `${data.name} left a ${data.rating}-star review`,
        role: "ADMIN",
        link: "/admin/reviews",
      });
      return created({ id: String(doc._id) }, "Review submitted for moderation");
    } catch {
      return created({ id: `demo-${Date.now()}` }, "Review submitted (demo mode)");
    }
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

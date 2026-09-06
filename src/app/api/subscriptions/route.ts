import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Subscription, Photographer, Notification } from "@/models";
import { PLAN_FEATURES, PLAN_PRICES } from "@/models/Subscription";
import { subscriptionUpdateSchema } from "@/lib/validations";
import { fail, handleApiError, ok } from "@/lib/api";
import { getSession, requireSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return fail("Unauthorized", 401);

    try {
      await connectDB();
      if (session.role === "ADMIN" || session.role === "SUPER_ADMIN") {
        const items = await Subscription.find()
          .populate("photographerId", "name slug")
          .sort({ updatedAt: -1 })
          .lean();
        return ok(items);
      }

      if (!session.photographerId) {
        return ok({
          plan: "FREE",
          status: "ACTIVE",
          features: PLAN_FEATURES.FREE,
          priceMonthly: 0,
        });
      }

      const sub = await Subscription.findOne({
        photographerId: session.photographerId,
      }).lean();
      return ok(
        sub || {
          plan: "FREE",
          status: "ACTIVE",
          features: PLAN_FEATURES.FREE,
          priceMonthly: 0,
        }
      );
    } catch {
      return ok({
        plans: [
          { plan: "FREE", price: PLAN_PRICES.FREE, features: PLAN_FEATURES.FREE },
          { plan: "PRO", price: PLAN_PRICES.PRO, features: PLAN_FEATURES.PRO },
          {
            plan: "PREMIUM",
            price: PLAN_PRICES.PREMIUM,
            features: PLAN_FEATURES.PREMIUM,
          },
        ],
        current: { plan: "FREE", status: "ACTIVE" },
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession(["PHOTOGRAPHER", "ADMIN", "SUPER_ADMIN"]);
    const body = await request.json();
    const data = subscriptionUpdateSchema.parse(body);
    const photographerId = body.photographerId || session.photographerId;

    if (!photographerId) return fail("Photographer id required");

    try {
      await connectDB();
      const sub = await Subscription.findOneAndUpdate(
        { photographerId },
        {
          plan: data.plan,
          status: data.status || "ACTIVE",
          priceMonthly: PLAN_PRICES[data.plan],
          features: PLAN_FEATURES[data.plan],
          startDate: new Date(),
        },
        { upsert: true, new: true }
      );

      await Photographer.findByIdAndUpdate(photographerId, {
        subscriptionPlan: data.plan,
        featured: data.plan === "PREMIUM" || data.plan === "PRO",
      });

      await Notification.create({
        type: "SUBSCRIPTION_CHANGE",
        title: "Subscription updated",
        message: `Plan changed to ${data.plan}`,
        role: "ADMIN",
        link: "/admin/subscriptions",
      });

      return ok(sub, "Subscription updated (placeholder — no payment charged)");
    } catch {
      return ok(
        {
          plan: data.plan,
          status: "ACTIVE",
          priceMonthly: PLAN_PRICES[data.plan],
          features: PLAN_FEATURES[data.plan],
        },
        "Subscription updated (demo mode)"
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return fail("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}

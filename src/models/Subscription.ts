import mongoose, { Schema, models, model } from "mongoose";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types";

export interface ISubscription {
  _id: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  priceMonthly: number;
  startDate: Date;
  endDate?: Date;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  FREE: 0,
  PRO: 999,
  PREMIUM: 2499,
};

const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  FREE: ["Basic profile", "Limited portfolio (8 images)"],
  PRO: [
    "More portfolio images",
    "Featured placement",
    "Reviews enabled",
    "Availability calendar",
    "Lead notifications",
  ],
  PREMIUM: [
    "Featured profile",
    "Homepage visibility",
    "Priority leads",
    "Advanced analytics",
    "Premium badge",
  ],
};

const SubscriptionSchema = new Schema<ISubscription>(
  {
    photographerId: {
      type: Schema.Types.ObjectId,
      ref: "Photographer",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    plan: {
      type: String,
      enum: ["FREE", "PRO", "PREMIUM"],
      default: "FREE",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "EXPIRED", "TRIAL"],
      default: "ACTIVE",
    },
    priceMonthly: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    features: [{ type: String }],
  },
  { timestamps: true }
);

export const Subscription =
  models.Subscription || model<ISubscription>("Subscription", SubscriptionSchema);

export { PLAN_PRICES, PLAN_FEATURES };

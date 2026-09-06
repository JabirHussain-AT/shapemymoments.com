import mongoose, { Schema, models, model } from "mongoose";
import type { EventType, ReviewStatus } from "@/types";

export interface IReview {
  _id: mongoose.Types.ObjectId;
  name: string;
  avatar?: string;
  rating: number;
  review: string;
  eventType: EventType;
  photographerId?: mongoose.Types.ObjectId;
  packageId?: mongoose.Types.ObjectId;
  status: ReviewStatus;
  featured: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true },
    avatar: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    eventType: { type: String, required: true },
    photographerId: {
      type: Schema.Types.ObjectId,
      ref: "Photographer",
      index: true,
    },
    packageId: { type: Schema.Types.ObjectId, ref: "EventPackage", index: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    featured: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Review = models.Review || model<IReview>("Review", ReviewSchema);

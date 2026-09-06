import mongoose, { Schema, models, model } from "mongoose";
import type { EventType } from "@/types";

export interface IPhotographerLead {
  _id: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  eventType: EventType;
  eventDate: Date;
  location: string;
  hoursRequired: number;
  budget?: number;
  message: string;
  name: string;
  phone: string;
  email: string;
  status: "NEW" | "CONTACTED" | "BOOKED" | "DECLINED" | "CLOSED";
  notes?: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PhotographerLeadSchema = new Schema<IPhotographerLead>(
  {
    photographerId: {
      type: Schema.Types.ObjectId,
      ref: "Photographer",
      required: true,
      index: true,
    },
    eventType: { type: String, required: true },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },
    hoursRequired: { type: Number, required: true },
    budget: Number,
    message: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "BOOKED", "DECLINED", "CLOSED"],
      default: "NEW",
      index: true,
    },
    notes: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const PhotographerLead =
  models.PhotographerLead ||
  model<IPhotographerLead>("PhotographerLead", PhotographerLeadSchema);

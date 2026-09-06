import mongoose, { Schema, models, model } from "mongoose";
import type { ContactMethod, EventRequestStatus, EventService, EventType } from "@/types";

export interface IEventRequest {
  _id: mongoose.Types.ObjectId;
  requestId: string;
  eventType: EventType;
  eventDate: Date;
  location: string;
  expectedGuests: number;
  budget: number;
  duration: string;
  services: EventService[];
  vision: string;
  theme?: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  preferredContact: ContactMethod;
  status: EventRequestStatus;
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
  quotationAmount?: number;
  quotationNotes?: string;
  packageId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventRequestSchema = new Schema<IEventRequest>(
  {
    requestId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },
    expectedGuests: { type: Number, required: true },
    budget: { type: Number, required: true },
    duration: { type: String, required: true },
    services: [{ type: String, required: true }],
    vision: { type: String, required: true },
    theme: String,
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    whatsapp: String,
    preferredContact: {
      type: String,
      enum: ["Phone", "Email", "WhatsApp"],
      default: "WhatsApp",
    },
    status: {
      type: String,
      enum: [
        "NEW",
        "CONTACTED",
        "PLANNING",
        "QUOTATION_SENT",
        "CONFIRMED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "NEW",
      index: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    notes: String,
    quotationAmount: Number,
    quotationNotes: String,
    packageId: { type: Schema.Types.ObjectId, ref: "EventPackage" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const EventRequest =
  models.EventRequest || model<IEventRequest>("EventRequest", EventRequestSchema);

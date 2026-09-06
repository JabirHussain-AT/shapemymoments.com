import mongoose, { Schema, models, model } from "mongoose";

export interface IEventPackage {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  startingPrice: number;
  eventTypes: string[];
  services: string[];
  images: string[];
  highlights: string[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventPackageSchema = new Schema<IEventPackage>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    eventTypes: [{ type: String }],
    services: [{ type: String }],
    images: [{ type: String }],
    highlights: [{ type: String }],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const EventPackage =
  models.EventPackage || model<IEventPackage>("EventPackage", EventPackageSchema);

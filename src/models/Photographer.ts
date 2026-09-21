import mongoose, { Schema, models, model } from "mongoose";
import type { PhotographerStatus, SubscriptionPlan } from "@/types";

export interface IPortfolioItem {
  url: string;
  caption?: string;
  eventType?: string;
  order: number;
}

export interface IPhotographerPackage {
  name: string;
  price: number;
  hours: number;
  description: string;
  includes: string[];
}

export interface IPhotographer {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  profilePhoto: string;
  coverImage: string;
  location: string;
  bio: string;
  experience: string;
  yearsOfExperience: number;
  specializations: string[];
  eventTypes: string[];
  portfolio: IPortfolioItem[];
  startingPrice: number;
  languages: string[];
  serviceLocations: string[];
  availability: string;
  bookedDates?: string[];
  packages: IPhotographerPackage[];
  rating: number;
  reviewCount: number;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  verified: boolean;
  featured: boolean;
  status: PhotographerStatus;
  subscriptionPlan: SubscriptionPlan;
  totalEarnings?: number;
  completedWorksCount?: number;
  hourlyRate?: number;
  includes?: string[];
  excludes?: string[];
  guarantees?: string[];
  dateNotes?: { date: string; note: string; status?: string }[];
  profileViews: number;
  portfolioViews: number;
  createdAt: Date;
  updatedAt: Date;
}

const PhotographerSchema = new Schema<IPhotographer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    coverImage: { type: String, required: true },
    location: { type: String, required: true, index: true },
    bio: { type: String, required: true },
    experience: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true, index: true },
    specializations: [{ type: String }],
    eventTypes: [{ type: String }],
    portfolio: [
      {
        url: String,
        caption: String,
        eventType: String,
        order: { type: Number, default: 0 },
      },
    ],
    startingPrice: { type: Number, required: true, index: true },
    languages: [{ type: String }],
    serviceLocations: [{ type: String }],
    availability: {
      type: String,
      default: "Available",
      index: true,
    },
    bookedDates: [{ type: String }],
    packages: [
      {
        name: String,
        price: Number,
        hours: Number,
        description: String,
        includes: [String],
      },
    ],
    rating: { type: Number, default: 0, index: true },
    reviewCount: { type: Number, default: 0 },
    socialLinks: {
      instagram: String,
      facebook: String,
      website: String,
    },
    verified: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "PENDING",
      index: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ["FREE", "PRO", "PREMIUM"],
      default: "FREE",
    },
    totalEarnings: { type: Number, default: 0 },
    completedWorksCount: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 2500 },
    includes: [{ type: String }],
    excludes: [{ type: String }],
    guarantees: [{ type: String }],
    dateNotes: [
      {
        date: String,
        note: String,
        status: String,
      },
    ],
    profileViews: { type: Number, default: 0 },
    portfolioViews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Photographer =
  models?.Photographer || model<IPhotographer>("Photographer", PhotographerSchema);

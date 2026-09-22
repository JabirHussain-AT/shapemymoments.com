import { z } from "zod";
import {
  CONTACT_METHODS,
  EVENT_REQUEST_STATUSES,
  EVENT_SERVICES,
  EVENT_TYPES,
  REVIEW_STATUSES,
  SUBSCRIPTION_PLANS,
} from "@/types";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  password: z.string().min(8).max(72),
  role: z.enum(["CUSTOMER", "PHOTOGRAPHER"]).default("CUSTOMER"),
});

export const eventRequestSchema = z.object({
  eventType: z.enum(EVENT_TYPES),
  eventDate: z.string().min(1),
  location: z.string().min(2).max(120),
  expectedGuests: z.coerce.number().int().min(1).max(10000),
  budget: z.coerce.number().min(0),
  duration: z.string().min(1).max(80),
  services: z.array(z.enum(EVENT_SERVICES)).min(1),
  vision: z.string().min(10).max(3000),
  theme: z.string().max(120).optional(),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  whatsapp: z.string().min(10).max(15).optional(),
  preferredContact: z.enum(CONTACT_METHODS).default("WhatsApp"),
});

export const eventRequestUpdateSchema = z.object({
  status: z.enum(EVENT_REQUEST_STATUSES).optional(),
  assignedTo: z.string().optional().nullable(),
  notes: z.string().max(5000).optional(),
  quotationAmount: z.coerce.number().min(0).optional(),
  quotationNotes: z.string().max(5000).optional(),
  packageId: z.string().optional().nullable(),
});

export const packageSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(120).optional(),
  description: z.string().min(10).max(2000),
  startingPrice: z.coerce.number().min(0),
  eventTypes: z.array(z.string()).min(1),
  services: z.array(z.string()).min(1),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  highlights: z.array(z.string()).default([]),
});

export const photographerLeadSchema = z.object({
  photographerId: z.string().min(1),
  eventType: z.enum(EVENT_TYPES),
  eventDate: z.string().min(1),
  location: z.string().min(2).max(120),
  hoursRequired: z.coerce.number().min(1).max(24),
  budget: z.coerce.number().min(0).optional(),
  message: z.string().min(10).max(2000),
  name: z.string().min(2).max(80),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
});

export const reviewSchema = z.object({
  name: z.string().min(2).max(80),
  avatar: z.string().url().optional().or(z.literal("")),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(5).max(2000),
  images: z.array(z.string()).optional(),
  eventType: z.string().min(1),
  photographerId: z.string().optional(),
  packageId: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  message: z.string().min(10).max(3000),
});

export const notifySchema = z.object({
  email: z.string().email(),
  interest: z.enum(["store", "rentals", "both"]).default("both"),
});

export const subscriptionUpdateSchema = z.object({
  plan: z.enum(SUBSCRIPTION_PLANS),
  status: z.enum(["ACTIVE", "CANCELLED", "EXPIRED", "TRIAL"]).optional(),
});

export const reviewModerationSchema = z.object({
  status: z.enum(REVIEW_STATUSES),
  featured: z.boolean().optional(),
});

export const photographerFilterSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  eventType: z.string().optional(),
  minExperience: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  availability: z.string().optional(),
  sort: z
    .enum([
      "recommended",
      "rating",
      "experience",
      "price-asc",
      "price-desc",
      "featured",
    ])
    .default("recommended"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

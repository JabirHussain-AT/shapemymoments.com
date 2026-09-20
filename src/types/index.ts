export const ROLES = [
  "CUSTOMER",
  "PHOTOGRAPHER",
  "ADMIN",
  "EVENT_MANAGER",
  "STAFF",
  "SUPER_ADMIN",
] as const;

export type Role = (typeof ROLES)[number];

export const EVENT_TYPES = [
  "Birthday",
  "Wedding",
  "Engagement",
  "Anniversary",
  "Baby Shower",
  "Corporate",
  "Proposal",
  "Surprise",
  "Kids Party",
  "Graduation",
  "Family Function",
  "Themed Party",
  "Custom Event",
  "Other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_REQUEST_STATUSES = [
  "NEW",
  "CONTACTED",
  "PLANNING",
  "QUOTATION_SENT",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type EventRequestStatus = (typeof EVENT_REQUEST_STATUSES)[number];

export const EVENT_SERVICES = [
  "Venue",
  "Decoration",
  "Photography",
  "Videography",
  "Catering",
  "Cake",
  "DJ",
  "Music",
  "Entertainment",
  "Invitations",
  "Return Gifts",
  "Transportation",
  "Event Coordination",
  "Party Supplies",
  "Other",
] as const;

export type EventService = (typeof EVENT_SERVICES)[number];

export const SUBSCRIPTION_PLANS = ["FREE", "PRO", "PREMIUM"] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export const SUBSCRIPTION_STATUSES = [
  "ACTIVE",
  "CANCELLED",
  "EXPIRED",
  "TRIAL",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const REVIEW_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const PHOTOGRAPHER_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
] as const;
export type PhotographerStatus = (typeof PHOTOGRAPHER_STATUSES)[number];

export const CONTACT_METHODS = ["Phone", "Email", "WhatsApp"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const CREATIVE_CATEGORIES = [
  "Photographers",
  "Hampers",
  "Henna Designers",
  "Makeup Artists",
] as const;
export type CreativeCategory = (typeof CREATIVE_CATEGORIES)[number];

export const VERIFICATION_STATUSES = [
  "UNVERIFIED",
  "PENDING",
  "VERIFIED",
  "REJECTED",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];


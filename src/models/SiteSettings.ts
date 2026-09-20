import mongoose, { Schema, models, model } from "mongoose";

export interface ISiteSettings {
  _id: mongoose.Types.ObjectId;
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    tagline: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  faqs: { question: string; answer: string }[];
  eventTypes: {
    name: string;
    slug: string;
    description: string;
    image: string;
  }[];
  featuredPhotographerIds: string[];
  featuredReviewIds: string[];
  notifyEmails: { email: string; interest: string; createdAt: Date }[];
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    hero: {
      headline: { type: String, default: "Your Moment.\nOur Responsibility." },
      subheadline: {
        type: String,
        default:
          "From the first idea to the final celebration, we plan, arrange and coordinate everything — so you can be fully present for the moments that matter.",
      },
      primaryCta: { type: String, default: "Plan My Event" },
      secondaryCta: { type: String, default: "Meet Our Photographers" },
      tagline: {
        type: String,
        default: "You enjoy the moment. We handle everything else.",
      },
    },
    contact: {
      email: { type: String, default: "hello@shapemymoment.com" },
      phone: { type: String, default: "+91 80899 09386" },
      whatsapp: { type: String, default: "918089909386" },
      address: { type: String, default: "Kalpetta, Wayanad, Kerala" },
      city: { type: String, default: "Kalpetta" },
    },
    social: {
      instagram: String,
      facebook: String,
      twitter: String,
      youtube: String,
    },
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    eventTypes: [
      {
        name: String,
        slug: String,
        description: String,
        image: String,
      },
    ],
    featuredPhotographerIds: [String],
    featuredReviewIds: [String],
    notifyEmails: [
      {
        email: String,
        interest: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const SiteSettings =
  models.SiteSettings || model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

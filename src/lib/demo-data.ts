import type {
  DemoPackage,
  DemoPhotographer,
  DemoCreative,
  DemoReview,
  DemoEventRequest,
} from "./data";

export const DEMO_EVENT_TYPES = [
  {
    name: "Birthday",
    slug: "birthday",
    description: "Memorable birthday celebrations tailored to every age and style.",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
  },
  {
    name: "Wedding",
    slug: "wedding",
    description: "Elegant wedding planning from engagement to the big day.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    name: "Engagement",
    slug: "engagement",
    description: "Intimate and grand engagement celebrations done right.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
  },
  {
    name: "Baby Shower",
    slug: "baby-shower",
    description: "Warm, joyful showers for the newest chapter ahead.",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
  },
  {
    name: "Anniversary",
    slug: "anniversary",
    description: "Romantic milestones planned with care and elegance.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
  },
  {
    name: "Corporate",
    slug: "corporate",
    description: "Professional events that impress teams and clients.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
  },
  {
    name: "Surprise Party",
    slug: "surprise-party",
    description: "Flawlessly secret surprises that land perfectly.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  },
  {
    name: "Kids Party",
    slug: "kids-party",
    description: "Fun-filled themed parties kids never forget.",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
  },
  {
    name: "Proposal",
    slug: "proposal",
    description: "Cinematic proposal setups for once-in-a-lifetime yeses.",
    image:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
  },
  {
    name: "Custom Event",
    slug: "custom-event",
    description: "Fully custom celebrations designed around your vision.",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
  },
] as const;

export const DEMO_CREATIVES: DemoCreative[] = [];

export const DEMO_PHOTOGRAPHERS: DemoPhotographer[] = DEMO_CREATIVES;
export const DEMO_HAMPERS: DemoCreative[] = DEMO_CREATIVES.filter(c => c.category === "Hamper Makers");
export const DEMO_HENNA_DESIGNERS: DemoCreative[] = DEMO_CREATIVES.filter(c => c.category === "Henna Artists");
export const DEMO_MAKEUP_ARTISTS: DemoCreative[] = DEMO_CREATIVES.filter(c => c.category === "Makeup Artists");
export const DEMO_CAKE_BAKERS: DemoCreative[] = DEMO_CREATIVES.filter(c => c.category === "Cake Bakers");
export const DEMO_PACKAGES: DemoPackage[] = [];
export const DEMO_REVIEWS: DemoReview[] = [];

export const DEMO_FAQS = [
  {
    question: "What does ShapeMyMoment actually handle?",
    answer:
      "We plan, source, arrange, coordinate and manage your event end-to-end — décor, vendors, photography, catering coordination and on-day execution based on your brief and budget.",
  },
  {
    question: "How does custom event planning work?",
    answer:
      "Share your vision through Plan My Event. Our team reviews your date, location, guest count, budget and required services, then builds a customized package and quotation.",
  },
  {
    question: "Can I only book a photographer?",
    answer:
      "Yes. Browse our photographer directory, view portfolios and request a photographer directly — or include photography as part of a full event package.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "We recommend 3–6 weeks for most celebrations and longer for weddings or peak dates. Surprise events can often be arranged faster depending on availability.",
  },
  {
    question: "Do you work within a fixed budget?",
    answer:
      "Absolutely. Tell us your budget upfront and we design a realistic plan — prioritizing what matters most to you.",
  },
  {
    question: "Where do you currently operate?",
    answer:
      "We primarily serve Wayanad, Kozhikode and nearby Kerala locations, with selective coverage across South India for premium packages.",
  },
] as const;

export const DEMO_EVENT_REQUESTS: DemoEventRequest[] = [];

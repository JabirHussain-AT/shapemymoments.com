# ShapeMyMoment

End-to-end event planning and management platform for **shapemymoment.com**.

> **You enjoy the moment. We handle everything else.**

ShapeMyMoment is a custom event planning partner — not a simple vendor directory. Customers describe their celebration; the team plans, sources, arranges, coordinates and manages everything from idea to celebration.

## Tech stack

- **Next.js 15** (App Router) + TypeScript
- **MongoDB** + Mongoose
- **Tailwind CSS 4**
- **Framer Motion**
- **Zod** + React Hook Form patterns
- **Jose** + bcrypt (session auth)
- **Lucide React** + Sonner toasts

## Features

- Multi-step **Plan Your Event** wizard with request IDs
- Configurable **event packages**
- **Photographer marketplace** with filters, profiles, booking leads
- Photographer **subscription architecture** (FREE / PRO / PREMIUM — placeholder billing)
- **Store** & **Rentals** coming-soon teasers
- Customer, photographer and **admin** dashboards
- Reviews with moderation workflow
- CMS / SiteSettings structure
- SEO metadata + JSON-LD
- Demo data fallback when MongoDB is offline

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/ShapeMyMoment
AUTH_SECRET=change-me-to-a-long-random-secret-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=918089909386
```

The site works with **demo data** even if MongoDB is not running. Forms and APIs return demo-mode success responses when the database is unavailable.

## MongoDB setup

1. Install and start MongoDB locally, **or** use MongoDB Atlas.
2. Set `MONGODB_URI` in `.env.local`.
3. Seed demo content:

```bash
npm run seed
```

Seed creates:

- 10 photographers
- 8 packages
- 10 reviews
- 10 event types
- Admin + demo customer accounts

## Demo accounts

| Role     | Email                         | Password    |
|----------|-------------------------------|-------------|
| Admin    | admin@shapemymoment.com      | admin12345  |
| Customer | demo@shapemymoment.com       | demo12345   |

These work even without MongoDB (hardcoded session login). After seeding, the same credentials exist in the database.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # start production server
npm run lint     # ESLint
npm run seed     # seed MongoDB
```

## Admin setup

1. Sign in at `/login` with the admin account.
2. Open `/admin` for:
   - Event requests
   - Packages
   - Photographers & leads
   - Reviews moderation
   - Subscriptions
   - CMS / settings
   - Store & rentals placeholders

## Project structure

```
src/
  app/                 # App Router pages + API routes
  components/          # UI, layout, forms, animations, admin
  lib/                 # mongodb, auth, validations, demo data
  models/              # Mongoose models
  types/               # Shared enums/types
scripts/
  seed.ts              # Database seed
```

## Core customer journey

Homepage → **Plan My Event** → multi-step form → success + request ID → admin reviews → quotation → customer confirms → ShapeMyMoment manages the event.

## License

Proprietary — ShapeMyMoment.

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0b12" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "ShapeMyMoment — You Enjoy the Moment. We Handle Everything Else.",
    template: "%s | ShapeMyMoment",
  },
  description:
    "End-to-end custom event planning, decor, and photography network across South India. From weddings and birthdays to corporate galas and equipment rentals — we handle everything.",
  keywords: [
    "event planning",
    "event management company",
    "wedding planner Kerala",
    "birthday party planner",
    "photographer network",
    "event equipment rentals",
    "ShapeMyMoment",
    "Wayanad event planners",
    "Kalpetta decor services",
    "custom event packages",
  ],
  authors: [{ name: "ShapeMyMoment Team", url: "https://shapemymoment.com" }],
  creator: "ShapeMyMoment",
  publisher: "ShapeMyMoment",
  category: "Event Planning & Entertainment",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: absoluteUrl("/"),
    siteName: "ShapeMyMoment",
    title: "ShapeMyMoment — You Enjoy the Moment. We Handle Everything Else.",
    description:
      "South India's premier event network. We plan, arrange, coordinate and execute birthdays, weddings, corporate events and photography services.",
    images: [
      {
        url: absoluteUrl("/icon.svg"),
        width: 512,
        height: 512,
        alt: "ShapeMyMoment Logo & Brand Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShapeMyMoment — Event Planning & Management",
    description: "You enjoy the moment. We handle everything else.",
    images: [absoluteUrl("/icon.svg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EventPlanner", "LocalBusiness", "Organization"],
      "@id": absoluteUrl("#organization"),
      name: "ShapeMyMoment",
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon.svg"),
      image: absoluteUrl("/icon.svg"),
      description:
        "End-to-end event planning, management, and photography network. Custom packages for birthdays, weddings, corporate galas, decor, and rental equipment.",
      email: "hello@shapemymoment.com",
      telephone: "+91-80899-09386",
      priceRange: "₹₹ - ₹₹₹",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kalpetta",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "11.6103",
        longitude: "76.0827",
      },
      areaServed: [
        {
          "@type": "AdministrativeArea",
          name: "Kerala, India",
        },
        {
          "@type": "AdministrativeArea",
          name: "South India",
        },
      ],
      slogan: "You enjoy the moment. We handle everything else.",
    },
  ],
};

// Inline Anti-FOWT Script to inject dark mode class synchronously before render
const themeInitializerScript = `
  (function() {
    try {
      var saved = localStorage.getItem('smm_theme');
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
      </head>
      <body className="min-h-screen font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <SiteHeader />
          <main className="min-h-[70vh]">{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

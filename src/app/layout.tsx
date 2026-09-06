import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default:
      "ShapeMyMoment — You Enjoy the Moment. We Handle Everything Else.",
    template: "%s | ShapeMyMoment",
  },
  description:
    "End-to-end event planning and management. Tell us your vision — we plan, arrange, coordinate and manage birthdays, weddings, corporate events and more.",
  keywords: [
    "event planning",
    "event management",
    "birthday party planner",
    "wedding planner",
    "photographers",
    "ShapeMyMoment",
    "Kalpetta",
    "Wayanad",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: absoluteUrl("/"),
    siteName: "ShapeMyMoment",
    title: "ShapeMyMoment — You Enjoy the Moment. We Handle Everything Else.",
    description:
      "Custom event planning & management. From idea to celebration — we handle everything else.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShapeMyMoment",
    description: "You enjoy the moment. We handle everything else.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ShapeMyMoment",
  url: absoluteUrl("/"),
  description:
    "End-to-end event planning and management company. Custom packages for birthdays, weddings, corporate events and more.",
  email: "hello@shapemymoment.com",
  telephone: "+91-98765-43210",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kalpetta",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  areaServed: "Kerala, India",
  slogan: "You enjoy the moment. We handle everything else.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}

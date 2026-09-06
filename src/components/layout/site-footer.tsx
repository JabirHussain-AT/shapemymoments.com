import Link from "next/link";
import { Instagram, Facebook, Youtube, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = [
  {
    title: "Plan",
    links: [
      { href: "/plan-event", label: "Plan Your Event" },
      { href: "/packages", label: "Packages" },
      { href: "/photographers", label: "Photographers" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/rentals", label: "Rentals" },
      { href: "/store", label: "Store" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/refund", label: "Refund Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border bg-[#1c1917] text-[#faf8f5]">
      <div className="container-page border-b border-white/10 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to make your moment unforgettable?
            </h3>
            <p className="mt-2 text-white/65">
              Tell us what you&apos;re planning. We&apos;ll take it from there.
            </p>
          </div>
          <Link href="/plan-event">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Start Planning
            </Button>
          </Link>
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            ShapeMyMoments
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            You enjoy the moment. We handle everything else.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {footerLinks.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/40">
              {group.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} ShapeMyMoments. All rights reserved.</p>
        <p>shapemymoments.com</p>
      </div>
    </footer>
  );
}

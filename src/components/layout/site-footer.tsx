import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const footerLinks = [
  {
    title: "Network",
    links: [
      { href: "/plan-event", label: "Plan Your Event" },
      { href: "/creatives/register", label: "Join as Creative" },
      { href: "/#creatives-section", label: "Creative Showcase" },
      { href: "/packages", label: "Packages" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/rentals", label: "Rentals" },
      { href: "/store", label: "Store" },
      { href: "/about", label: "About Us" },
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
    <footer className="mt-8 border-t border-border bg-[#15111d] text-[#faf8f5] dark:bg-[#09070d]">
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
            <Button size="lg" className="bg-white text-[#5b3a8f] font-bold hover:bg-white/90">
              Start Planning
            </Button>
          </Link>
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo variant="footer" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            You enjoy the moment. We handle everything else.
          </p>
          <div className="mt-6 flex items-center gap-3">
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
            <ThemeToggle className="ml-2 border-white/15 bg-white/5 text-white hover:bg-white/10" />
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
        <p>© {new Date().getFullYear()} ShapeMyMoment. All rights reserved.</p>
        <p>shapemymoment.com</p>
      </div>
    </footer>
  );
}

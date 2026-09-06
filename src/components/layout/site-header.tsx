"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfettiBurst } from "@/components/animations/motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plan-event", label: "Plan Your Event" },
  { href: "/packages", label: "Packages" },
  { href: "/photographers", label: "Photographers" },
  { href: "/rentals", label: "Rentals" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const reduce = useReducedMotion();

  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/photographer");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (isDashboard) return null;

  const celebrate = () => {
    if (reduce) return;
    setConfetti(true);
    setTimeout(() => setConfetti(false), 900);
  };

  return (
    <>
      <ConfettiBurst trigger={confetti} />
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border/70 bg-background/85 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
          <Link
            href="/"
            className="group flex items-center gap-2 font-bold tracking-tight"
            aria-label="ShapeMyMoment home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg sm:text-xl">
              Shape<span className="text-primary">My</span>Moment
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/photographers">
              <Button variant="outline" size="sm">
                Find a Photographer
              </Button>
            </Link>
            <Link href="/plan-event" onClick={celebrate}>
              <Button size="sm">Plan My Event</Button>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/80 xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.28 }}
              className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl xl:hidden"
            >
              <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: reduce ? 0 : i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-3 grid gap-2">
                  <Link href="/photographers">
                    <Button variant="outline" className="w-full">
                      Find a Photographer
                    </Button>
                  </Link>
                  <Link href="/plan-event" onClick={celebrate}>
                    <Button className="w-full">Plan My Event</Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

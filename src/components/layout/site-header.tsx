"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ConfettiBurst } from "@/components/animations/motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plan-event", label: "Plan Event" },
  { href: "/#creatives-section", label: "Creatives" },
  { href: "/packages", label: "Packages" },
  { href: "/#hiring-section", label: "Careers" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About" },
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
            ? "border-b border-border/70 bg-background/85 backdrop-blur-xl shadow-xs"
            : "bg-transparent"
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-3 lg:h-[4.25rem]">
          <Logo />

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
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
                    "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
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
            <ThemeToggle />
            <Link href="/creatives/register">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-semibold border-black bg-black text-white hover:bg-zinc-800 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800 shadow-xs"
              >
                Join Network
              </Button>
            </Link>
            <Link href="/plan-event" onClick={celebrate}>
              <Button size="sm" className="h-9 px-3 text-xs font-semibold shadow-xs">
                Plan Event
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition hover:bg-muted"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
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
              <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile navigation">
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

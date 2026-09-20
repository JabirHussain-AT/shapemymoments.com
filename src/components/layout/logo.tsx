import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "compact" | "footer" | "admin";
  showSubtitle?: boolean;
}

export function LogoIcon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      className={cn(
        "shrink-0 drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
        className
      )}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="smmGradBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B3A8F" />
          <stop offset="0.5" stopColor="#7C4DB8" />
          <stop offset="1" stop-color="#C9A227" />
        </linearGradient>
        <linearGradient id="smmPopperGrad" x1="8" y1="32" x2="22" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FFA500" />
        </linearGradient>
        <linearGradient id="sparkleGold" x1="24" y1="6" x2="34" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFE066" />
        </linearGradient>
      </defs>

      {/* Badge Squircle Container */}
      <rect width="40" height="40" rx="12" fill="url(#smmGradBg)" />

      {/* Party Popper Horn / Cone (Lower Left popping upwards) */}
      <path
        d="M7.5 32.5L16.5 21.5L21.5 26.5L10.5 35.5C8.8 35.5 7.5 34.2 7.5 32.5Z"
        fill="url(#smmPopperGrad)"
        stroke="white"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Popper Decorative Stripes */}
      <path
        d="M10.5 29L14 32.5M13.5 25L17 28.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Confetti Burst Rays & Streamers */}
      <path
        d="M20 20Q24 16 31 14M22 23Q27 21 34 24M17 18Q21 12 24 6"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Bursting Confetti Shapes & Diamonds */}
      <rect x="25" y="18" width="2.5" height="2.5" rx="0.5" fill="#FF85A1" transform="rotate(20 25 18)" />
      <circle cx="33" cy="20" r="1.5" fill="#FFE066" />
      <circle cx="21" cy="8" r="1.5" fill="#FFFFFF" />
      <rect x="15" y="10" width="2" height="2" rx="0.4" fill="#FFD700" transform="rotate(45 15 10)" />

      {/* Main Celebration Star Burst (Top Right) */}
      <path
        d="M29 6L30.3 9.7L34 11L30.3 12.3L29 16L27.7 12.3L24 11L27.7 9.7Z"
        fill="url(#sparkleGold)"
      />

      {/* Integrated Happy Face (Smiling Face on the Celebration Emblem) */}
      {/* Joyful Arch Eyes */}
      <path
        d="M14 15.5C15 14.3 17 14.3 18 15.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M22 13.5C23 12.3 25 12.3 26 13.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Cheerful Smiling Mouth */}
      <path
        d="M15.5 21C15.5 24 18 25.5 21.5 25.5C25 25.5 27.5 24 27.5 21"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cheek Dimples / Sparkle Accent */}
      <circle cx="14" cy="21.5" r="1" fill="#FF85A1" opacity="0.9" />
      <circle cx="29" cy="21.5" r="1" fill="#FF85A1" opacity="0.9" />
    </svg>
  );
}

export function Logo({ className, variant = "default", showSubtitle = true }: LogoProps) {
  if (variant === "footer") {
    return (
      <Link
        href="/"
        className={cn("group inline-flex items-center gap-2.5 font-bold text-white transition hover:opacity-95", className)}
        aria-label="ShapeMyMoment Home"
      >
        <LogoIcon className="h-9.5 w-9.5" />
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight leading-none text-white">
            Shape<span className="text-[#e2b738]">My</span>Moment
          </span>
          <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-white/60 mt-0.5">
            You Enjoy. We Handle.
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "admin") {
    return (
      <Link
        href="/"
        className={cn("group inline-flex items-center gap-2.5 font-bold transition", className)}
        aria-label="ShapeMyMoment Admin"
      >
        <LogoIcon className="h-8.5 w-8.5" />
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight leading-none text-white">
            Shape<span className="text-pink">My</span>Moment
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50 mt-0.5">
            Admin Console
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href="/"
        className={cn("group inline-flex items-center gap-2 font-bold transition", className)}
        aria-label="ShapeMyMoment Home"
      >
        <LogoIcon className="h-8.5 w-8.5" />
        <span className="text-lg font-black tracking-tight text-foreground leading-none">
          Shape<span className="text-primary">My</span>Moment
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-3 pr-4 border-r border-border/60 transition",
        className
      )}
      aria-label="ShapeMyMoment Home"
    >
      <LogoIcon className="h-10 w-10" />
      <div className="flex flex-col">
        <span className="text-lg font-black tracking-tight text-foreground sm:text-xl leading-none">
          Shape<span className="text-primary font-black">My</span>Moment
        </span>
        {showSubtitle && (
          <span className="text-[9px] uppercase tracking-[0.18em] font-extrabold text-muted-foreground/80 mt-0.5">
            South India Network
          </span>
        )}
      </div>
    </Link>
  );
}

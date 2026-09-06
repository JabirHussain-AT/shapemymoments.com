import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "pink" | "gold" | "outline";
}) {
  const styles = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-emerald-50 text-emerald-800",
    warning: "bg-amber-50 text-amber-800",
    pink: "bg-pink-soft text-[#8b4553]",
    gold: "bg-gold-soft text-[#7a6414]",
    outline: "border border-border bg-white text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

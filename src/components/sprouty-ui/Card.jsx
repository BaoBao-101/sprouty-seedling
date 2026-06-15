export function Card({ children, className = "", onClick, hover = true, variant = "default" }) {
  const variants = {
    default:
      "bg-card text-card-foreground border-border/70 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_-18px_color-mix(in_oklab,var(--secondary)_45%,transparent)]",
    muted:
      "bg-muted/60 text-foreground border-border/60 shadow-none",
    accent:
      "bg-gradient-to-br from-accent/60 to-card text-card-foreground border-accent/50 shadow-[0_12px_30px_-20px_color-mix(in_oklab,var(--primary)_50%,transparent)]",
    feature:
      "bg-gradient-to-br from-card to-secondary/10 text-card-foreground border-secondary/30 shadow-[0_16px_36px_-22px_color-mix(in_oklab,var(--secondary)_60%,transparent)]",
  };
  const hoverFx = hover
    ? "hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_color-mix(in_oklab,var(--secondary)_55%,transparent)] transition-all duration-200"
    : "";
  return (
    <div
      className={`rounded-3xl border p-1 ${variants[variant] ?? variants.default} ${hoverFx} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

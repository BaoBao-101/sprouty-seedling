export function Btn({ children, onClick, variant = "primary", size = "md", className = "", disabled = false, type = "button" }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full tracking-tight " +
    "transition-all duration-200 active:scale-[0.97] cursor-pointer border " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none";

  // Variants lean on semantic tokens (sage primary, terracotta accent) with warm shadows.
  const variants = {
    primary:
      "bg-primary text-primary-foreground border-transparent shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--primary)_55%,transparent)] hover:bg-primary/90 hover:-translate-y-px",
    secondary:
      "bg-card text-primary border-primary/30 hover:border-primary/60 hover:bg-primary/5",
    orange:
      "bg-secondary text-secondary-foreground border-transparent shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--secondary)_55%,transparent)] hover:bg-secondary/90 hover:-translate-y-px",
    yellow:
      "bg-yellow-300 text-yellow-900 border-transparent shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--color-yellow-500)_60%,transparent)] hover:bg-yellow-400",
    ghost:
      "bg-transparent text-foreground border-transparent hover:bg-muted",
    gold:
      "bg-gradient-to-r from-yellow-300 via-orange-200 to-secondary text-secondary-foreground border-transparent shadow-[0_12px_28px_-12px_color-mix(in_oklab,var(--secondary)_60%,transparent)] hover:opacity-95 hover:-translate-y-px",
    danger:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
    outline:
      "bg-transparent text-foreground border-border hover:bg-muted",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-[0.95rem]",
    lg: "h-13 px-7 text-base",
    xl: "h-14 px-8 text-lg",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

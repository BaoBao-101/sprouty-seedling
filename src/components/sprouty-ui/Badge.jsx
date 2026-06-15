export function Badge({ children, color = "green", className = "" }) {
  const colors = {
    green: "bg-primary/10 text-primary ring-primary/20",
    orange: "bg-secondary/10 text-secondary ring-secondary/20",
    yellow: "bg-yellow-200/60 text-yellow-900 ring-yellow-300/60",
    purple: "bg-accent text-accent-foreground ring-accent/60",
    red: "bg-destructive/10 text-destructive ring-destructive/20",
    gold: "bg-gradient-to-r from-yellow-200 to-orange-200 text-secondary ring-secondary/20",
    neutral: "bg-muted text-muted-foreground ring-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold uppercase tracking-wide ring-1 ring-inset ${colors[color] ?? colors.green} ${className}`}
    >
      {children}
    </span>
  );
}

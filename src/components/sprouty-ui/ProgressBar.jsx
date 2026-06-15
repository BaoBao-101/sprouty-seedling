export function ProgressBar({ value, max, color = "green" }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const fills = {
    green: "bg-gradient-to-r from-primary/80 to-primary",
    yellow: "bg-gradient-to-r from-yellow-300 to-yellow-500",
    orange: "bg-gradient-to-r from-orange-300 to-secondary",
  };
  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden ring-1 ring-inset ring-border/60">
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${fills[color] ?? fills.green}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

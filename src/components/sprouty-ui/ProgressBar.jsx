export function ProgressBar({ value, max, color = "green" }) {
  const pct = Math.round((value / max) * 100);
  const colors = { green: "bg-green-400", yellow: "bg-yellow-400", orange: "bg-orange-400" };
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full transition-all duration-700 ${colors[color]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

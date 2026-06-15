export function Badge({ children, color = "green" }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-red-100 text-red-700",
    gold: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[color]}`}>
      {children}
    </span>
  );
}

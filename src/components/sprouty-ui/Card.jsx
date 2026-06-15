export function Card({ children, className = "", onClick, hover = true }) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-sm border border-gray-100 ${hover ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-200" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

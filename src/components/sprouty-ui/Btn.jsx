export function Btn({ children, onClick, variant = "primary", size = "md", className = "", disabled = false, type = "button" }) {
  const base = "font-bold rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer border-0";
  const variants = {
    primary: "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200",
    secondary: "bg-white hover:bg-green-50 text-green-600 border-2 border-green-400",
    orange: "bg-orange-400 hover:bg-orange-500 text-white shadow-lg shadow-orange-200",
    yellow: "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-lg shadow-yellow-200",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
    gold: "bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-amber-900 shadow-lg shadow-yellow-300",
    danger: "bg-red-100 hover:bg-red-200 text-red-600",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };
  return (
    <button type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

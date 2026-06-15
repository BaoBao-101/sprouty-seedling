/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";

export const ToastContext = createContext(null);

const STYLES = {
  success: "bg-green-500 text-white",
  error:   "bg-red-500 text-white",
  info:    "bg-sky-500 text-white",
};

const ICONS = {
  success: "✅",
  error:   "❌",
  info:    "ℹ️",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-sm font-bold max-w-xs text-center ${STYLES[toast.type]}`}
            style={{ animation: "slideUp 0.22s ease" }}
          >
            <span>{ICONS[toast.type]}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext must be used inside ToastProvider");
  return ctx;
}

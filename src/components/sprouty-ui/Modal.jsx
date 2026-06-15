import { useEffect, useRef } from "react";

export function Modal({ isOpen, onClose, children, title }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    // Focus close button on open
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector("button")?.focus();
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKey);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0 bg-[color-mix(in_oklab,var(--secondary)_35%,#1a0f08_65%)]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative bg-card text-card-foreground rounded-3xl border border-border/60 shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--secondary)_55%,transparent)] w-full max-w-md max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
          <h3 id="modal-title" className="font-display text-xl text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

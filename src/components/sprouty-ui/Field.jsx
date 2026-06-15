import { forwardRef } from "react";

/**
 * Sprouty form primitives — Terracotta & Sage.
 * Field wraps label + control + helper/error.
 * Input / Textarea / Select are token-driven so dark/light just work.
 */

const controlBase =
  "w-full rounded-2xl border border-input bg-card text-foreground placeholder:text-muted-foreground/70 " +
  "px-4 py-3 text-[0.95rem] shadow-sm transition-all duration-200 " +
  "focus:outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/15 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export const Input = forwardRef(function Input(
  { className = "", error = false, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`${controlBase} ${error ? "border-destructive/60 focus:border-destructive focus:ring-destructive/15" : ""} ${className}`}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea(
  { className = "", error = false, rows = 4, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${controlBase} resize-y leading-relaxed ${error ? "border-destructive/60 focus:border-destructive focus:ring-destructive/15" : ""} ${className}`}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select(
  { className = "", error = false, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={`${controlBase} pr-10 appearance-none bg-[length:14px] bg-no-repeat bg-[right_1rem_center] bg-[url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%23926a4d%27><path d=%27M5.5 7.5L10 12l4.5-4.5%27 stroke=%27%23926a4d%27 stroke-width=%271.5%27 fill=%27none%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/></svg>")] ${error ? "border-destructive/60 focus:border-destructive focus:ring-destructive/15" : ""} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

export function Label({ children, htmlFor, className = "", required = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-semibold text-foreground/80 mb-1.5 ${className}`}
    >
      {children}
      {required && <span className="text-secondary ml-0.5">*</span>}
    </label>
  );
}

export function Field({ label, htmlFor, error, hint, required, children, className = "" }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <Label htmlFor={htmlFor} required={required}>{label}</Label>}
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive mt-1">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
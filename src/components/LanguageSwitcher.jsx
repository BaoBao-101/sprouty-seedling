import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (code) => { i18n.changeLanguage(code); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer border border-transparent hover:border-border/60 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={t("language.select")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:block">{current.label}</span>
        <span aria-hidden="true" className="text-xs text-muted-foreground">▾</span>
      </button>

      {open && (
        <ul
          className="absolute right-0 mt-2 w-48 bg-card text-foreground rounded-2xl border border-border/60 py-1.5 z-50 shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--secondary)_45%,transparent)]"
          role="listbox"
          aria-label={t("language.select")}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <li key={lang.code} role="option" aria-selected={lang.code === current.code}>
              <button
                onClick={() => pick(lang.code)}
                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-semibold cursor-pointer border-0 transition-colors ${
                  lang.code === current.code
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted bg-transparent"
                }`}
              >
                <span aria-hidden="true">{lang.flag}</span> {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

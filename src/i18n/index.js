import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import vi from "./locales/vi.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ja from "./locales/ja.json";

// Supported locales — order drives the LanguageSwitcher dropdown.
// `locale` is the BCP-47 tag used by Intl (e.g. formatVND); `code` is the i18next key.
export const SUPPORTED_LANGUAGES = [
  { code: "vi", locale: "vi-VN", flag: "🇻🇳", label: "Tiếng Việt" },
  { code: "en", locale: "en-US", flag: "🇺🇸", label: "English" },
  { code: "fr", locale: "fr-FR", flag: "🇫🇷", label: "Français" },
  { code: "ja", locale: "ja-JP", flag: "🇯🇵", label: "日本語" },
];

export const DEFAULT_LANGUAGE = "vi"; // Tiếng Việt 🇻🇳 — per DESIGN.md / CLAUDE.md
const STORAGE_KEY = "sprouty_lang";

const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
const initialLng = SUPPORTED_LANGUAGES.some((l) => l.code === stored) ? stored : DEFAULT_LANGUAGE;

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
    fr: { translation: fr },
    ja: { translation: ja },
  },
  lng: initialLng,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false }, // React already escapes
});

// Persist selection so it survives reloads.
i18n.on("languageChanged", (lng) => {
  if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, lng);
});

// Map an i18next code ("vi") to its Intl locale ("vi-VN") — used by formatVND (F-16).
export const localeFor = (code) =>
  SUPPORTED_LANGUAGES.find((l) => l.code === code)?.locale ?? "vi-VN";

export default i18n;

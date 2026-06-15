import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Btn } from "./ui/Btn";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV_ITEMS = [
  { path: "/dashboard", labelKey: "nav.myGarden",     icon: "🌿" },
  { path: "/tree",      labelKey: "nav.memoryTree",   icon: "🌳" },
  { path: "/plants",    labelKey: "nav.plantBuddies", icon: "🍅" },
  { path: "/workshop",  labelKey: "nav.workshop",     icon: "🎨" },
  { path: "/super",     labelKey: "nav.vip",          icon: "⭐" },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const go = (path) => { navigate(path); setMenuOpen(false); };

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm" role="navigation" aria-label={t("nav.aria.main")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => go("/")}
          className="flex items-center gap-2 font-display text-2xl text-green-600 hover:text-green-700 transition-colors cursor-pointer border-0 bg-transparent"
          aria-label={t("nav.aria.home")}
        >
          <span aria-hidden="true">🌱</span> Sprouty
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1" role="list">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              role="listitem"
              aria-current={location.pathname === item.path ? "page" : undefined}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer border-0 ${
                location.pathname === item.path
                  ? "bg-green-100 text-green-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 bg-transparent"
              }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <>
              <button
                onClick={() => go("/dashboard")}
                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-2xl transition-colors cursor-pointer border-0"
                aria-label={t("nav.aria.userGarden", { name: user.name })}
              >
                <span aria-hidden="true">{user.avatar}</span>
                <span className="text-sm font-bold text-green-700 hidden sm:block">{user.name}</span>
              </button>
              <button
                onClick={() => { logout(); go("/"); }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border-0 bg-transparent"
                aria-label={t("nav.aria.signOut")}
              >
                <span aria-hidden="true">↩</span>
                <span>{t("nav.signOut")}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Btn size="sm" variant="secondary" onClick={() => go("/register")}>{t("nav.register")} 🌱</Btn>
              <Btn size="sm" onClick={() => go("/login")}>{t("nav.signIn")}</Btn>
            </div>
          )}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 cursor-pointer border-0 text-lg"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? t("nav.aria.closeMenu") : t("nav.aria.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          <button
            onClick={() => go("/")}
            aria-current={location.pathname === "/" ? "page" : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold w-full text-left cursor-pointer border-0 transition-colors ${location.pathname === "/" ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50 bg-transparent"}`}
          >
            <span aria-hidden="true">🏠</span> {t("nav.home")}
          </button>
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              aria-current={location.pathname === item.path ? "page" : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold w-full text-left cursor-pointer border-0 transition-colors ${location.pathname === item.path ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50 bg-transparent"}`}
            >
              <span aria-hidden="true">{item.icon}</span> {t(item.labelKey)}
            </button>
          ))}
          <div className="border-t border-gray-100 mt-1 pt-1">
            {user ? (
              <button
                onClick={() => { logout(); go("/"); }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold w-full text-left cursor-pointer border-0 text-red-500 hover:bg-red-50 bg-transparent transition-colors"
              >
                <span aria-hidden="true">↩</span> {t("nav.signOut")}
              </button>
            ) : (
              <>
                <button onClick={() => go("/login")} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold w-full text-left cursor-pointer border-0 text-green-600 hover:bg-green-50 bg-transparent transition-colors">
                  <span aria-hidden="true">🌱</span> {t("nav.signIn")}
                </button>
                <button onClick={() => go("/register")} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold w-full text-left cursor-pointer border-0 text-gray-600 hover:bg-gray-50 bg-transparent transition-colors">
                  <span aria-hidden="true">✏️</span> {t("nav.register")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

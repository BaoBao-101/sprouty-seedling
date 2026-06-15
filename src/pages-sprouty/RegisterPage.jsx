import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { useFormatVND } from "../hooks/useFormatVND";
import { Btn } from "../components/ui/Btn";
import { Card } from "../components/ui/Card";
import { KITS, WORKSHOPS } from "../data/products";

function findProduct(id) {
  if (!id) return null;
  return [...KITS, ...WORKSHOPS].find(p => p.id === id) ?? null;
}

function validate(form, t) {
  const errors = {};
  if (!form.name.trim()) errors.name = t("register.errors.name");
  if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = t("register.errors.email");
  if (form.password.length < 6) errors.password = t("register.errors.password");
  return errors;
}

export function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { showToast } = useToast();
  const formatVND = useFormatVND();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawProductId = searchParams.get("product");
  const productId = /^[a-z0-9-]+$/.test(rawProductId ?? "") ? rawProductId : null;
  const plan = searchParams.get("plan");
  const preselected = findProduct(productId);
  const isVIPPlan = plan === "vip";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
    setServerError("");
  };

  const handleSubmit = async () => {
    const errs = validate(form, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");
    try {
      await register(form.name, form.email, form.password);
      if (preselected) {
        sessionStorage.setItem("sprouty_pending_order", JSON.stringify({
          id: preselected.id, name: preselected.name, price: preselected.price,
        }));
        showToast(t("register.toast.withProduct", { name: preselected.name }), "success");
      } else if (isVIPPlan) {
        sessionStorage.setItem("sprouty_pending_order", JSON.stringify({
          id: "vip", name: "VIP Garden", price: 20000,
        }));
        showToast(t("register.toast.withVIP"), "success");
      } else {
        showToast(t("register.toast.welcome"), "success");
      }
      navigate("/dashboard", { replace: true });
    } catch {
      setServerError(t("register.errors.server"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-2xl border-2 outline-none text-gray-700 font-medium transition-colors ${
      errors[field] ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-green-400"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-sky-50 pt-24 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl block mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🌱</span>
          <h1 className="font-display text-3xl text-gray-800">{t("register.title")}</h1>
          <p className="text-gray-500 font-medium mt-2">{t("register.subtitle")}</p>
        </div>

        {/* Product pre-selection summary */}
        {(preselected || isVIPPlan) && (
          <div className="mb-4 bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">{preselected?.emoji ?? "⭐"}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-0.5">
                {t("register.preselected")}
              </p>
              <p className="font-bold text-gray-800">{preselected?.name ?? "VIP Garden"}</p>
              <p className="text-sm text-gray-500">{formatVND(preselected?.price ?? 20000)}</p>
            </div>
            <span className="text-green-500 text-xl font-bold">✓</span>
          </div>
        )}

        <Card className="p-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">{t("register.nameLabel")}</label>
              <input
                type="text"
                placeholder={t("register.namePlaceholder")}
                value={form.name}
                onChange={e => update("name", e.target.value)}
                className={inputClass("name")}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">{t("register.emailLabel")}</label>
              <input
                type="email"
                placeholder="parent@example.com"
                value={form.email}
                onChange={e => update("email", e.target.value)}
                className={inputClass("email")}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">{t("register.passwordLabel")}</label>
              <input
                type="password"
                placeholder={t("register.passwordPlaceholder")}
                value={form.password}
                onChange={e => update("password", e.target.value)}
                className={inputClass("password")}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm font-medium">
                ⚠️ {serverError}
              </div>
            )}

            <Btn className="w-full justify-center" size="lg" onClick={handleSubmit} disabled={loading}>
              {loading ? t("register.processing") : t("register.submit")}
            </Btn>
          </div>

          <div className="text-center mt-6">
            <Link to="/login" className="text-green-600 font-bold text-sm hover:text-green-700">
              {t("register.switchToLogin")}
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400 font-medium">{t("register.trust")}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

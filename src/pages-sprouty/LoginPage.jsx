import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { Btn } from "../components/sprouty-ui/Btn";
import { Card } from "../components/sprouty-ui/Card";

function validate(form, t) {
  const errors = {};
  if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = t("login.errors.email");
  if (form.password.length < 6) errors.password = t("login.errors.password");
  return errors;
}

export function LoginPage() {
  const { t } = useTranslation();
  const { login, skipToDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
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
      await login(form.email, form.password);
      showToast(t("login.toast.welcome"), "success");
      navigate(from, { replace: true });
    } catch {
      setServerError(t("login.errors.server"));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => { skipToDemo(); navigate("/dashboard", { replace: true }); };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-2xl border-2 outline-none text-gray-700 font-medium transition-colors ${
      errors[field] ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-green-400"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-sky-50 pt-24 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl block mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🌱</span>
          <h1 className="font-display text-3xl text-gray-800">{t("login.titleLogin")}</h1>
          <p className="text-gray-500 font-medium mt-2">{t("login.subtitleLogin")}</p>
        </div>

        <Card className="p-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">{t("login.emailLabel")}</label>
              <input type="email" placeholder="parent@example.com" value={form.email}
                onChange={e => update("email", e.target.value)} className={inputClass("email")} />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">{t("login.passwordLabel")}</label>
              <input type="password" placeholder={t("login.passwordPlaceholder")} value={form.password}
                onChange={e => update("password", e.target.value)} className={inputClass("password")} />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm font-medium">
                ⚠️ {serverError}
              </div>
            )}

            <Btn className="w-full justify-center" size="lg" onClick={handleSubmit} disabled={loading}>
              {loading ? t("login.processing") : t("login.submitLogin")}
            </Btn>
          </div>

          <div className="text-center mt-6">
            <Link to="/register" className="text-green-600 font-bold text-sm hover:text-green-700">
              {t("login.switchToRegister")}
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400 font-medium">{t("login.trust")}</p>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <button onClick={handleSkip}
            className="text-xs text-gray-400 hover:text-gray-600 font-medium cursor-pointer bg-transparent border-0 underline underline-offset-2">
            {t("login.demo")}
          </button>
        </div>
      </div>
    </div>
  );
}

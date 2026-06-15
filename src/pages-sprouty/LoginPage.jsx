import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { Btn } from "../components/sprouty-ui/Btn";
import { Card } from "../components/sprouty-ui/Card";
import { Field, Input } from "../components/sprouty-ui/Field";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/40 pt-24 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl block mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🌱</span>
          <h1 className="font-display text-3xl text-foreground">{t("login.titleLogin")}</h1>
          <p className="text-muted-foreground font-medium mt-2">{t("login.subtitleLogin")}</p>
        </div>

        <Card>
          <div className="p-8">
            <div className="space-y-4">
              <Field label={t("login.emailLabel")} htmlFor="login-email" error={errors.email}>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="parent@example.com"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  error={!!errors.email}
                />
              </Field>

              <Field label={t("login.passwordLabel")} htmlFor="login-password" error={errors.password}>
                <Input
                  id="login-password"
                  type="password"
                  placeholder={t("login.passwordPlaceholder")}
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  error={!!errors.password}
                />
              </Field>

              {serverError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl px-4 py-3 text-destructive text-sm font-medium">
                  ⚠️ {serverError}
                </div>
              )}

              <Btn className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
                {loading ? t("login.processing") : t("login.submitLogin")}
              </Btn>
            </div>

            <div className="text-center mt-6">
              <Link to="/register" className="text-primary font-bold text-sm hover:text-primary/80">
                {t("login.switchToRegister")}
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-border/60">
              <p className="text-xs text-center text-muted-foreground font-medium">{t("login.trust")}</p>
            </div>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <button onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer bg-transparent border-0 underline underline-offset-2">
            {t("login.demo")}
          </button>
        </div>
      </div>
    </div>
  );
}

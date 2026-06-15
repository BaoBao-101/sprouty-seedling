import { useState } from "react";
import { useTranslation } from "react-i18next";
import { VIP_FEATURES } from "../data/vipFeatures";
import { VIP_PRICES } from "../data/products";
import { useFormatVND } from "../hooks/useFormatVND";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../contexts/AuthContext";
import { startCheckout } from "../utils/stripe";
import { Btn } from "../components/sprouty-ui/Btn";

const FIREFLIES = Array.from({ length: 8 }, (_, i) => ({
  left: 15 + ((i * 37 + 11) % 70),
  top: 10 + ((i * 53 + 7) % 80),
  duration: 1.5 + (i % 3) * 0.5,
}));

export function VIPPage() {
  const { t } = useTranslation();
  const formatVND = useFormatVND();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [nightMode, setNightMode] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const handleSubscribe = async (planKey) => {
    if (!user) { return; }
    setCheckoutLoading(planKey);
    try {
      await startCheckout(`vip-${planKey}`);
    } catch (err) {
      setCheckoutLoading(null);
      const key = err.message === "stripe_unavailable"
        ? "vip.stripeUnavailable"
        : "vip.stripeError";
      showToast(t(key), "error");
    }
  };

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 transition-all duration-700 ${nightMode ? "bg-gray-950" : "bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900"}`}>
      <div className="max-w-5xl mx-auto">
        <div className="pt-8 mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-bold mb-4 backdrop-blur-sm">{t("vip.badge")}</div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">{t("vip.title")}</h1>
          <p className="text-indigo-300 font-medium">{t("vip.subtitle")}</p>

          {/* Night Mode Toggle */}
          <button onClick={() => setNightMode(n => !n)}
            className={`mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer border-0 ${nightMode ? "bg-yellow-400/20 text-yellow-300" : "bg-white/10 text-white"}`}>
            {nightMode ? t("vip.dayMode") : t("vip.nightMode")}
          </button>
        </div>

        {/* Animated Tree Preview */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <svg viewBox="0 0 240 280" className="w-48 h-56 drop-shadow-2xl">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={nightMode ? "#FFD700" : "#66BB6A"} stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <ellipse cx="120" cy="130" rx="90" ry="90" fill="url(#glow)"/>
              <path d="M112 270 Q110 230 111 200 Q113 175 116 150" stroke={nightMode ? "#FFD700" : "#795548"} strokeWidth="14" strokeLinecap="round" fill="none"/>
              <ellipse cx="120" cy="155" rx="75" ry="68" fill={nightMode ? "#1a1a00" : "#1B5E20"}/>
              <ellipse cx="92" cy="168" rx="58" ry="53" fill={nightMode ? "#2a2a00" : "#2E7D32"}/>
              <ellipse cx="148" cy="163" rx="58" ry="53" fill={nightMode ? "#2a2a00" : "#2E7D32"}/>
              <ellipse cx="120" cy="136" rx="70" ry="63" fill={nightMode ? "#332200" : "#43A047"}/>
              <ellipse cx="120" cy="112" rx="58" ry="54" fill={nightMode ? "#665500" : "#66BB6A"}/>
              <ellipse cx="115" cy="90" rx="36" ry="30" fill={nightMode ? "#998800" : "#81C784"} opacity="0.7"/>
              {[{cx:82,cy:102},{cx:158,cy:96},{cx:65,cy:140},{cx:172,cy:132},{cx:120,cy:82},{cx:100,cy:138},{cx:142,cy:130}].map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r="8" fill={nightMode ? "#FFD700" : ["#FF8A65","#F48FB1","#81D4FA","#FFD54F","#CE93D8","#80CBC4","#FFAB91"][i]} opacity={nightMode ? "0.9" : "0.85"} style={{filter: nightMode ? "drop-shadow(0 0 4px gold)" : "none"}}/>
              ))}
              {nightMode && [
                {cx:40,cy:40},{cx:200,cy:20},{cx:215,cy:200},{cx:20,cy:200},{cx:220,cy:110},{cx:30,cy:110}
              ].map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r="1.5" fill="white" opacity="0.6"/>
              ))}
              <path d="M88 270 Q88 278 118 280 Q148 278 148 270" fill={nightMode ? "#997700" : "#EF6C00"}/>
              <rect x="82" y="252" width="76" height="24" rx="10" fill={nightMode ? "#FFD700" : "#FF8A65"}/>
              <rect x="78" y="244" width="84" height="14" rx="7" fill={nightMode ? "#997700" : "#EF6C00"}/>
            </svg>
            {nightMode && (
              <div className="absolute inset-0 pointer-events-none">
                {FIREFLIES.map((f, i) => (
                  <div key={i} className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" style={{
                    left: `${f.left}%`, top: `${f.top}%`,
                    animationDelay: `${i * 0.3}s`, animationDuration: `${f.duration}s`
                  }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* VIP Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {VIP_FEATURES.map(f => (
            <div key={f.title} className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-3xl p-5 text-white hover:-translate-y-2 transition-all duration-200 cursor-pointer hover:border-yellow-400/40 hover:bg-white/12">
              <span className="text-4xl block mb-3" style={{filter:"drop-shadow(0 0 8px rgba(255,213,79,0.4))"}}>{f.icon}</span>
              <h3 className="font-display text-base mb-1">{f.title}</h3>
              <p className="text-indigo-300 text-xs font-medium leading-relaxed">{f.desc}</p>
              <span className="mt-3 inline-block bg-yellow-400/15 text-yellow-300 text-xs px-2 py-1 rounded-full font-bold border border-yellow-400/20">VIP</span>
            </div>
          ))}
        </div>

        {/* VIP Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {[
            { key: "monthly", color: "border-purple-400", highlight: false },
            { key: "annual",  color: "border-yellow-400", highlight: true },
          ].map(plan => (
            <div key={plan.key} className={`rounded-3xl p-6 border-2 ${plan.color} ${plan.highlight ? "bg-yellow-400/10" : "bg-white/5"} text-white text-center`}>
              {plan.highlight && (
                <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                  {t(`vip.plans.${plan.key}.save`)}
                </div>
              )}
              <h3 className="font-display text-2xl mb-2">{t(`vip.plans.${plan.key}.name`)}</h3>
              <div className="font-display text-4xl mb-1">{formatVND(VIP_PRICES[plan.key])}</div>
              <div className="text-indigo-300 text-sm mb-6">{t(`vip.plans.${plan.key}.period`)}</div>
              <Btn variant={plan.highlight ? "gold" : "secondary"}
                className={`w-full justify-center ${!plan.highlight ? "border-white/30 text-white bg-white/10 hover:bg-white/20" : ""}`}
                onClick={() => handleSubscribe(plan.key)}
                disabled={checkoutLoading !== null}>
                {checkoutLoading === plan.key ? t("vip.stripeLoading") : t(`vip.plans.${plan.key}.btn`)}
              </Btn>
            </div>
          ))}
        </div>

        <p className="text-center text-indigo-400 text-xs font-medium mt-6">{t("vip.footer")}</p>
      </div>
    </div>
  );
}

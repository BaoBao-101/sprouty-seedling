import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Btn } from "../components/ui/Btn";
import { Card } from "../components/ui/Card";
import { FloatingLeaf } from "../components/FloatingLeaf";

export function LandingPage({ setPage }) {
  const { t } = useTranslation();
  const [aiMsg, setAiMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const generateMessage = async () => {
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const msgs = t("landing.ai.messages", { returnObjects: true });
    setAiMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    setAiLoading(false);
  };

  const stats = [
    ["12k+", t("landing.stats.families")],
    ["48k",  t("landing.stats.memories")],
    ["4.9⭐", t("landing.stats.rating")],
  ];

  const features = [
    { id: "tree",   icon: "🌳", color: "bg-green-50 border-green-200" },
    { id: "pot",    icon: "🎨", color: "bg-orange-50 border-orange-200" },
    { id: "ai",     icon: "🤖", color: "bg-yellow-50 border-yellow-200" },
    { id: "buddy",  icon: "🍅", color: "bg-red-50 border-red-200" },
    { id: "vip",    icon: "🌙", color: "bg-purple-50 border-purple-200" },
    { id: "family", icon: "💝", color: "bg-pink-50 border-pink-200" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-sky-50 relative overflow-hidden">
      <FloatingLeaf index={0} style={{ top: "12%", left: "4%",  fontSize: 28, opacity: 0.5 }} />
      <FloatingLeaf index={1} style={{ top: "22%", right: "5%", fontSize: 22, opacity: 0.4, animationDelay: "1s" }} />
      <FloatingLeaf index={2} style={{ top: "55%", left: "2%",  fontSize: 18, opacity: 0.35, animationDelay: "2s" }} />
      {/* Hero */}
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-sm">
            {t("landing.hero.badge")}
          </div>

          <h1 className="font-display text-5xl sm:text-7xl text-gray-800 mb-6 leading-tight">
            {t("landing.hero.title.grow")} <span className="text-green-500">{t("landing.hero.title.memories")}</span><br/>
            <span className="text-orange-400">{t("landing.hero.title.together")}</span> 🌱
          </h1>

          <p className="text-xl text-gray-500 font-semibold mb-10 max-w-xl mx-auto leading-relaxed">
            {t("landing.hero.subtitle")}
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Btn size="lg" onClick={() => setPage("dashboard")}>{t("landing.hero.ctaTree")}</Btn>
            <Btn variant="secondary" size="lg" onClick={() => setPage("workshop")}>{t("landing.hero.ctaKit")}</Btn>
          </div>

          {/* Hero Tree SVG */}
          <div className="flex justify-center mb-12">
            <svg viewBox="0 0 280 300" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-lg" style={{animation:"float 4s ease-in-out infinite"}}>
              <ellipse cx="140" cy="285" rx="70" ry="12" fill="#A5D6A7" opacity="0.4"/>
              <path d="M130 280 Q127 240 128 210 Q130 180 134 155" stroke="#795548" strokeWidth="16" strokeLinecap="round" fill="none"/>
              <ellipse cx="140" cy="180" rx="60" ry="55" fill="#2E7D32"/>
              <ellipse cx="100" cy="190" rx="50" ry="45" fill="#388E3C"/>
              <ellipse cx="180" cy="185" rx="50" ry="45" fill="#388E3C"/>
              <ellipse cx="140" cy="155" rx="65" ry="58" fill="#43A047"/>
              <ellipse cx="110" cy="165" rx="52" ry="48" fill="#4CAF50"/>
              <ellipse cx="170" cy="160" rx="50" ry="46" fill="#4CAF50"/>
              <ellipse cx="140" cy="132" rx="60" ry="55" fill="#66BB6A"/>
              <ellipse cx="130" cy="112" rx="36" ry="30" fill="#81C784" opacity="0.7"/>
              <circle cx="120" cy="152" r="8" fill="white"/>
              <circle cx="148" cy="152" r="8" fill="white"/>
              <circle cx="122" cy="154" r="4.5" fill="#2E3A1F"/>
              <circle cx="150" cy="154" r="4.5" fill="#2E3A1F"/>
              <circle cx="123.5" cy="152.5" r="1.5" fill="white"/>
              <circle cx="151.5" cy="152.5" r="1.5" fill="white"/>
              <path d="M118 163 Q134 174 150 163" stroke="#2E3A1F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <ellipse cx="108" cy="161" rx="6" ry="4" fill="#F48FB1" opacity="0.55"/>
              <ellipse cx="162" cy="161" rx="6" ry="4" fill="#F48FB1" opacity="0.55"/>
              <circle cx="100" cy="120" r="11" fill="#FF8A65" opacity="0.9"/>
              <text x="100" y="124" fontSize="11" textAnchor="middle" dominantBaseline="middle">📷</text>
              <circle cx="178" cy="113" r="10" fill="#F48FB1" opacity="0.9"/>
              <text x="178" y="117" fontSize="9" textAnchor="middle" dominantBaseline="middle">🌱</text>
              <circle cx="84" cy="158" r="9" fill="#81D4FA" opacity="0.9"/>
              <text x="84" y="162" fontSize="8" textAnchor="middle" dominantBaseline="middle">💧</text>
              <path d="M96 280 Q96 290 134 292 Q172 290 172 280" fill="#EF6C00"/>
              <rect x="90" y="258" width="88" height="30" rx="10" fill="#FF8A65"/>
              <rect x="84" y="250" width="100" height="14" rx="7" fill="#EF6C00"/>
              <circle cx="112" cy="270" r="8" fill="#FFD54F" opacity="0.85"/>
              <circle cx="134" cy="274" r="6" fill="#81D4FA" opacity="0.85"/>
              <circle cx="155" cy="268" r="7" fill="#F48FB1" opacity="0.85"/>
              <text x="32" y="88" fontSize="16" opacity="0.6">✨</text>
              <text x="224" y="72" fontSize="13" opacity="0.5">⭐</text>
              <text x="234" y="155" fontSize="11" opacity="0.45">✨</text>
            </svg>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-12">
            {stats.map(([num, label]) => (
              <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-green-50">
                <div className="font-display text-xl text-green-600">{num}</div>
                <div className="text-xs text-gray-500 font-semibold mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Demo Card */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="font-bold text-gray-800 text-sm">{t("landing.ai.title")}</div>
                <div className="text-xs text-gray-400">{t("landing.ai.subtitle")}</div>
              </div>
              <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold">{t("landing.ai.badge")}</span>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 mb-4 min-h-[56px] flex items-center">
              {aiLoading ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                  <span className="animate-spin">🌀</span> {t("landing.ai.thinking")}
                </div>
              ) : aiMsg ? (
                <p className="text-green-800 font-semibold text-sm">{aiMsg}</p>
              ) : (
                <p className="text-gray-400 text-sm italic">{t("landing.ai.placeholder")}</p>
              )}
            </div>
            <Btn onClick={generateMessage} className="w-full justify-center" disabled={aiLoading}>
              {aiLoading ? t("landing.ai.generating") : t("landing.ai.generate")}
            </Btn>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">{t("landing.features.badge")}</div>
            <h2 className="font-display text-4xl text-gray-800">{t("landing.features.heading")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <Card key={f.id} className={`p-6 border-2 ${f.color}`}>
                <span className="text-4xl block mb-3">{f.icon}</span>
                <h3 className="font-display text-lg text-gray-800 mb-2">{t(`landing.features.items.${f.id}.title`)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{t(`landing.features.items.${f.id}.desc`)}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-3xl p-10 sm:p-16 text-white max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-4 left-6 text-4xl opacity-30">🍃</div>
            <div className="absolute bottom-4 right-6 text-4xl opacity-20">🌿</div>
            <div className="relative z-10">
              <h2 className="font-display text-4xl mb-4">{t("landing.cta.heading")}</h2>
              <p className="text-green-100 text-lg mb-8 font-medium">{t("landing.cta.subtitle")}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Btn variant="secondary" size="lg" onClick={() => setPage("login")}>{t("landing.cta.start")}</Btn>
                <button onClick={() => setPage("workshop")} className="px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-colors cursor-pointer bg-transparent">{t("landing.cta.gift")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

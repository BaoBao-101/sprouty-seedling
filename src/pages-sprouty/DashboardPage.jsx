import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { MOCK_PLANTS } from "../data/mockPlants";
import { MOCK_MEMORIES } from "../data/mockMemories";
import { Badge } from "../components/ui/Badge";
import { Btn } from "../components/ui/Btn";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { ActivateKitModal } from "../components/ActivateKitModal";

export function DashboardPage({ user, setPage }) {
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notifOpen, setNotifOpen] = useState(true);
  const [activateOpen, setActivateOpen] = useState(false);
  const activePlant = MOCK_PLANTS[0];

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      showToast(t("dashboard.paymentSuccess"), "success");
      refreshUser();
      setSearchParams({}, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Welcome */}
        <div className="pt-8 pb-6">
          <h1 className="font-display text-4xl text-gray-800">
            {t("dashboard.greeting", { name: user?.name || "Gardener" })}
          </h1>
          <p className="text-gray-500 font-semibold mt-2">{t("dashboard.subtitle")}</p>
        </div>

        {/* Notification Banner */}
        {notifOpen && (
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl p-4 mb-6 flex items-center gap-4 text-white shadow-lg shadow-orange-200 animate-[slideDown_0.4s_ease-out]">
            <span className="text-3xl flex-shrink-0">🍅</span>
            <div className="flex-1">
              <div className="font-bold text-sm">{t("dashboard.notif.from")}</div>
              <div className="text-sm font-medium opacity-90">{t("dashboard.notif.msg", { name: user?.name })}</div>
            </div>
            <button onClick={() => setNotifOpen(false)} className="text-white/70 hover:text-white font-bold text-lg cursor-pointer bg-transparent border-0" aria-label="Dismiss notification">✕</button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Active Plant Card */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-display text-2xl text-gray-800">🍅 Tomato Buddy</div>
                <div className="text-gray-500 font-medium text-sm">{t("dashboard.plant.day", { n: activePlant.daysGrowing })}</div>
              </div>
              <Badge color="orange">Stage {activePlant.stage}/{activePlant.maxStage}</Badge>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-orange-50 rounded-2xl flex items-center justify-center text-6xl border-2 border-orange-100">
                {activePlant.emoji}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-600 mb-2">{t("dashboard.plant.progress")}</div>
                <ProgressBar value={activePlant.stage} max={activePlant.maxStage} color="orange" />
                <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                  <span>{t("dashboard.plant.sprouted")}</span><span>{t("dashboard.plant.ready")}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {activePlant.stages.map((s, i) => (
                    <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 transition-all ${i < activePlant.stage ? "bg-green-100 border-green-300" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
              ["💧", t("dashboard.plant.water"),  t("dashboard.plant.waterVal")],
              ["☀️", t("dashboard.plant.sun"),    t("dashboard.plant.sunVal")],
              ["🌱", t("dashboard.plant.growth"), t("dashboard.plant.growthVal")],
            ].map(([icon, label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-xs font-bold text-gray-600">{label}</div>
                  <div className="text-xs text-gray-400 font-medium">{val}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Memory Tree Mini */}
          <Card className="p-6 cursor-pointer hover:shadow-xl transition-all" onClick={() => setPage("tree")}>
            <div className="font-display text-lg text-gray-800 mb-1">{t("dashboard.tree.title")}</div>
            <div className="text-xs text-gray-400 font-medium mb-4">{t("dashboard.tree.subtitle")}</div>
            <div className="flex justify-center">
              <svg viewBox="0 0 160 180" className="w-32 h-40">
                <ellipse cx="80" cy="172" rx="45" ry="8" fill="#A5D6A7" opacity="0.4"/>
                <path d="M76 170 Q74 145 75 125 Q77 108 79 90" stroke="#795548" strokeWidth="10" strokeLinecap="round" fill="none"/>
                <ellipse cx="80" cy="100" rx="52" ry="48" fill="#43A047"/>
                <ellipse cx="56" cy="108" rx="40" ry="37" fill="#4CAF50"/>
                <ellipse cx="104" cy="104" rx="40" ry="37" fill="#4CAF50"/>
                <ellipse cx="80" cy="80" rx="48" ry="44" fill="#66BB6A"/>
                <ellipse cx="75" cy="65" rx="28" ry="24" fill="#81C784" opacity="0.7"/>
                {[{cx:55,cy:68,fill:"#FF8A65"},{cx:105,cy:63,fill:"#F48FB1"},{cx:42,cy:95,fill:"#81D4FA"},{cx:115,cy:88,fill:"#FFD54F"},{cx:78,cy:55,fill:"#CE93D8"},{cx:65,cy:105,fill:"#80CBC4"},{cx:96,cy:100,fill:"#FFAB91"}].map((l, i) => (
                  <circle key={i} cx={l.cx} cy={l.cy} r="9" fill={l.fill} opacity="0.9"/>
                ))}
                <path d="M52 170 Q52 178 78 180 Q104 178 104 170" fill="#EF6C00"/>
                <rect x="50" y="155" width="58" height="20" rx="7" fill="#FF8A65"/>
                <rect x="46" y="148" width="66" height="10" rx="5" fill="#EF6C00"/>
              </svg>
            </div>
            <Btn className="w-full justify-center mt-3" size="sm" onClick={() => setPage("tree")}>{t("dashboard.tree.open")}</Btn>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { icon: "📸", labelKey: "dashboard.actions.addMemory",   color: "bg-green-100 hover:bg-green-200 text-green-700",   action: () => setPage("tree") },
            { icon: "🌿", labelKey: "dashboard.actions.myPlants",    color: "bg-orange-100 hover:bg-orange-200 text-orange-700", action: () => setPage("plants") },
            { icon: "🎨", labelKey: "dashboard.actions.workshop",    color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700", action: () => setPage("workshop") },
            { icon: "⭐", labelKey: "dashboard.actions.vipGarden",   color: "bg-purple-100 hover:bg-purple-200 text-purple-700", action: () => setPage("vip") },
            { icon: "🎁", labelKey: "dashboard.actions.activateKit", color: "bg-teal-100 hover:bg-teal-200 text-teal-700",       action: () => setActivateOpen(true) },
          ].map(a => (
            <button key={a.labelKey} onClick={a.action}
              className={`${a.color} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:-translate-y-1 cursor-pointer border-0 font-bold text-sm`}>
              <span className="text-3xl">{a.icon}</span>
              {t(a.labelKey)}
            </button>
          ))}
        </div>

        <ActivateKitModal isOpen={activateOpen} onClose={() => setActivateOpen(false)} />

        {/* Recent Memories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-gray-800">{t("dashboard.memories.title")}</h2>
            <button onClick={() => setPage("tree")} className="text-green-600 font-bold text-sm hover:text-green-700 cursor-pointer bg-transparent border-0">{t("dashboard.memories.seeAll")}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_MEMORIES.slice(0, 3).map(m => (
              <Card key={m.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">{m.emoji}</div>
                  <div>
                    <div className="font-bold text-sm text-gray-800 line-clamp-1">{m.title}</div>
                    <div className="text-xs text-gray-400 font-medium">{m.date}</div>
                  </div>
                </div>
                <div className="w-full h-20 bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl flex items-center justify-center text-3xl mb-3">{m.img}</div>
                <p className="text-xs text-gray-500 line-clamp-2 font-medium">{m.caption}</p>
                {m.aiGenerated && <div className="mt-2"><Badge color="yellow">{t("dashboard.memories.aiCaption")}</Badge></div>}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { MOCK_PLANTS } from "../data/mockPlants";
import { MOCK_MEMORIES } from "../data/mockMemories";
import { Badge } from "../components/sprouty-ui/Badge";
import { Btn } from "../components/sprouty-ui/Btn";
import { Card } from "../components/sprouty-ui/Card";
import { ProgressBar } from "../components/sprouty-ui/ProgressBar";
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
    <div className="relative min-h-screen overflow-hidden pt-20 pb-16 px-4 bg-background">
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-40 -right-32 w-[32rem] h-[32rem] rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="pt-8 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-card/70 backdrop-blur border border-border/60 text-foreground/70 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("dashboard.subtitle")}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground">
              {t("dashboard.greeting", { name: user?.name || "Gardener" })}
            </h1>
          </div>
          <div className="flex gap-3">
            {[
              { v: activePlant.daysGrowing, l: "days" },
              { v: MOCK_MEMORIES.length, l: "memories" },
              { v: MOCK_PLANTS.length, l: "plants" },
            ].map(s => (
              <div key={s.l} className="bg-card/70 backdrop-blur border border-border/60 rounded-2xl px-4 py-2 text-center min-w-[72px]">
                <div className="font-display text-xl text-foreground leading-none">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-bold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Banner */}
        {notifOpen && (
          <div className="relative overflow-hidden rounded-3xl p-4 mb-6 flex items-center gap-4 text-secondary-foreground bg-gradient-to-r from-secondary via-orange-400 to-yellow-400 shadow-[0_18px_40px_-20px_color-mix(in_oklab,var(--secondary)_60%,transparent)] animate-[slideDown_0.4s_ease-out]">
            <div aria-hidden className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
            <span className="text-3xl flex-shrink-0 drop-shadow-sm">🍅</span>
            <div className="flex-1 relative">
              <div className="font-bold text-sm">{t("dashboard.notif.from")}</div>
              <div className="text-sm font-medium opacity-95">{t("dashboard.notif.msg", { name: user?.name })}</div>
            </div>
            <button onClick={() => setNotifOpen(false)} className="relative w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold cursor-pointer border-0 flex items-center justify-center transition-colors" aria-label="Dismiss notification">✕</button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Active Plant Card */}
          <Card variant="feature" className="lg:col-span-2 p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-display text-2xl text-foreground">🍅 Tomato Buddy</div>
                <div className="text-muted-foreground font-medium text-sm">{t("dashboard.plant.day", { n: activePlant.daysGrowing })}</div>
              </div>
              <Badge color="orange">Stage {activePlant.stage}/{activePlant.maxStage}</Badge>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl bg-gradient-to-br from-secondary/20 to-accent/40 border border-secondary/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                {activePlant.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground/80 mb-2">{t("dashboard.plant.progress")}</div>
                <ProgressBar value={activePlant.stage} max={activePlant.maxStage} color="orange" />
                <div className="flex justify-between text-xs text-muted-foreground font-medium mt-1">
                  <span>{t("dashboard.plant.sprouted")}</span><span>{t("dashboard.plant.ready")}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {activePlant.stages.map((s, i) => (
                    <div key={i} className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg border transition-all ${i < activePlant.stage ? "bg-primary/10 border-primary/30 text-foreground shadow-[0_4px_12px_-6px_color-mix(in_oklab,var(--primary)_50%,transparent)]" : "bg-muted/60 border-border/60 text-muted-foreground/60"}`}>
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
                <div key={label} className="bg-card/70 border border-border/50 rounded-2xl p-3 text-center hover:bg-card transition-colors">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-xs font-bold text-foreground/80">{label}</div>
                  <div className="text-xs text-muted-foreground font-medium">{val}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Memory Tree Mini */}
          <Card variant="accent" className="p-6 group" onClick={() => setPage("/tree")}>
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="font-display text-lg text-foreground">{t("dashboard.tree.title")}</div>
                <div className="text-xs text-muted-foreground font-medium">{t("dashboard.tree.subtitle")}</div>
              </div>
              <Badge color="green">{MOCK_MEMORIES.length} ✦</Badge>
            </div>
            <div className="flex justify-center my-2 transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 160 180" className="w-32 h-40 drop-shadow-[0_8px_16px_color-mix(in_oklab,var(--primary)_25%,transparent)]">
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
            <Btn className="w-full justify-center mt-3" size="sm" onClick={(e) => { e.stopPropagation?.(); setPage("/tree"); }}>{t("dashboard.tree.open")}</Btn>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-10">
          {[
            { icon: "📸", labelKey: "dashboard.actions.addMemory",   tone: "from-primary/15 to-primary/5 text-primary border-primary/20",         action: () => setPage("/tree") },
            { icon: "🌿", labelKey: "dashboard.actions.myPlants",    tone: "from-secondary/15 to-secondary/5 text-secondary border-secondary/20", action: () => setPage("/plants") },
            { icon: "🎨", labelKey: "dashboard.actions.workshop",    tone: "from-yellow-200/60 to-yellow-100/30 text-yellow-900 border-yellow-300/40", action: () => setPage("/workshop") },
            { icon: "⭐", labelKey: "dashboard.actions.vipGarden",   tone: "from-accent/70 to-accent/30 text-accent-foreground border-accent/50",  action: () => setPage("/vip") },
            { icon: "🎁", labelKey: "dashboard.actions.activateKit", tone: "from-secondary/15 to-primary/10 text-foreground border-border/60",     action: () => setActivateOpen(true) },
          ].map(a => (
            <button key={a.labelKey} onClick={a.action}
              className={`group bg-gradient-to-br ${a.tone} rounded-3xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_30px_-18px_color-mix(in_oklab,var(--secondary)_45%,transparent)] cursor-pointer border font-bold text-sm`}>
              <span className="text-3xl transition-transform duration-200 group-hover:scale-110">{a.icon}</span>
              {t(a.labelKey)}
            </button>
          ))}
        </div>

        <ActivateKitModal isOpen={activateOpen} onClose={() => setActivateOpen(false)} />

        {/* Recent Memories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-foreground">{t("dashboard.memories.title")}</h2>
            <button onClick={() => setPage("/tree")} className="text-primary font-bold text-sm hover:text-primary/80 cursor-pointer bg-transparent border-0 inline-flex items-center gap-1">
              {t("dashboard.memories.seeAll")} <span aria-hidden>→</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_MEMORIES.slice(0, 3).map(m => (
              <Card key={m.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 ring-1 ring-inset ring-primary/20 flex items-center justify-center text-xl">{m.emoji}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-foreground line-clamp-1">{m.title}</div>
                    <div className="text-xs text-muted-foreground font-medium">{m.date}</div>
                  </div>
                </div>
                <div className="relative w-full h-24 rounded-2xl flex items-center justify-center text-4xl mb-3 bg-gradient-to-br from-accent/50 via-card to-secondary/15 border border-border/50 overflow-hidden">
                  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_60%)]" />
                  <span className="relative">{m.img}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 font-medium">{m.caption}</p>
                {m.aiGenerated && <div className="mt-2"><Badge color="yellow">{t("dashboard.memories.aiCaption")}</Badge></div>}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

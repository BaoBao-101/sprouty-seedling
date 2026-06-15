import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MOCK_PLANTS } from "../data/mockPlants";
import { Badge } from "../components/sprouty-ui/Badge";
import { Btn } from "../components/sprouty-ui/Btn";
import { Card } from "../components/sprouty-ui/Card";
import { Modal } from "../components/sprouty-ui/Modal";
import { ProgressBar } from "../components/sprouty-ui/ProgressBar";
import { ActivateKitModal } from "../components/ActivateKitModal";

export function PlantsPage() {
  const { t } = useTranslation();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [activateOpen, setActivateOpen] = useState(false);
  const rarityColors = { Common: "green", Rare: "orange", Legendary: "gold" };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="pt-8 mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">{t("plants.badge")}</div>
          <h1 className="font-display text-4xl text-gray-800 mb-2">{t("plants.title")}</h1>
          <p className="text-gray-500 font-semibold">{t("plants.subtitle")}</p>
          <Btn variant="primary" className="mt-4" onClick={() => setActivateOpen(true)}>
            🎁 {t("activate.title")}
          </Btn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PLANTS.map(plant => (
            <Card key={plant.id} className="p-6 overflow-hidden" onClick={() => setSelectedPlant(plant)}>
              <div className="flex items-start justify-between mb-4">
                <Badge color={rarityColors[plant.rarity] || "green"}>{plant.rarity}</Badge>
                <div className="text-xs text-gray-400 font-medium">{t("plants.day", { n: plant.daysGrowing })}</div>
              </div>

              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-6xl mb-3 border-2" style={{background: plant.bg, borderColor: plant.color + "40"}}>
                  <span style={{animation:"float 3s ease-in-out infinite"}}>{plant.emoji}</span>
                </div>
                <h3 className="font-display text-xl text-gray-800">{plant.name}</h3>
                <p className="text-gray-400 text-xs font-medium mt-1">{plant.trait}</p>
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold text-gray-500 mb-2">{t("plants.growthStages")}</div>
                <div className="flex gap-2">
                  {plant.stages.map((s, i) => (
                    <div key={i} className={`flex-1 h-9 rounded-xl flex items-center justify-center text-base border-2 transition-all ${i < plant.stage ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50 opacity-40"}`}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <ProgressBar value={plant.stage} max={plant.maxStage} color={plant.stage === plant.maxStage ? "green" : "orange"} />
              <div className="text-center mt-2 text-xs font-bold" style={{color: plant.color}}>
                {plant.stage === plant.maxStage
                ? t("plants.fullyGrown")
                : t("plants.stageProgress", { current: plant.stage, max: plant.maxStage })}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Plant Detail Modal */}
      <Modal isOpen={!!selectedPlant} onClose={() => setSelectedPlant(null)} title={selectedPlant?.name || ""}>
        {selectedPlant && (
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-7xl border-2" style={{background: selectedPlant.bg, borderColor: selectedPlant.color}}>
                {selectedPlant.emoji}
              </div>
            </div>
            <div className="flex justify-center gap-2 mb-4">
              <Badge color={rarityColors[selectedPlant.rarity]}>{selectedPlant.rarity}</Badge>
              <Badge color="green">Day {selectedPlant.daysGrowing}</Badge>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 border-l-4 border-green-400 mb-4">
              <p className="text-gray-700 font-semibold text-sm leading-relaxed">{selectedPlant.personality}</p>
            </div>
            <div className="mb-4">
              <div className="text-sm font-bold text-gray-700 mb-2">{t("plants.modal.growthJourney")}</div>
              <div className="flex gap-2">
                {selectedPlant.stages.map((s, i) => (
                  <div key={i} className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${i < selectedPlant.stage ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50 opacity-40"}`}>
                    <span className="text-2xl">{s}</span>
                    <span className="text-xs font-bold text-gray-500">{t("plants.modal.stage", { n: i+1 })}</span>
                    {i < selectedPlant.stage && <span className="text-xs text-green-500">✓</span>}
                  </div>
                ))}
              </div>
            </div>
            <Btn className="w-full justify-center">{t("plants.modal.addMemory")}</Btn>
          </div>
        )}
      </Modal>

      <ActivateKitModal isOpen={activateOpen} onClose={() => setActivateOpen(false)} />
    </div>
  );
}

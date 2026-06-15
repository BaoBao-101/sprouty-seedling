import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KITS, WORKSHOPS, PLANS } from "../data/products";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { useFormatVND } from "../hooks/useFormatVND";
import { startCheckout } from "../utils/stripe";
import { Btn } from "../components/sprouty-ui/Btn";
import { Card } from "../components/sprouty-ui/Card";
import { Modal } from "../components/sprouty-ui/Modal";

function OrderModal({ isOpen, onClose, initialProduct }) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const formatVND = useFormatVND();
  const [selectedProduct, setSelectedProduct] = useState(initialProduct ?? KITS[0]);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await startCheckout(selectedProduct.id);
    } catch (err) {
      setLoading(false);
      const key = err.message === "stripe_unavailable"
        ? "workshop.order.stripeUnavailable"
        : "workshop.order.stripeError";
      showToast(t(key), "error");
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const allProducts = [...KITS, ...WORKSHOPS];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("workshop.order.title")}>
      <div className="space-y-4">
        {/* Product selector */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">{t("workshop.order.product")}</label>
          <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-1">
            {allProducts.map(p => (
              <button key={p.id} type="button" onClick={() => !loading && setSelectedProduct(p)}
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${selectedProduct.id === p.id ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                <span className="text-2xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-400 truncate">{p.includes ?? p.subtitle}</div>
                </div>
                <span className="font-bold text-orange-600 text-sm flex-shrink-0">{formatVND(p.price)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-orange-50 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="font-bold text-gray-800 text-sm">{selectedProduct.name}</div>
            <div className="text-xs text-gray-500">{selectedProduct.includes ?? selectedProduct.subtitle}</div>
          </div>
          <span className="font-display text-xl text-orange-600">{formatVND(selectedProduct.price)}</span>
        </div>

        <Btn variant="orange" className="w-full justify-center" size="lg"
          onClick={handleCheckout} disabled={loading}>
          {loading ? t("workshop.order.stripeLoading") : t("workshop.order.stripeBtn")}
        </Btn>
        <p className="text-xs text-center text-gray-400 font-medium">{t("workshop.order.stripeNote")}</p>
      </div>
    </Modal>
  );
}

export function WorkshopPage({ setPage }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const formatVND = useFormatVND();
  const howItWorks = t("workshop.howItWorks", { returnObjects: true });
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedKit, setSelectedKit] = useState(null);

  const openOrder = (product) => {
    if (!user) { setPage(`/register?product=${product?.id ?? KITS[0].id}`); return; }
    setSelectedKit(product ?? KITS[0]);
    setOrderOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="pt-8 mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold mb-4">{t("workshop.badge")}</div>
          <h1 className="font-display text-4xl text-gray-800 mb-2">{t("workshop.title")}</h1>
          <p className="text-gray-500 font-semibold">{t("workshop.subtitle")}</p>
        </div>

        {/* Kit Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {KITS.map(kit => (
            <div key={kit.id} className={`bg-gradient-to-br ${kit.color} rounded-3xl p-6 text-white relative overflow-hidden flex flex-col`}>
              {kit.badge && (
                <span className="absolute top-4 right-4 bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full">{kit.badge}</span>
              )}
              <div className="text-5xl mb-3 text-center">{kit.emoji}</div>
              <h2 className="font-display text-2xl mb-1">{kit.name}</h2>
              <p className="text-white/70 text-xs font-medium mb-3">{kit.subtitle}</p>
              <p className="text-white/80 text-sm leading-relaxed mb-4 flex-1">{kit.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {kit.contents.map(item => (
                  <span key={item} className="bg-white/20 rounded-full px-2.5 py-1 text-xs font-bold">{item}</span>
                ))}
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="font-display text-3xl">{formatVND(kit.price)}</span>
                <span className="text-white/60 line-through text-sm">{formatVND(kit.originalPrice)}</span>
                <span className="bg-white/25 rounded-full px-2 py-0.5 text-xs font-bold">{kit.discount}</span>
              </div>
              <Btn variant="secondary" className="border-white text-white hover:bg-white/20 bg-white/10 w-full justify-center" onClick={() => openOrder(kit)}>
                {t("workshop.orderBtn", { name: kit.name })}
              </Btn>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {howItWorks.map((step, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-green-500 text-white font-display text-base flex items-center justify-center mb-3">{idx + 1}</div>
              <div className="text-2xl mb-2">{step.icon}</div>
              <div className="font-display text-base text-gray-800 mb-1">{step.title}</div>
              <div className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>

        {/* Workshops */}
        <div className="mb-12">
          <h2 className="font-display text-3xl text-gray-800 mb-6 text-center">{t("workshop.upcomingTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {WORKSHOPS.map(w => (
              <Card key={w.id} className={`p-5 border-2 ${w.color}`}>
                <span className="text-4xl block mb-3">{w.emoji}</span>
                <h3 className="font-display text-lg text-gray-800 mb-1">{w.name}</h3>
                <p className="text-xs text-gray-500 font-medium mb-3 leading-relaxed">{w.desc}</p>
                <div className="flex flex-col gap-1 mb-4 text-xs font-bold text-gray-600">
                  <span>📅 {w.date}</span>
                  <span>👥 {t("workshop.spotsLeft", { n: w.spots })}</span>
                  <span>📦 {w.includes}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-xl text-gray-800">{formatVND(w.price)}</span>
                </div>
                <Btn size="sm" variant="secondary" className="w-full justify-center" onClick={() => openOrder(w)}>{t("workshop.register")}</Btn>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing plans */}
        <div>
          <h2 className="font-display text-3xl text-gray-800 mb-6 text-center">{t("workshop.pricingTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PLANS.map(plan => (
              <div key={plan.id} className={`bg-white rounded-3xl p-6 border-2 ${plan.featured ? "border-green-400 shadow-lg shadow-green-100 scale-105" : "border-gray-100"}`}>
                {plan.featured && <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">{t("workshop.popular")}</div>}
                <h3 className="font-display text-2xl text-gray-800 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-display text-3xl text-gray-800">{formatVND(plan.price)}</span>
                  <span className="text-gray-400 text-sm font-medium">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <span className="text-green-500 text-base">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Btn variant={plan.variant} className="w-full justify-center" onClick={() => openOrder(KITS.find(k => k.id === plan.id) ?? KITS[0])}>
                  {plan.btn}
                </Btn>
              </div>
            ))}
          </div>
        </div>
      </div>

      <OrderModal isOpen={orderOpen} onClose={() => setOrderOpen(false)} initialProduct={selectedKit} />
    </div>
  );
}

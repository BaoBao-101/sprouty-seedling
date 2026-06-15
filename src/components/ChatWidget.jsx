import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { usePlants } from "../contexts/PlantContext";
import { classifyIntent, MODE1_RESPONSES, MODE2_RESPONSES, MODE3_RESPONSES } from "../data/chatResponses";
import { KITS, WORKSHOPS } from "../data/products";
import { useFormatVND } from "../hooks/useFormatVND";
import { callChat } from "../lib/gemini";

function renderContent(content) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const code = part.slice(3, -3).replace(/^[a-z]+\n/, "");
      return (
        <pre
          key={i}
          className="bg-gray-900 text-green-300 text-xs rounded-lg p-2 mt-1 mb-1 overflow-x-auto whitespace-pre font-mono leading-relaxed"
        >
          {code.trim()}
        </pre>
      );
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i} className="whitespace-pre-wrap">
        {boldParts.map((bp, j) =>
          bp.startsWith("**") && bp.endsWith("**") ? (
            <strong key={j}>{bp.slice(2, -2)}</strong>
          ) : (
            bp
          )
        )}
      </span>
    );
  });
}

function KitCard({ kit, onView }) {
  const { t } = useTranslation();
  const formatVND = useFormatVND();
  return (
    <div className={`bg-gradient-to-r ${kit.color} text-white rounded-2xl p-3 mt-1`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{kit.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate">{kit.name}</div>
          <div className="text-xs opacity-80">{kit.subtitle}</div>
        </div>
        <div className="font-bold text-sm whitespace-nowrap">{formatVND(kit.price)}</div>
      </div>
      <p className="text-xs opacity-90 mb-2 line-clamp-2">{kit.desc}</p>
      <button onClick={onView} className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl py-1.5 transition-all active:scale-95">
        {t("chat.kitCard.view")}
      </button>
    </div>
  );
}

function WorkshopCard({ ws, onView }) {
  const { t } = useTranslation();
  const formatVND = useFormatVND();
  return (
    <div className="bg-white border-2 border-green-200 rounded-2xl p-3 mt-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{ws.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-gray-800 truncate">{ws.name}</div>
          <div className="text-xs text-gray-500">{ws.date}</div>
        </div>
        <div className="font-bold text-sm text-green-600 whitespace-nowrap">{formatVND(ws.price)}</div>
      </div>
      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{ws.desc}</p>
      <button onClick={onView} className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl py-1.5 transition-all active:scale-95">
        {t("chat.workshopCard.register")}
      </button>
    </div>
  );
}

function UpsellCard({ onUpgrade }) {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-3 mt-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🔒</span>
        <div>
          <div className="font-bold text-sm">{t("chat.upsellCard.title")}</div>
          <div className="text-xs opacity-90">{t("chat.upsellCard.subtitle")}</div>
        </div>
      </div>
      <p className="text-xs opacity-90 mb-2">{t("chat.upsellCard.desc")}</p>
      <button onClick={onUpgrade} className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl py-1.5 transition-all active:scale-95">
        {t("chat.upsellCard.btn")}
      </button>
    </div>
  );
}

export function ChatWidget() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { activePlant } = usePlants();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const hasGreeted = useRef(false);

  const mode = !user ? "sales" : user.isVIP ? "stem" : "care";

  const addMessage = useCallback((role, content, card = null) => {
    setMessages((prev) => [
      ...prev,
      { role, content, card, id: Date.now() + Math.random() },
    ]);
  }, []);

  const getGreeting = useCallback(() => {
    if (!user) return MODE1_RESPONSES.greeting;
    if (user.isVIP) {
      return `Chào ${user.name}! 🌟 Cây ${activePlant?.name || "của bạn"} đang ở giai đoạn ${activePlant?.stage ?? 1}/${activePlant?.maxStage ?? 4}.\nMình là STEM Mentor — hỏi Arduino, ESP32, chăm cây hay bất cứ thứ gì cũng được! 🔧`;
    }
    return `Xin chào ${user.name}! 🌸\nCây ${activePlant?.name || "của bạn"} đang ở giai đoạn ${activePlant?.stage ?? 1} rồi nè!\nMình có thể giúp gì cho bạn hôm nay? 💚`;
  }, [user, activePlant]);

  useEffect(() => {
    if (isOpen && !hasGreeted.current) {
      hasGreeted.current = true;
      const timer = setTimeout(() => addMessage("bot", getGreeting()), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, getGreeting, addMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getBotResponse = useCallback(
    (text) => {
      const intent = classifyIntent(text);
      const t = text.toLowerCase();

      if (!user) {
        if (intent === "purchase") {
          return {
            content: "Đây là các bộ kit của Sprouty! 🛒 Chọn cái phù hợp với bạn nhé:",
            kitCards: KITS,
          };
        }
        for (const item of MODE1_RESPONSES.general) {
          if (item.match.some((k) => t.includes(k))) {
            return {
              content: item.response,
              workshopCards: item.showWorkshops ? WORKSHOPS.slice(0, 2) : null,
            };
          }
        }
        return { content: MODE1_RESPONSES.fallback };
      }

      if (intent === "tech") {
        if (!user.isVIP) {
          return {
            content:
              "Câu hỏi hay đó! 🔧 Nhưng tính năng STEM Mentor dành cho gói Advanced nhé. Nâng cấp để mở khóa hướng dẫn Arduino, ESP32 và IoT chuyên sâu! 🔒",
            upsell: true,
          };
        }
        for (const item of MODE3_RESPONSES.tech) {
          if (item.match.some((k) => t.includes(k))) {
            return { content: item.response };
          }
        }
        return { content: MODE3_RESPONSES.fallback };
      }

      if (intent === "care") {
        for (const item of MODE2_RESPONSES.care) {
          if (item.match.some((k) => t.includes(k))) {
            return { content: item.response };
          }
        }
        return { content: MODE2_RESPONSES.fallback };
      }

      if (intent === "purchase") {
        return {
          content: "Bạn muốn xem thêm sản phẩm? 🌱 Ghé Workshop để chọn kit nhé!",
          navTo: "/workshop",
        };
      }

      return {
        content: user.isVIP
          ? "Mình có thể giúp về chăm cây 🌱, Arduino/ESP32 🔧, hay bất cứ thứ gì liên quan đến Sprouty! Hỏi mình nhé."
          : "Mình có thể giúp về chăm cây 🌱, tưới nước 💧, ánh sáng ☀️ hay theo dõi giai đoạn phát triển. Hỏi mình nhé!",
      };
    },
    [user]
  );

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    addMessage("user", text);
    setIsTyping(true);

    try {
      const intent = classifyIntent(text);

      let content = "";
      let cards = null; // { type: "kit"|"workshop"|"upsell", items? }
      let navTo = null;

      const plantCtx = {
        name: activePlant?.name,
        stage: activePlant?.stage,
        maxStage: activePlant?.maxStage,
        days: activePlant?.daysGrowing,
      };

      // Purchase intent (guest) → skip AI, show kit cards immediately (per CLAUDE.md §8.4)
      if (!user && intent === "purchase") {
        content = "Đây là các bộ kit của Sprouty! 🛒 Chọn cái phù hợp với bạn nhé:";
        cards = { type: "kit", items: KITS };
      // Tech intent for non-VIP → upsell card, no AI
      } else if (user && !user.isVIP && intent === "tech") {
        content = "Câu hỏi hay đó! 🔧 Nhưng tính năng STEM Mentor dành cho gói Advanced nhé. Nâng cấp để mở khóa hướng dẫn Arduino, ESP32 và IoT chuyên sâu! 🔒";
        cards = { type: "upsell" };
      } else {
        // Try Gemini; fall back to synchronous canned responses
        try {
          content = await callChat(text, mode, plantCtx);
        } catch {
          const res = getBotResponse(text);
          content = res.content;
          if (res.kitCards) cards = { type: "kit", items: res.kitCards };
          else if (res.workshopCards) cards = { type: "workshop", items: res.workshopCards };
          else if (res.upsell) cards = { type: "upsell" };
          navTo = res.navTo ?? null;
        }

        // Logged-in purchase intent → navigate to workshop
        if (user && intent === "purchase") navTo = "/workshop";
      }

      setIsTyping(false);
      addMessage("bot", content);

      if (cards?.type === "kit") {
        cards.items.forEach((kit, i) =>
          setTimeout(() => addMessage("bot", "", { type: "kit", data: kit }), 200 * (i + 1))
        );
      } else if (cards?.type === "workshop") {
        cards.items.forEach((ws, i) =>
          setTimeout(() => addMessage("bot", "", { type: "workshop", data: ws }), 200 * (i + 1))
        );
      } else if (cards?.type === "upsell") {
        setTimeout(() => addMessage("bot", "", { type: "upsell" }), 300);
      }

      if (navTo) setTimeout(() => navigate(navTo), 1200);
    } catch {
      setIsTyping(false);
      addMessage("bot", "Xin lỗi, mình gặp lỗi rồi! Thử lại nhé 🌱");
    }
  }, [input, isTyping, addMessage, getBotResponse, user, activePlant, mode, navigate]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const modeLabel = t(`chat.modes.${mode}`);

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "480px" }}
        >
          <div className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-3 flex items-center gap-2 flex-shrink-0">
            <span className="text-xl">🌱</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm">Sprouty Bot</div>
              <div className="text-white/80 text-xs">{modeLabel}</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white text-2xl leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
              aria-label={t("chat.aria.close")}
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.card ? (
                  <div className="ml-7">
                    {msg.card.type === "kit" && (
                      <KitCard
                        kit={msg.card.data}
                        onView={() => navigate("/workshop")}
                      />
                    )}
                    {msg.card.type === "workshop" && (
                      <WorkshopCard
                        ws={msg.card.data}
                        onView={() => navigate("/workshop")}
                      />
                    )}
                    {msg.card.type === "upsell" && (
                      <UpsellCard onUpgrade={() => navigate("/super")} />
                    )}
                  </div>
                ) : (
                  <div
                    className={`flex items-end gap-1.5 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "bot" && (
                      <span className="text-base flex-shrink-0 mb-0.5">🌱</span>
                    )}
                    <div
                      className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-green-500 text-white rounded-br-sm"
                          : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                      }`}
                    >
                      {renderContent(msg.content)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-1.5">
                <span className="text-base flex-shrink-0">🌱</span>
                <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="px-3 py-2.5 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t("chat.placeholder")}
              className="flex-1 bg-gray-100 rounded-2xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-300 transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
              aria-label={t("chat.aria.send")}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center text-2xl"
        aria-label={isOpen ? t("chat.aria.close") : t("chat.aria.open")}
      >
        {isOpen ? "✕" : "🌱"}
      </button>
    </>
  );
}

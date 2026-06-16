import { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useMemories } from "../contexts/MemoryContext";
import { usePlants } from "../contexts/PlantContext";
import { useToast } from "../hooks/useToast";
import { Badge } from "../components/sprouty-ui/Badge";
import { Btn } from "../components/sprouty-ui/Btn";
import { Modal } from "../components/sprouty-ui/Modal";
import { Field, Input, Textarea } from "../components/sprouty-ui/Field";
import { compressImage, validateVideo, getFileCategory } from "../utils/compress";

const LEAF_POSITIONS = [
  { cx: 105, cy: 105, fill: "#FF8A65" }, { cx: 370, cy:  90, fill: "#F48FB1" },
  { cx: 155, cy: 145, fill: "#FFD54F" }, { cx: 330, cy: 140, fill: "#CE93D8" },
  { cx: 220, cy:  75, fill: "#81D4FA" }, { cx: 265, cy: 130, fill: "#80CBC4" },
  { cx: 180, cy: 185, fill: "#FFAB91" }, { cx: 310, cy: 185, fill: "#A5D6A7" },
  { cx: 240, cy: 165, fill: "#FFD54F" }, { cx: 130, cy: 190, fill: "#F48FB1" },
  { cx: 340, cy: 175, fill: "#81D4FA" }, { cx: 205, cy: 115, fill: "#CE93D8" },
];

function UploadModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { addMemory, generateAICaption, memories } = useMemories();
  const { activePlant } = usePlants();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const TYPE_CONFIG = {
    photo:   { icon: "📷", imgIcon: "📸", label: t("tree.upload.photo"), accept: "image/*" },
    video:   { icon: "🎬", imgIcon: "🎬", label: t("tree.upload.video"), accept: "video/mp4,video/quicktime,video/webm" },
    journal: { icon: "✏️", imgIcon: "📝", label: t("tree.upload.journal"), accept: null },
  };

  const [form, setForm] = useState({ type: "photo", title: "", caption: "" });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCaption, setAiCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const [fileState, setFileState] = useState(null);
  // fileState: null | { status: "compressing"|"ready"|"error", name, sizeKB?, previewURL?, errorKey? }

  const resetFile = () => {
    if (fileState?.previewURL) URL.revokeObjectURL(fileState.previewURL);
    setFileState(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTypeChange = (type) => {
    setForm(f => ({ ...f, type }));
    resetFile();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const category = getFileCategory(file);

    if (category === "image") {
      setFileState({ status: "compressing", name: file.name });
      try {
        const { file: compressed, sizeKB } = await compressImage(file);
        const previewURL = URL.createObjectURL(compressed);
        setFileState({ status: "ready", name: compressed.name, sizeKB, previewURL, file: compressed });
      } catch {
        setFileState({ status: "error", name: file.name, errorKey: "tree.upload.compressError" });
      }
    } else if (category === "video") {
      const { valid, sizeMB } = validateVideo(file);
      if (!valid) {
        setFileState({ status: "error", name: file.name, errorKey: "tree.upload.videoTooBig", sizeMB });
      } else {
        setFileState({ status: "ready", name: file.name, sizeMB, file });
      }
    } else {
      setFileState({ status: "error", name: file.name, errorKey: "tree.upload.unsupportedFile" });
    }
  };

  const handleAICaption = async () => {
    setAiLoading(true);
    const cap = await generateAICaption(
      form.type,
      activePlant?.name ?? "cây nhỏ",
      activePlant?.stage ?? 1
    );
    setAiCaption(cap);
    setForm(f => ({ ...f, caption: cap }));
    setAiLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const cfg = TYPE_CONFIG[form.type];
    try {
      await addMemory({
        emoji:        cfg.icon,
        title:        form.title.trim() || t("tree.upload.defaultTitle", { n: memories.length + 1 }),
        img:          fileState?.previewURL ?? cfg.imgIcon,
        caption:      form.caption.trim() || t("tree.upload.defaultCaption"),
        aiGenerated:  !!aiCaption && form.caption === aiCaption,
        type:         form.type,
      }, fileState?.file ?? null);
      setForm({ type: "photo", title: "", caption: "" });
      setAiCaption("");
      resetFile();
      showToast(t("tree.upload.toast"), "success");
      onClose();
    } catch {
      showToast(t("tree.upload.uploadError"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm({ type: "photo", title: "", caption: "" });
    setAiCaption("");
    resetFile();
    onClose();
  };

  const cfg = TYPE_CONFIG[form.type];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("tree.upload.title") || "🌿 Trồng Một Ký Ức Mới"}>
      <div className="space-y-4">
        {/* Type tabs */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(TYPE_CONFIG).map(([type, tcfg]) => (
            <button key={type} type="button" onClick={() => handleTypeChange(type)}
              className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${form.type === type ? "border-green-400 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <span className="text-2xl block mb-1">{tcfg.icon}</span>
              <span className="text-xs font-bold text-gray-700">{tcfg.label}</span>
            </button>
          ))}
        </div>

        {/* Upload area */}
        {form.type === "journal" ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50">
            <span className="text-4xl block mb-2">📝</span>
            <p className="text-gray-500 font-semibold text-sm">{t("tree.upload.dropJournal")}</p>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={cfg.accept}
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {/* Compressing state */}
              {fileState?.status === "compressing" && (
                <>
                  <span className="text-4xl block mb-2 animate-spin">🌀</span>
                  <p className="text-gray-500 font-semibold text-sm">{t("tree.upload.compressing")}</p>
                </>
              )}

              {/* Ready — image with preview */}
              {fileState?.status === "ready" && fileState.previewURL && (
                <>
                  <img src={fileState.previewURL} alt="preview"
                    className="w-24 h-24 object-cover rounded-xl mx-auto mb-2 border border-green-200" />
                  <p className="text-green-700 font-bold text-sm">{fileState.name}</p>
                  <p className="text-green-500 text-xs mt-1">
                    {t("tree.upload.compressed", { size: fileState.sizeKB })}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{t("tree.upload.clickToChange")}</p>
                </>
              )}

              {/* Ready — video (no preview, just filename) */}
              {fileState?.status === "ready" && !fileState.previewURL && (
                <>
                  <span className="text-4xl block mb-2">🎬</span>
                  <p className="text-green-700 font-bold text-sm">{fileState.name}</p>
                  <p className="text-green-500 text-xs mt-1">
                    {t("tree.upload.videoReady", { size: fileState.sizeMB })}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{t("tree.upload.clickToChange")}</p>
                </>
              )}

              {/* Error state */}
              {fileState?.status === "error" && (
                <>
                  <span className="text-4xl block mb-2">⚠️</span>
                  <p className="text-red-500 font-bold text-sm">
                    {t(fileState.errorKey, { size: fileState.sizeMB })}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{t("tree.upload.clickToRetry")}</p>
                </>
              )}

              {/* Default idle state */}
              {!fileState && (
                <>
                  <span className="text-4xl block mb-2">☁️</span>
                  <p className="text-gray-500 font-semibold text-sm">{t("tree.upload.dropFile")}</p>
                  <p className="text-gray-400 text-xs mt-1">{t("tree.upload.fileHint")}</p>
                </>
              )}
            </div>
          </>
        )}

        {/* Title */}
        <Field label={t("tree.upload.titleLabel")} htmlFor="mem-title">
          <Input
            id="mem-title"
            type="text"
            placeholder={`VD: Ngày đầu tiên tưới cây, Chụp ảnh với ${form.type === "photo" ? "cây nhỏ" : "buddy"}...`}
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
        </Field>

        {/* Caption + AI button */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="mem-caption" className="block text-sm font-semibold text-foreground/80">
              {t("tree.upload.captionLabel")}
            </label>
            <button type="button" onClick={handleAICaption} disabled={aiLoading}
              className="text-xs bg-yellow-200/60 text-yellow-900 px-3 py-1.5 rounded-full font-bold hover:bg-yellow-300/70 disabled:opacity-60 cursor-pointer border-0 flex items-center gap-1 transition-colors">
              {aiLoading ? t("tree.upload.aiLoading") : t("tree.upload.aiBtn")}
            </button>
          </div>
          <Textarea
            id="mem-caption"
            value={form.caption}
            onChange={e => { setForm(f => ({ ...f, caption: e.target.value })); setAiCaption(""); }}
            placeholder={t("tree.upload.captionPlaceholder")}
            rows={3}
          />
        </div>

        {/* AI caption preview */}
        {aiCaption && form.caption === aiCaption && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 flex items-start gap-2">
            <span className="text-yellow-500 text-lg flex-shrink-0">✨</span>
            <p className="text-yellow-800 text-sm font-semibold">{aiCaption}</p>
          </div>
        )}

        <Btn className="w-full" size="lg" onClick={handleSave} disabled={saving || fileState?.status === "compressing" || fileState?.status === "error"}>
          {saving ? t("tree.upload.saving") : t("tree.upload.save")}
        </Btn>
      </div>
    </Modal>
  );
}

function MemoryDetailModal({ memory, onClose }) {
  const { t } = useTranslation();
  return (
    <Modal isOpen={!!memory} onClose={onClose} title={memory?.title ?? ""}>
      {memory && (
        <div>
          {memory.aiGenerated && (
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              {t("tree.detail.aiCaption")}
            </div>
          )}
          <div className="w-full h-44 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl flex items-center justify-center text-7xl mb-4 border border-green-100">
            {memory.img}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Badge color="green">{memory.type}</Badge>
            <span className="text-gray-400 text-sm font-medium">{memory.date}</span>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 border-l-4 border-green-400 mb-4">
            <p className="text-gray-700 font-semibold leading-relaxed text-sm">{memory.caption}</p>
          </div>
          <div className="flex gap-3">
            <Btn className="flex-1 justify-center" size="sm">{t("tree.detail.like")}</Btn>
            <Btn variant="secondary" className="flex-1 justify-center" size="sm">{t("tree.detail.share")}</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function MemoryTreePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { memories } = useMemories();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  // Compute unique weeks dynamically from actual memories
  const weeks = useMemo(() => {
    const weekSet = new Set(memories.map(m => m.week).filter(Boolean));
    return [...weekSet].sort((a, b) => a - b);
  }, [memories]);

  const progressWidth = Math.min((memories.length / LEAF_POSITIONS.length) * 290, 290);

  return (
    <div className="relative min-h-screen overflow-hidden pt-20 pb-16 px-4 bg-[oklch(0.270_0.045_148)] text-white">
      {/* Ambient backdrop — warm sunset filtering through canopy */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.345_0.060_146)] via-[oklch(0.290_0.050_150)] to-[oklch(0.230_0.040_155)]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-[26rem] h-[26rem] rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-yellow-400/10 blur-3xl" />
        {/* faint star field */}
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="absolute rounded-full bg-white/40"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              opacity: 0.25 + (i % 4) * 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center pt-8 mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 text-green-100 px-4 py-1.5 rounded-full text-xs font-bold mb-4 backdrop-blur ring-1 ring-inset ring-white/15 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
            {t("tree.badge")}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3 drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)]">
            {user?.treeName || "Cây Kỷ Niệm Của Tôi"}
          </h1>
          <p className="text-green-200/90 font-medium">
            {t("tree.memoriesCount", { count: memories.length })}
          </p>

          {/* Stat strip */}
          <div className="mt-6 inline-flex flex-wrap justify-center gap-2 bg-white/5 backdrop-blur border border-white/10 rounded-full p-1.5">
            {[
              { v: memories.length,                                 l: "leaves" },
              { v: LEAF_POSITIONS.length - memories.length,         l: "to grow" },
              { v: weeks.length,                                    l: "weeks" },
            ].map(s => (
              <div key={s.l} className="px-4 py-1.5 rounded-full bg-white/5">
                <span className="font-display text-lg text-white leading-none mr-1.5">{s.v}</span>
                <span className="text-[10px] uppercase tracking-wider text-green-200/80 font-bold">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tree SVG */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            {/* Halo behind tree */}
            <div aria-hidden className="absolute inset-0 flex items-center justify-center">
              <div className="w-[70%] h-[70%] rounded-full bg-gradient-to-br from-yellow-200/15 via-primary/10 to-transparent blur-3xl" />
            </div>
            <svg viewBox="0 0 480 480" className="relative w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
              {/* Stars */}
              {[[20,30],[440,20],[460,120],[15,200],[455,300]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="2" fill="white" opacity="0.4"/>
              ))}
              {/* Ground */}
              <ellipse cx="240" cy="462" rx="160" ry="18" fill="#1B4332" opacity="0.6"/>
              {/* Trunk */}
              <path d="M228 460 Q224 400 226 360 Q228 320 232 280" stroke="#5D4037" strokeWidth="26" strokeLinecap="round" fill="none"/>
              <path d="M228 460 Q208 472 188 466" stroke="#5D4037" strokeWidth="14" strokeLinecap="round" fill="none"/>
              <path d="M228 460 Q248 474 268 466" stroke="#5D4037" strokeWidth="14" strokeLinecap="round" fill="none"/>
              {/* Canopy layers — dark to light */}
              <ellipse cx="240" cy="230" rx="155" ry="140" fill="#1B5E20"/>
              <ellipse cx="165" cy="255" rx="115" ry="100" fill="#2E7D32"/>
              <ellipse cx="315" cy="248" rx="115" ry="100" fill="#2E7D32"/>
              <ellipse cx="240" cy="200" rx="152" ry="134" fill="#388E3C"/>
              <ellipse cx="195" cy="215" rx="112" ry="98"  fill="#43A047"/>
              <ellipse cx="290" cy="208" rx="110" ry="98"  fill="#43A047"/>
              <ellipse cx="240" cy="175" rx="140" ry="124" fill="#4CAF50"/>
              <ellipse cx="240" cy="148" rx="108" ry="100" fill="#66BB6A"/>
              <ellipse cx="234" cy="122" rx="72"  ry="64"  fill="#81C784" opacity="0.65"/>
              {/* Memory leaves */}
              {LEAF_POSITIONS.map((leaf, i) => {
                const mem = memories[i];
                return (
                  <g key={i}
                    className={mem ? "cursor-pointer" : "cursor-default"}
                    role={mem ? "button" : undefined}
                    tabIndex={mem ? 0 : -1}
                    aria-label={mem ? `${mem.title} — ${mem.date}` : undefined}
                    onClick={() => mem && setSelectedMemory(mem)}
                    onKeyDown={e => { if (mem && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setSelectedMemory(mem); } }}
                    style={{ transform: "scale(1)", transformOrigin: `${leaf.cx}px ${leaf.cy}px`, transition: "transform 0.2s" }}
                    onMouseEnter={e => { if (mem) e.currentTarget.style.transform = "scale(1.25)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                    onFocus={e => { if (mem) e.currentTarget.style.transform = "scale(1.25)"; }}
                    onBlur={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                    <ellipse cx={leaf.cx} cy={leaf.cy} rx="22" ry="17"
                      fill={leaf.fill} opacity={mem ? "0.95" : "0.35"}/>
                    {mem ? (
                      <>
                        <text x={leaf.cx} y={leaf.cy - 3} fontSize="11" textAnchor="middle" dominantBaseline="middle" fill="white">{mem.emoji}</text>
                        <text x={leaf.cx} y={leaf.cy + 7} fontSize="7" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="sans-serif">{t("tree.tapLeaf")}</text>
                      </>
                    ) : (
                      <text x={leaf.cx} y={leaf.cy} fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.35)">+</text>
                    )}
                  </g>
                );
              })}
              {/* Pot */}
              <path d="M188 460 Q188 476 238 480 Q288 476 288 460" fill="#EF6C00"/>
              <rect x="182" y="435" width="112" height="32" rx="12" fill="#FF8A65"/>
              <rect x="175" y="426" width="126" height="16" rx="8"  fill="#EF6C00"/>
              <circle cx="212" cy="448" r="9" fill="#FFD54F" opacity="0.85"/>
              <circle cx="238" cy="452" r="7" fill="#81D4FA" opacity="0.85"/>
              <circle cx="263" cy="446" r="8" fill="#F48FB1" opacity="0.85"/>
              {/* Progress bar */}
              <rect x="95" y="472" width="290" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
              <rect x="95" y="472" width={progressWidth} height="8" rx="4" fill="#A5D6A7"/>
            </svg>
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-green-200 text-xs font-bold">
              {t("tree.leafProgress", { count: memories.length, max: LEAF_POSITIONS.length })}
            </div>
          </div>
        </div>

        {/* Add memory CTA */}
        <div className="text-center mb-10">
          <Btn size="lg" variant="gold" onClick={() => setShowUpload(true)}>
            ✨ {t("tree.addMemory")}
          </Btn>
        </div>

        {/* Timeline */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-2xl">{t("tree.timeline.title")}</h3>
            <span className="text-xs font-bold text-green-200/80 uppercase tracking-wider">
              {memories.length} / {LEAF_POSITIONS.length}
            </span>
          </div>
          {weeks.length === 0 ? (
            <p className="text-green-300 text-sm font-medium text-center py-4">{t("tree.timeline.empty")}</p>
          ) : (
            <div className="space-y-5">
              {weeks.map(week => {
                const weekMems = memories.filter(m => m.week === week);
                return (
                  <div key={week} className="relative pl-6">
                    <span aria-hidden className="absolute left-1.5 top-1.5 bottom-1 w-px bg-gradient-to-b from-yellow-300/70 via-white/20 to-transparent" />
                    <span aria-hidden className="absolute left-0 top-1 w-3 h-3 rounded-full bg-yellow-300 ring-4 ring-yellow-300/20" />
                    <div className="text-xs font-bold text-green-200/90 mb-2 uppercase tracking-wider">
                      {t("tree.timeline.week", { n: week })}
                    </div>
                    <div className="flex flex-col gap-2">
                      {weekMems.map(m => (
                        <button key={m.id} onClick={() => setSelectedMemory(m)}
                          className="group flex items-center gap-3 bg-white/[0.06] hover:bg-white/[0.12] rounded-2xl p-3 text-left transition-all w-full cursor-pointer border border-white/5 hover:border-white/15 hover:-translate-y-px">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg bg-gradient-to-br from-white/15 to-white/5 ring-1 ring-inset ring-white/10 flex-shrink-0 group-hover:scale-105 transition-transform">
                            {m.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm truncate">{m.title}</div>
                            <div className="text-green-200/70 text-xs font-medium">{m.date}</div>
                          </div>
                          {m.aiGenerated && (
                            <span className="bg-yellow-300/15 text-yellow-200 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold flex-shrink-0 ring-1 ring-inset ring-yellow-300/30">{t("tree.timeline.ai")}</span>
                          )}
                          <span aria-hidden className="text-white/30 group-hover:text-white/70 transition-colors">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
      <MemoryDetailModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
    </div>
  );
}

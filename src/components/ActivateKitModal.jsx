import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usePlants } from "../contexts/PlantContext";
import { Modal } from "./sprouty-ui/Modal";
import { Btn } from "./sprouty-ui/Btn";
import { Badge } from "./sprouty-ui/Badge";

const RARITY_COLOR = { Common: "green", Rare: "orange", Legendary: "gold" };
const PIN_REGEX = /^[A-Z0-9]{6,10}$/;

// Normalize raw input → uppercase alphanumeric only
const normalizePin = (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

export function ActivateKitModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { activatePlant } = usePlants();

  const [pin, setPin]               = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [activatedPlant, setActivatedPlant] = useState(null);
  const [scanning, setScanning]     = useState(false);
  const [scanUnsupported, setScanUnsupported] = useState(false);

  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const rafRef    = useRef(null);

  // Pure hardware cleanup — no setState so it's safe to call from effects
  const stopStream = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopStream();
    setScanning(false);
  }, [stopStream]);

  // Release camera hardware when modal closes (no setState in effect body)
  useEffect(() => {
    if (!isOpen) stopStream();
  }, [isOpen, stopStream]);

  const handleClose = () => {
    if (loading) return;
    stopCamera();
    setPin(""); setError(null); setActivatedPlant(null);
    onClose();
  };

  const startCamera = async () => {
    if (!("BarcodeDetector" in window)) {
      setScanUnsupported(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setScanning(true);
      // attach stream after state update so videoRef is mounted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          scanFrame();
        }
      }, 100);
    } catch {
      setScanUnsupported(true);
    }
  };

  const scanFrame = async () => {
    if (!videoRef.current || !streamRef.current) return;
    try {
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      const barcodes = await detector.detect(videoRef.current);
      if (barcodes.length > 0) {
        const raw = normalizePin(barcodes[0].rawValue);
        stopCamera();
        setPin(raw);
        return;
      }
    } catch { /* continue scanning */ }
    rafRef.current = requestAnimationFrame(scanFrame);
  };

  const handleSubmit = async () => {
    const normalized = normalizePin(pin);
    if (!PIN_REGEX.test(normalized)) {
      setError(t("activate.errorFormat"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const plant = await activatePlant(normalized);
      setActivatedPlant(plant);
    } catch (err) {
      const code = err.code?.replace("functions/", "") ?? "";
      const msg  = err.message ?? "";
      if (msg === "demo_mode")          setError(t("activate.errorDemo"));
      else if (msg === "pin_not_found") setError(t("activate.errorNotFound"));
      else if (msg === "pin_already_used")  setError(t("activate.errorUsed"));
      else if (msg === "pin_already_yours") setError(t("activate.errorYours"));
      else if (code === "unauthenticated")  setError(t("activate.errorAuth"));
      else setError(t("activate.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("activate.title")}>
      {activatedPlant ? (
        /* ── Success view ── */
        <div className="text-center py-4">
          <div className="text-6xl mb-3" style={{ animation: "float 3s ease-in-out infinite" }}>
            {activatedPlant.emoji}
          </div>
          <h3 className="font-display text-2xl text-gray-800 mb-1">{activatedPlant.name}</h3>
          <div className="flex justify-center gap-2 mb-3">
            <Badge color={RARITY_COLOR[activatedPlant.rarity] ?? "green"}>{activatedPlant.rarity}</Badge>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-6">{t("activate.successMsg")}</p>
          <Btn variant="primary" className="w-full justify-center" onClick={handleClose}>
            {t("activate.successBtn")}
          </Btn>
        </div>
      ) : (
        /* ── Input view ── */
        <div className="space-y-4">
          <p className="text-sm text-gray-500 font-medium">{t("activate.hint")}</p>

          {/* Camera scanner */}
          {scanning ? (
            <div className="relative rounded-2xl overflow-hidden bg-black">
              <video ref={videoRef} className="w-full h-48 object-cover" playsInline muted />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 border-4 border-green-400 rounded-2xl opacity-70" />
              </div>
              <button onClick={stopCamera}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer border-0">
                ✕
              </button>
              <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-bold">
                {t("activate.scanning")}
              </p>
            </div>
          ) : (
            <button onClick={startCamera}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer bg-transparent text-left">
              <span className="text-2xl">📷</span>
              <span className="text-sm font-bold text-gray-600">
                {scanUnsupported ? t("activate.scanUnsupported") : t("activate.scanBtn")}
              </span>
            </button>
          )}

          {/* PIN input */}
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">
              {t("activate.pinLabel")}
            </label>
            <input
              type="text"
              value={pin}
              onChange={e => { setPin(normalizePin(e.target.value)); setError(null); }}
              onKeyDown={e => e.key === "Enter" && !loading && handleSubmit()}
              placeholder={t("activate.pinPlaceholder")}
              maxLength={10}
              className={`w-full px-4 py-3 rounded-2xl border-2 outline-none font-mono text-lg tracking-widest font-bold text-center transition-colors ${
                error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-green-400"
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
          </div>

          <Btn variant="primary" className="w-full justify-center" size="lg"
            onClick={handleSubmit} disabled={loading || pin.length < 6}>
            {loading ? t("activate.activating") : t("activate.activateBtn")}
          </Btn>

          <p className="text-xs text-center text-gray-400 font-medium">{t("activate.footer")}</p>
        </div>
      )}
    </Modal>
  );
}

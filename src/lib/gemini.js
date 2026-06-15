import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { app, FIREBASE_ENABLED } from "./firebase";

let _functions = null;

function getFunctionsInstance() {
  if (!FIREBASE_ENABLED) return null;
  if (!_functions) {
    _functions = getFunctions(app, "asia-southeast1");
    if (import.meta.env.DEV && import.meta.env.VITE_FUNCTIONS_EMULATOR === "true") {
      connectFunctionsEmulator(_functions, "localhost", 5001);
    }
  }
  return _functions;
}

/**
 * Call the Gemini-backed chat Cloud Function.
 * Throws if Firebase is not configured or the function fails.
 */
export async function callChat(message, mode, plantContext = {}) {
  const fns = getFunctionsInstance();
  if (!fns) throw new Error("Firebase not configured");
  const fn = httpsCallable(fns, "chat");
  const result = await fn({ message, mode, plantContext });
  return result.data.text;
}

/**
 * Call the generateCaption Cloud Function.
 * Throws if Firebase is not configured or the function fails.
 */
export async function callGenerateCaption(memoryType, plantName, plantStage) {
  const fns = getFunctionsInstance();
  if (!fns) throw new Error("Firebase not configured");
  const fn = httpsCallable(fns, "generateCaption");
  const result = await fn({ memoryType, plantName, plantStage });
  return result.data.caption;
}

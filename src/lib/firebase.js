import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const cfg = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only initialise when all required values are present (allows demo mode without .env.local)
export const FIREBASE_ENABLED = Boolean(cfg.apiKey && cfg.projectId && cfg.appId);
export const STORAGE_ENABLED  = FIREBASE_ENABLED && Boolean(cfg.storageBucket);

export const app       = FIREBASE_ENABLED ? initializeApp(cfg) : null;
export const auth      = FIREBASE_ENABLED ? getAuth(app) : null;
export const db        = FIREBASE_ENABLED ? getFirestore(app) : null;
export const storage   = STORAGE_ENABLED  ? getStorage(app) : null;
export const functions = FIREBASE_ENABLED ? getFunctions(app, "asia-southeast1") : null;

if (FIREBASE_ENABLED && import.meta.env.VITE_FUNCTIONS_EMULATOR === "true") {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

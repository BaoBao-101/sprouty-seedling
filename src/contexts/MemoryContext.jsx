/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  collection, addDoc, onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db, FIREBASE_ENABLED, STORAGE_ENABLED } from "../lib/firebase";
import { uploadMemoryFile } from "../utils/storage";
import { callGenerateCaption } from "../lib/gemini";
import { useAuth } from "./AuthContext";
import { MOCK_MEMORIES } from "../data/mockMemories";

const MemoryContext = createContext(null);

const AI_CAPTIONS = [
  "Tomato Buddy is so proud of you today! 🍅 Look how tall you've both grown 🌱✨",
  "Another magical day in the garden! Your plant buddy gives you a big leafy hug 🌿💚",
  "The best gardener in the whole world strikes again! 🏆🌻",
  "Every memory you plant here is a seed of joy that blooms forever! 🌸",
];

export function MemoryProvider({ children }) {
  const { user } = useAuth();
  const [memories, setMemories] = useState(MOCK_MEMORIES);

  const isRealUser = FIREBASE_ENABLED && user && !user.isMock;

  useEffect(() => {
    if (!isRealUser) return;

    const q = query(
      collection(db, "users", user.uid, "memories"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMemories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsub(); setMemories(MOCK_MEMORIES); };
  }, [isRealUser, user?.uid]);

  // file: optional compressed File object — uploaded to Cloud Storage when available
  const addMemory = async (memoryData, file) => {
    let img = memoryData.img;

    // Upload to Cloud Storage if real user + file provided + storage configured
    if (isRealUser && file && STORAGE_ENABLED) {
      img = await uploadMemoryFile(user.uid, file);
    }

    if (!isRealUser) {
      setMemories(prev => [{
        id: `m${Date.now()}`,
        leafId: `l${prev.length + 1}`,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        week: Math.ceil((prev.length + 1) / 3),
        aiGenerated: false,
        ...memoryData,
        img,
      }, ...prev]);
      return;
    }

    await addDoc(collection(db, "users", user.uid, "memories"), {
      ...memoryData,
      img,
      createdAt: serverTimestamp(),
    });
    // onSnapshot listener updates memories automatically
  };

  const generateAICaption = async (type = "photo", plantName = "cây nhỏ", plantStage = 1) => {
    if (isRealUser) {
      try {
        return await callGenerateCaption(type, plantName, plantStage);
      } catch {
        // Cloud Function unavailable — fall through to mock
      }
    }
    await new Promise(r => setTimeout(r, 1200));
    return AI_CAPTIONS[Math.floor(Math.random() * AI_CAPTIONS.length)];
  };

  return (
    <MemoryContext.Provider value={{ memories, addMemory, generateAICaption }}>
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemories() {
  const ctx = useContext(MemoryContext);
  if (!ctx) throw new Error("useMemories must be used inside MemoryProvider");
  return ctx;
}

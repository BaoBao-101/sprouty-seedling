/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions, FIREBASE_ENABLED } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import { MOCK_PLANTS } from "../data/mockPlants";

const PlantContext = createContext(null);

export function PlantProvider({ children }) {
  const { user } = useAuth();
  const [plants, setPlants]           = useState(MOCK_PLANTS);
  const [activePlantId, setActivePlantId] = useState(MOCK_PLANTS[0].id);

  const isRealUser = FIREBASE_ENABLED && user && !user.isMock;

  useEffect(() => {
    if (!isRealUser) return;

    const unsub = onSnapshot(collection(db, "users", user.uid, "plants"), (snap) => {
      if (snap.empty) {
        // New user with no saved plants — show mock starters
        setPlants(MOCK_PLANTS);
        setActivePlantId(MOCK_PLANTS[0].id);
      } else {
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPlants(fetched);
        setActivePlantId(prev =>
          fetched.find(p => p.id === prev) ? prev : fetched[0].id
        );
      }
    });
    return () => {
      unsub();
      setPlants(MOCK_PLANTS);
      setActivePlantId(MOCK_PLANTS[0].id);
    };
  }, [isRealUser, user?.uid]);

  const activePlant = plants.find(p => p.id === activePlantId) ?? plants[0];

  // Calls the activateKit Cloud Function; the onSnapshot listener picks up the
  // new plant automatically. Throws on validation/network errors.
  const activatePlant = async (pin) => {
    if (!FIREBASE_ENABLED || !functions) throw new Error("demo_mode");
    const fn = httpsCallable(functions, "activateKit");
    const { data } = await fn({ pin: pin.toUpperCase().replace(/[^A-Z0-9]/g, "") });
    return data.plant;
  };

  return (
    <PlantContext.Provider value={{ plants, activePlant, setActivePlantId, activatePlant }}>
      {children}
    </PlantContext.Provider>
  );
}

export function usePlants() {
  const ctx = useContext(PlantContext);
  if (!ctx) throw new Error("usePlants must be used inside PlantProvider");
  return ctx;
}

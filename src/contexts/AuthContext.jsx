/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, FIREBASE_ENABLED } from "../lib/firebase";
import { MOCK_USER } from "../data/mockUser";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  // loading = true only while Firebase resolves its persisted auth state on first load
  const [loading, setLoading] = useState(FIREBASE_ENABLED);

  useEffect(() => {
    if (!FIREBASE_ENABLED) return;

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        if (snap.exists()) {
          setUser({ uid: fbUser.uid, email: fbUser.email, ...snap.data() });
        } else {
          // Profile missing — use sensible defaults
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName ?? "Gardener",
            avatar: "🌱",
            isVIP: false,
            treeName: "My Memory Tree",
            treeTheme: "default",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const login = async (email, password) => {
    if (!FIREBASE_ENABLED) {
      await new Promise(r => setTimeout(r, 1000));
      if (!password || password.length < 6) throw new Error("Invalid credentials");
      setUser({ ...MOCK_USER, email });
      return;
    }
    // onAuthStateChanged handles setUser after Firebase resolves
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name, email, password) => {
    if (!FIREBASE_ENABLED) {
      await new Promise(r => setTimeout(r, 1000));
      if (!password || password.length < 6) throw new Error("Invalid credentials");
      setUser({ ...MOCK_USER, name, email });
      return;
    }
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(fbUser, { displayName: name });

    const profile = {
      name,
      email,
      avatar: "🌱",
      isVIP: false,
      joinDate: serverTimestamp(),
      treeName: `${name}'s Memory Tree`,
      treeTheme: "default",
    };
    await setDoc(doc(db, "users", fbUser.uid), profile);
    // onAuthStateChanged fires and sets user via the profile we just wrote
  };

  const logout = async () => {
    if (!FIREBASE_ENABLED) { setUser(null); return; }
    await signOut(auth);
  };

  // Force-refresh the Firebase ID token (picks up new custom claims set by webhook)
  // then re-read the Firestore profile to sync isVIP into local user state.
  const refreshUser = async () => {
    if (!FIREBASE_ENABLED || !auth?.currentUser) return;
    await auth.currentUser.getIdToken(true);
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (snap.exists()) setUser(u => ({ ...u, ...snap.data() }));
  };

  // Bypasses Firebase — sets a local demo user without touching auth state
  const skipToDemo = () => setUser({ ...MOCK_USER, isMock: true });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-sky-50">
        <div className="text-center">
          <span className="text-6xl block mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🌱</span>
          <p className="text-green-600 font-bold text-lg font-sans">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, skipToDemo, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

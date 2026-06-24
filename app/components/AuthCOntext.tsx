"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, set, get, child, update } from "firebase/database";
import { auth, db } from "../lib/firebase";

export type Role = "student" | "tutor";

export interface UserProfile {
  uid: string;
  role: Role;
  fullName: string;
  email: string;
  studentId?: string;
  tutorId?: string;
  mobileNumber: string;
  institution: string;
  termsAccepted: boolean;
  createdAt: string;
}

interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  role: Role;
  fullName: string;
  studentId?: string;
  tutorId?: string;
  mobileNumber: string;
  institution: string;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const snapshot = await get(child(ref(db), `users/${user.uid}`));
        if (!cancelled && snapshot.exists()) {
          setProfile(snapshot.val() as UserProfile);
        }
      } catch {
        // profile fetch failed
      }
      if (!cancelled) setLoading(false);
    };
    fetchProfile();
    return () => { cancelled = true; };
  }, [user]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const register = async (data: RegisterData) => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const uid = cred.user.uid;

    const profileData: UserProfile = {
      uid,
      role: data.role,
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      institution: data.institution,
      termsAccepted: true,
      createdAt: new Date().toISOString(),
    };
    if (data.role === "student") profileData.studentId = data.studentId;
    if (data.role === "tutor") profileData.tutorId = data.tutorId;

    try {
      await set(ref(db, `users/${uid}`), profileData);
    } catch (err) {
      console.error("RTDB write failed:", err);
      await signOut(auth);
      throw err;
    }
    setProfile(profileData);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');
    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, data);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAuthenticated: !!user, login, logout, register, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

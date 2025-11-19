"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
};

type SessionContextValue = {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
  loading: boolean;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const STORAGE_KEY = "financas-user";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUserState(JSON.parse(raw));
      }
    } catch (e) {
      console.warn("Failed to load session", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const setUser = (next: SessionUser | null) => {
    setUserState(next);
    try {
      if (next) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Failed to persist session", e);
    }
  };

  const value = useMemo(
    () => ({ user, setUser, loading }),
    [user, loading],
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}

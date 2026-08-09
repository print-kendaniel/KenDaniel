"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface IntroReadyContextValue {
  ready: boolean;
  markReady: () => void;
}

const IntroReadyContext = createContext<IntroReadyContextValue | null>(null);

/** Tracks whether the intro loader has finished, so the hero's reveals can wait for it. */
export function IntroReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <IntroReadyContext.Provider value={{ ready, markReady: () => setReady(true) }}>
      {children}
    </IntroReadyContext.Provider>
  );
}

export function useIntroReady(): IntroReadyContextValue {
  const context = useContext(IntroReadyContext);
  if (!context) {
    throw new Error("useIntroReady must be used within an IntroReadyProvider");
  }
  return context;
}

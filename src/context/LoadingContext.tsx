"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  setProgress: (progress: number) => void;
  setLoaded: () => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const setLoaded = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        progress,
        setProgress,
        setLoaded,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

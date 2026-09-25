"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "jarvis" | "ember";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "jarvis",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("hz_theme") as Theme | null;
      if (stored === "jarvis" || stored === "ember") {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        document.documentElement.setAttribute("data-theme", defaultTheme);
      }
    } catch {
      // localStorage may be inaccessible
    }
  }, [defaultTheme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem("hz_theme", next);
    } catch {}
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new CustomEvent("hz_theme_changed", { detail: next }));
  };

  const toggleTheme = () => {
    setTheme(theme === "jarvis" ? "ember" : "jarvis");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "jarvis" as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}

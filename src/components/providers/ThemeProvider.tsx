"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/userStore";

/**
 * Applies the theme class (light / dark / sepia) to the document root element
 * based on the user's theme setting. Supports a "system" option that follows
 * the OS preference via matchMedia.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUserStore((s) => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "sepia");

    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(isDark ? "dark" : "light");

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
}

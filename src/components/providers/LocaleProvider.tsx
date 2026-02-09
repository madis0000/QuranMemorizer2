"use client";

import { useEffect } from "react";

import { getDirection, type Locale } from "@/lib/i18n";
import { useUserStore } from "@/stores/userStore";

/**
 * Applies dir and lang attributes to the HTML element based on the
 * user's language setting stored in Zustand.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const language = useUserStore((s) => s.settings.language);
  const locale = (language || "en") as Locale;
  const dir = getDirection(locale);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);

  return <>{children}</>;
}

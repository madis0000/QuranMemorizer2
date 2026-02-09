"use client";

import { useCallback } from "react";

import { getDirection, t, type Locale } from "@/lib/i18n";
import { useUserStore } from "@/stores/userStore";

/**
 * Hook for accessing i18n translations based on the user's language setting.
 * Reads the locale from userStore and provides a translate function.
 */
export function useTranslation() {
  const language = useUserStore((s) => s.settings.language);
  const locale = (language as Locale) || "en";

  const translate = useCallback((key: string) => t(key, locale), [locale]);
  const dir = getDirection(locale);

  return { t: translate, locale, dir };
}

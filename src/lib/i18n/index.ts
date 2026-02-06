/**
 * Lightweight i18n system for QuranMemorizer.
 * Supports English, Arabic, and Urdu UI translations.
 */

import ar from "./messages/ar";
import en from "./messages/en";
import ur from "./messages/ur";

export type Locale = "en" | "ar" | "ur";
export type MessageKey = keyof typeof en;

const messages: Record<Locale, Record<string, string>> = { en, ar, ur };

/**
 * Get a translated message by key.
 */
export function t(key: string, locale: Locale = "en"): string {
  return messages[locale]?.[key] ?? messages.en[key] ?? key;
}

/**
 * Get the text direction for a locale.
 */
export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "en" ? "ltr" : "rtl";
}

/**
 * Get all available locales.
 */
export function getLocales(): {
  code: Locale;
  name: string;
  nativeName: string;
}[] {
  return [
    { code: "en", name: "English", nativeName: "English" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "ur", name: "Urdu", nativeName: "اردو" },
  ];
}

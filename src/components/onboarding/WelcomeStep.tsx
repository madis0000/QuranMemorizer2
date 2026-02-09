"use client";

import { BookOpen, Globe } from "lucide-react";

import { getLocales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface WelcomeStepProps {
  selectedLanguage: string;
  onSelect: (language: Locale) => void;
  welcomeText: string;
  chooseLanguageText: string;
}

export function WelcomeStep({
  selectedLanguage,
  onSelect,
  welcomeText,
  chooseLanguageText,
}: WelcomeStepProps) {
  const locales = getLocales();

  return (
    <div className="text-center space-y-8">
      {/* Logo / Icon */}
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-primary-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{welcomeText}</h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <Globe className="h-4 w-4" />
          {chooseLanguageText}
        </p>
      </div>

      {/* Language cards */}
      <div className="grid gap-3">
        {locales.map((locale) => (
          <button
            key={locale.code}
            onClick={() => onSelect(locale.code)}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
              selectedLanguage === locale.code
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="text-start">
              <p className="font-medium">{locale.name}</p>
              <p className="text-sm text-muted-foreground">
                {locale.nativeName}
              </p>
            </div>
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 transition-colors",
                selectedLanguage === locale.code
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              )}
            >
              {selectedLanguage === locale.code && (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

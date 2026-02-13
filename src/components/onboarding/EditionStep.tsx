"use client";

import { BookOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MushafEdition } from "@/stores/quranStore";

interface EditionOption {
  id: MushafEdition;
  nameKey: string;
  description: string;
}

const editions: EditionOption[] = [
  {
    id: "madinah_1405",
    nameKey: "onboarding.edition_madinah_1405",
    description: "KFGQPC V1 - 604 pages, 15 lines",
  },
  {
    id: "madinah_1421",
    nameKey: "onboarding.edition_madinah_1421",
    description: "KFGQPC V2 - 604 pages, 15 lines",
  },
  {
    id: "indopak_15",
    nameKey: "onboarding.edition_indopak_15",
    description: "Qudratullah - 610 pages, 15 lines",
  },
  {
    id: "indopak_13",
    nameKey: "onboarding.edition_indopak_13",
    description: "Taj Company - 849 pages, 13 lines",
  },
];

interface EditionStepProps {
  selected: MushafEdition;
  onSelect: (edition: MushafEdition) => void;
  title: string;
  t: (key: string) => string;
}

export function EditionStep({
  selected,
  onSelect,
  title,
  t,
}: EditionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="grid gap-3">
        {editions.map((edition) => (
          <button
            key={edition.id}
            onClick={() => onSelect(edition.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-start",
              selected === edition.id
                ? "border-[#059669] bg-[#059669]/10 dark:border-[#00E5A0] dark:bg-[#00E5A0]/10 shadow-sm"
                : "border-[#D1E0D8] dark:border-[#00E5A0]/10 hover:border-[#059669]/50 dark:hover:border-[#00E5A0]/30"
            )}
          >
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{t(edition.nameKey)}</p>
              <p className="text-sm text-muted-foreground">
                {edition.description}
              </p>
            </div>
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 shrink-0 transition-colors",
                selected === edition.id
                  ? "border-[#059669] bg-[#059669] dark:border-[#00E5A0] dark:bg-[#00E5A0]"
                  : "border-[#9CA3AF] dark:border-[#6B7280]"
              )}
            >
              {selected === edition.id && (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white dark:bg-[#0F1A14]" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import type { Reciter } from "@/types/quran";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface ReciterCardProps {
  reciter: Reciter;
  isSelected: boolean;
  onSelect: (reciterId: string) => void;
}

/**
 * ReciterCard -- a reusable card that displays reciter information
 * (name, Arabic name, recitation style) with a selected indicator.
 * Can be used in the listen page, settings, or anywhere a reciter
 * picker is needed.
 */
export function ReciterCard({
  reciter,
  isSelected,
  onSelect,
}: ReciterCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(reciter.id)}
      className={cn(
        "flex items-center justify-between w-full p-4 rounded-lg border transition-colors text-left",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border hover:bg-accent"
      )}
    >
      <div className="min-w-0">
        <p className="font-medium truncate">{reciter.name}</p>
        <p className="text-sm text-muted-foreground truncate" dir="rtl">
          {reciter.arabicName}
        </p>
        {reciter.style && (
          <p className="text-xs text-muted-foreground mt-1">{reciter.style}</p>
        )}
      </div>
      {isSelected && (
        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 ml-3">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </button>
  );
}

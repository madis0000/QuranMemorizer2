"use client";

import { BookOpen, List } from "lucide-react";

import { cn } from "@/lib/utils";
import { useQuranStore } from "@/stores/quranStore";

/**
 * Segmented control for switching between Verse View and Mushaf View
 * in the memorization section.
 */
export function LayoutModeToggle({ className }: { className?: string }) {
  const mode = useQuranStore((s) => s.memorizeMode);
  const setMode = useQuranStore((s) => s.setMemorizeMode);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg bg-muted p-1 gap-1",
        className
      )}
    >
      <button
        onClick={() => setMode("ayah")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "ayah"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <List className="h-4 w-4" />
        Verse View
      </button>
      <button
        onClick={() => setMode("mushaf")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "mushaf"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <BookOpen className="h-4 w-4" />
        Mushaf View
      </button>
    </div>
  );
}

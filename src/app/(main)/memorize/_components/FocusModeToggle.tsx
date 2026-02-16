"use client";

import { Eye, EyeOff } from "lucide-react";

import { useSessionStore } from "@/stores/sessionStore";
import { Button } from "@/components/ui/button";

/**
 * Zen mode toggle — minimizes all UI chrome for distraction-free memorization.
 * When active: toolbar collapses, session map hides, sidebar hides,
 * only the verse and mic controls remain visible.
 */
export function FocusModeToggle() {
  const isFocusMode = useSessionStore((s) => s.isFocusMode);
  const setFocusMode = useSessionStore((s) => s.setFocusMode);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-7 gap-1 px-2 text-xs transition-colors ${
        isFocusMode
          ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
          : ""
      }`}
      onClick={() => setFocusMode(!isFocusMode)}
      title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
    >
      {isFocusMode ? (
        <EyeOff className="h-3.5 w-3.5" />
      ) : (
        <Eye className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">
        {isFocusMode ? "Exit Zen" : "Zen"}
      </span>
    </Button>
  );
}

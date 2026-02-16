"use client";

import { Flame, Zap } from "lucide-react";

interface ComboOverlayProps {
  combo: number;
  multiplier: number;
  milestone: string | null;
  sessionXP: number;
}

/**
 * Pure presentational overlay — all animations driven by CSS.
 * `milestone` is keyed so each new value re-mounts and replays the animation.
 * `combo` uses CSS transition on the badge itself.
 */
export function ComboOverlay({
  combo,
  multiplier,
  milestone,
  sessionXP,
}: ComboOverlayProps) {
  if (combo < 2 && !milestone) return null;

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-1.5">
      {/* Combo badge */}
      {combo >= 2 && (
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg animate-[combo-pop_0.3s_ease-out]">
          <Flame
            className={`h-4 w-4 ${combo >= 5 ? "animate-[combo-fire_0.6s_ease-in-out_infinite]" : ""}`}
          />
          <span className="text-sm font-bold tabular-nums">{combo}x</span>
          {multiplier > 1 && (
            <>
              <span className="text-xs opacity-80">·</span>
              <Zap className="h-3 w-3" />
              <span className="text-xs font-semibold">{multiplier}x XP</span>
            </>
          )}
        </div>
      )}

      {/* Session XP counter */}
      {sessionXP > 0 && (
        <div className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border">
          +{sessionXP} XP
        </div>
      )}

      {/* Milestone popup — key forces re-mount which replays animation */}
      {milestone && (
        <div
          key={milestone}
          className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-xl shadow-xl text-sm font-bold animate-[combo-milestone_2s_ease-out_forwards]"
        >
          {milestone}
        </div>
      )}
    </div>
  );
}

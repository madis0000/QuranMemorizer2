"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface XPProgressProps {
  totalXP?: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  className?: string;
}

export function XPProgress({
  level,
  currentLevelXP,
  nextLevelXP,
  className,
}: XPProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progressPercentage = Math.min(
    (currentLevelXP / nextLevelXP) * 100,
    100
  );

  useEffect(() => {
    // Animate progress bar on mount or when values change
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Level Badge */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#059669] to-[#047857] dark:from-[#00E5A0] dark:to-[#059669] flex items-center justify-center shadow-lg border-2 border-[#059669]/30 dark:border-[#00E5A0]/30">
          <div className="text-white dark:text-[#0F1A14] font-bold text-lg">
            {level}
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-[#059669] dark:bg-[#00E5A0] text-white dark:text-[#0F1A14] text-xs font-semibold px-1.5 py-0.5 rounded-full border border-white dark:border-[#0F1A14]">
          LVL
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#059669] dark:text-[#00E5A0] fill-[#059669] dark:fill-[#00E5A0]" />
            <span className="text-sm font-semibold">Level {level}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {currentLevelXP.toLocaleString()} / {nextLevelXP.toLocaleString()}{" "}
            XP
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-[#D1E0D8] dark:bg-[#00E5A0]/10 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#059669] via-[#047857] to-[#065f46] dark:from-[#00E5A0] dark:via-[#00E5A0]/80 dark:to-[#059669] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
          </div>
        </div>

        {/* Next level indicator */}
        <div className="mt-1 text-xs text-muted-foreground">
          {nextLevelXP - currentLevelXP > 0 ? (
            <span>
              {(nextLevelXP - currentLevelXP).toLocaleString()} XP to Level{" "}
              {level + 1}
            </span>
          ) : (
            <span className="text-[#059669] dark:text-[#00E5A0] font-semibold">
              Level {level} Complete!
            </span>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

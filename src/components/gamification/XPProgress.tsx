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
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center shadow-lg border-2 border-amber-300 dark:border-amber-600">
          <div className="text-white font-bold text-lg">{level}</div>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-amber-500 dark:bg-amber-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full border border-white dark:border-gray-900">
          LVL
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Level {level}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentLevelXP.toLocaleString()} / {nextLevelXP.toLocaleString()}{" "}
            XP
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 dark:from-amber-500 dark:via-amber-600 dark:to-amber-700 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
          </div>
        </div>

        {/* Next level indicator */}
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {nextLevelXP - currentLevelXP > 0 ? (
            <span>
              {(nextLevelXP - currentLevelXP).toLocaleString()} XP to Level{" "}
              {level + 1}
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
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

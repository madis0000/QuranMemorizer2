"use client";

import { useEffect, useState } from "react";
import { Star, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

interface XPAwardToastProps {
  amount: number;
  multiplier?: number;
  source: string;
  onComplete: () => void;
}

export function XPAwardToast({
  amount,
  multiplier = 1,
  source,
  onComplete,
}: XPAwardToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const totalXP = Math.round(amount * multiplier);

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Auto-dismiss after 2 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Call onComplete after fade-out animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="bg-gradient-to-r from-[#059669] to-[#047857] dark:from-[#00E5A0]/90 dark:to-[#059669]/90 text-white dark:text-[#0F1A14] rounded-lg shadow-2xl shadow-[#059669]/50 dark:shadow-[#00E5A0]/30 px-6 py-4 min-w-[280px]">
        {/* XP Amount */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-6 h-6 fill-white animate-bounce-slow" />
          <span className="text-3xl font-bold animate-scale-up">
            +{totalXP}
          </span>
          <span className="text-xl font-semibold">XP</span>
        </div>

        {/* Source */}
        <div className="text-center text-sm font-medium opacity-90">
          {source}
        </div>

        {/* Multiplier Badge */}
        {multiplier > 1 && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/20 rounded-full px-3 py-1 animate-pulse-scale">
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>x{multiplier} Streak Bonus!</span>
          </div>
        )}

        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes scale-up {
          0% {
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 1s ease-in-out infinite;
        }

        .animate-scale-up {
          animation: scale-up 0.5s ease-out;
        }

        .animate-pulse-scale {
          animation: pulse-scale 1s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

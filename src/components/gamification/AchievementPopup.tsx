"use client";

import { useEffect, useState } from "react";
import { Star, Trophy, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface AchievementPopupProps {
  achievement: {
    name: string;
    description: string;
    icon: string;
    rarity: "common" | "rare" | "epic" | "legendary";
    xpReward: number;
  } | null;
  onDismiss: () => void;
}

const RARITY_CONFIG = {
  common: {
    duration: 5000,
    className:
      "border-[#059669]/40 bg-[#059669]/5 dark:border-[#00E5A0]/30 dark:bg-[#00E5A0]/5",
    textColor: "text-[#059669] dark:text-[#00E5A0]",
    animation: "animate-slide-up",
    overlay: false,
  },
  rare: {
    duration: 8000,
    className:
      "border-[#0d9488]/50 bg-[#0d9488]/5 dark:border-[#2dd4bf]/40 dark:bg-[#2dd4bf]/10 shadow-lg shadow-[#0d9488]/20",
    textColor: "text-[#0d9488] dark:text-[#2dd4bf]",
    animation: "animate-slide-up-sparkle",
    overlay: false,
  },
  epic: {
    duration: 10000,
    className:
      "border-[#065f46]/50 bg-gradient-to-r from-[#065f46]/5 to-[#059669]/5 dark:from-[#34d399]/10 dark:to-[#00E5A0]/10 shadow-2xl shadow-[#065f46]/30 dark:border-[#34d399]/40",
    textColor: "text-[#065f46] dark:text-[#34d399]",
    animation: "animate-epic-entrance",
    overlay: false,
  },
  legendary: {
    duration: Infinity,
    className:
      "border-[#FFD700]/50 bg-gradient-to-r from-[#FFD700]/5 to-[#059669]/5 dark:from-[#FFD700]/10 dark:to-[#00E5A0]/10 shadow-2xl shadow-[#FFD700]/40 dark:border-[#FFD700]/40",
    textColor: "text-[#B8860B] dark:text-[#FFD700]",
    animation: "animate-legendary-entrance",
    overlay: true,
  },
};

export function AchievementPopup({
  achievement,
  onDismiss,
}: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(!!achievement);

  useEffect(() => {
    if (achievement) {
      const config = RARITY_CONFIG[achievement.rarity];

      if (config.duration !== Infinity) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onDismiss, 300); // Wait for fade-out animation
        }, config.duration);

        return () => clearTimeout(timer);
      }
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  const config = RARITY_CONFIG[achievement.rarity];

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <>
      {/* Overlay for legendary achievements */}
      {config.overlay && (
        <div
          className={cn(
            "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          onClick={handleDismiss}
        />
      )}

      {/* Achievement Popup */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300",
          isVisible ? "opacity-100" : "opacity-0",
          // Position based on rarity
          achievement.rarity === "legendary" &&
            "inset-0 flex items-center justify-center p-4",
          achievement.rarity === "epic" &&
            "left-1/2 top-20 -translate-x-1/2 w-full max-w-2xl px-4",
          (achievement.rarity === "rare" || achievement.rarity === "common") &&
            "bottom-20 right-4 w-96 max-w-[calc(100vw-2rem)]"
        )}
      >
        <div
          className={cn(
            "relative border-2 rounded-lg p-6 overflow-hidden",
            config.className,
            config.animation,
            isVisible && "animate-in",
            !isVisible && "animate-out"
          )}
        >
          {/* Decorative elements for epic/legendary */}
          {(achievement.rarity === "epic" ||
            achievement.rarity === "legendary") && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute w-2 h-2 rounded-full animate-float-particle",
                      achievement.rarity === "epic"
                        ? "bg-[#34d399]"
                        : "bg-[#FFD700]"
                    )}
                    style={{
                      left: `${(i * 37 + 13) % 100}%`,
                      animationDelay: `${((i * 7 + 3) % 20) / 10}s`,
                      animationDuration: `${3 + ((i * 11 + 5) % 20) / 10}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Close button for legendary */}
          {achievement.rarity === "legendary" && (
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            {/* Icon */}
            <div
              className={cn(
                "rounded-full p-6 flex items-center justify-center",
                achievement.rarity === "common" &&
                  "bg-[#059669]/15 dark:bg-[#00E5A0]/15",
                achievement.rarity === "rare" &&
                  "bg-[#0d9488]/15 dark:bg-[#2dd4bf]/15 animate-pulse-glow-forest",
                achievement.rarity === "epic" &&
                  "bg-[#065f46]/15 dark:bg-[#34d399]/15 animate-pulse-glow-forest",
                achievement.rarity === "legendary" &&
                  "bg-[#FFD700]/15 dark:bg-[#FFD700]/15 animate-pulse-glow-gold"
              )}
            >
              <Trophy
                className={cn(
                  achievement.rarity === "legendary" && "w-16 h-16",
                  achievement.rarity === "epic" && "w-12 h-12",
                  (achievement.rarity === "rare" ||
                    achievement.rarity === "common") &&
                    "w-10 h-10",
                  config.textColor
                )}
              />
            </div>

            {/* Rarity Badge */}
            <div
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                achievement.rarity === "common" &&
                  "bg-[#059669]/15 text-[#059669] dark:bg-[#00E5A0]/15 dark:text-[#00E5A0]",
                achievement.rarity === "rare" &&
                  "bg-[#0d9488]/15 text-[#0d9488] dark:bg-[#2dd4bf]/15 dark:text-[#2dd4bf]",
                achievement.rarity === "epic" &&
                  "bg-[#065f46]/15 text-[#065f46] dark:bg-[#34d399]/15 dark:text-[#34d399]",
                achievement.rarity === "legendary" &&
                  "bg-[#FFD700]/15 text-[#B8860B] dark:bg-[#FFD700]/15 dark:text-[#FFD700]"
              )}
            >
              {achievement.rarity}
            </div>

            {/* Title */}
            <h3
              className={cn(
                "font-bold",
                achievement.rarity === "legendary" && "text-3xl",
                achievement.rarity === "epic" && "text-2xl",
                (achievement.rarity === "rare" ||
                  achievement.rarity === "common") &&
                  "text-xl",
                config.textColor
              )}
            >
              {achievement.name}
            </h3>

            {/* Description */}
            <p
              className={cn(
                "text-sm",
                achievement.rarity === "legendary" && "text-base",
                config.textColor
              )}
            >
              {achievement.description}
            </p>

            {/* XP Reward */}
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-bold",
                achievement.rarity === "common" &&
                  "bg-[#059669]/15 dark:bg-[#00E5A0]/15",
                achievement.rarity === "rare" &&
                  "bg-[#0d9488]/15 dark:bg-[#2dd4bf]/15",
                achievement.rarity === "epic" &&
                  "bg-[#065f46]/15 dark:bg-[#34d399]/15",
                achievement.rarity === "legendary" &&
                  "bg-[#FFD700]/15 dark:bg-[#FFD700]/15 text-lg",
                config.textColor
              )}
            >
              <Star className="w-5 h-5 fill-current" />
              <span>+{achievement.xpReward} XP</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-up-sparkle {
          from {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes epic-entrance {
          from {
            transform: translateX(-50%) scale(0.8) translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes legendary-entrance {
          from {
            transform: scale(0.5) rotate(-5deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes pulse-glow-forest {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(5, 150, 105, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 229, 160, 0.6);
          }
        }

        @keyframes pulse-glow-gold {
          0%,
          100% {
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
          }
          50% {
            box-shadow: 0 0 60px rgba(255, 215, 0, 0.7);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-slide-up-sparkle {
          animation: slide-up-sparkle 0.4s ease-out;
        }

        .animate-epic-entrance {
          animation: epic-entrance 0.5s ease-out;
        }

        .animate-legendary-entrance {
          animation: legendary-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-float-particle {
          animation: float-particle linear infinite;
        }

        .animate-pulse-glow-forest {
          animation: pulse-glow-forest 2s ease-in-out infinite;
        }

        .animate-pulse-glow-gold {
          animation: pulse-glow-gold 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

"use client";

import { useState } from "react";
import { Calendar, Lock, Sparkles, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Achievement {
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
  earnedAt?: string;
  secret?: boolean;
}

interface AchievementGridProps {
  achievements: Achievement[];
  className?: string;
}

const CATEGORIES = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "recitation", label: "Recitation", icon: Trophy },
  { id: "memorization", label: "Memorization", icon: Trophy },
  { id: "streaks", label: "Streaks", icon: Calendar },
  { id: "special", label: "Special", icon: Sparkles },
];

const RARITY_COLORS = {
  common: {
    border: "border-zinc-300 dark:border-zinc-700",
    bg: "bg-zinc-50 dark:bg-zinc-900",
    glow: "shadow-zinc-500/10",
    text: "text-zinc-700 dark:text-zinc-300",
  },
  rare: {
    border: "border-blue-400 dark:border-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
    glow: "shadow-blue-500/20",
    text: "text-blue-700 dark:text-blue-300",
  },
  epic: {
    border: "border-purple-400 dark:border-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950",
    glow: "shadow-purple-500/30",
    text: "text-purple-700 dark:text-purple-300",
  },
  legendary: {
    border: "border-amber-400 dark:border-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950",
    glow: "shadow-amber-500/40",
    text: "text-amber-700 dark:text-amber-300",
  },
};

export function AchievementGrid({
  achievements,
  className,
}: AchievementGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const filteredAchievements = achievements.filter(
    (achievement) =>
      selectedCategory === "all" || achievement.category === selectedCategory
  );

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalCount = achievements.length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Achievements
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {earnedCount} / {totalCount} Unlocked
          </p>
        </div>

        {/* Progress Circle */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-200 dark:text-gray-800"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${(earnedCount / totalCount) * 213.628} 213.628`}
              className="text-amber-500 transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round((earnedCount / totalCount) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const categoryCount = achievements.filter(
              (a) => category.id === "all" || a.category === category.id
            ).length;
            const earnedInCategory = achievements.filter(
              (a) =>
                (category.id === "all" || a.category === category.id) &&
                a.earned
            ).length;

            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
                <span className="text-xs opacity-70">
                  ({earnedInCategory}/{categoryCount})
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {/* Achievement Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAchievements.map((achievement) => {
              const rarityStyle = RARITY_COLORS[achievement.rarity];
              const isLocked = !achievement.earned;
              const isSecret = achievement.secret && !achievement.earned;

              return (
                <Card
                  key={achievement.code}
                  className={cn(
                    "relative p-4 cursor-pointer transition-all hover:scale-105",
                    achievement.earned
                      ? cn(
                          "border-2",
                          rarityStyle.border,
                          rarityStyle.bg,
                          "shadow-lg",
                          rarityStyle.glow
                        )
                      : "border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-60 grayscale"
                  )}
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  {/* Rarity Badge */}
                  {achievement.earned && (
                    <div
                      className={cn(
                        "absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-semibold uppercase",
                        rarityStyle.bg,
                        rarityStyle.text,
                        "border",
                        rarityStyle.border
                      )}
                    >
                      {achievement.rarity}
                    </div>
                  )}

                  {/* Icon */}
                  <div className="flex justify-center mb-3">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center",
                        achievement.earned
                          ? cn(rarityStyle.bg, "ring-4", rarityStyle.border)
                          : "bg-gray-200 dark:bg-gray-800"
                      )}
                    >
                      {isLocked ? (
                        <Lock className="w-8 h-8 text-gray-400" />
                      ) : (
                        <Trophy
                          className={cn(
                            "w-8 h-8",
                            achievement.earned
                              ? rarityStyle.text
                              : "text-gray-400"
                          )}
                        />
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <h3
                    className={cn(
                      "text-center font-semibold mb-1",
                      achievement.earned
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {isSecret ? "???" : achievement.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      "text-xs text-center line-clamp-2",
                      achievement.earned
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {isSecret ? "Secret achievement" : achievement.description}
                  </p>

                  {/* Earned Date */}
                  {achievement.earned && achievement.earnedAt && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(achievement.earnedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Glow effect for earned achievements */}
                  {achievement.earned && (
                    <div
                      className={cn(
                        "absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity",
                        "bg-gradient-to-t from-transparent via-transparent",
                        achievement.rarity === "legendary" &&
                          "to-amber-500/10 animate-pulse",
                        achievement.rarity === "epic" &&
                          "to-purple-500/10 animate-pulse",
                        achievement.rarity === "rare" && "to-blue-500/10",
                        achievement.rarity === "common" && "to-zinc-500/10"
                      )}
                    />
                  )}
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No achievements in this category yet
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <Card
            className="max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center">
              <div
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center",
                  selectedAchievement.earned
                    ? cn(
                        RARITY_COLORS[selectedAchievement.rarity].bg,
                        "ring-4",
                        RARITY_COLORS[selectedAchievement.rarity].border
                      )
                    : "bg-gray-200 dark:bg-gray-800"
                )}
              >
                {selectedAchievement.earned ? (
                  <Trophy
                    className={cn(
                      "w-12 h-12",
                      RARITY_COLORS[selectedAchievement.rarity].text
                    )}
                  />
                ) : (
                  <Lock className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>

            {/* Rarity Badge */}
            <div className="flex justify-center">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold uppercase",
                  selectedAchievement.earned
                    ? cn(
                        RARITY_COLORS[selectedAchievement.rarity].bg,
                        RARITY_COLORS[selectedAchievement.rarity].text,
                        "border",
                        RARITY_COLORS[selectedAchievement.rarity].border
                      )
                    : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                )}
              >
                {selectedAchievement.rarity}
              </span>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              {selectedAchievement.secret && !selectedAchievement.earned
                ? "Secret Achievement"
                : selectedAchievement.name}
            </h2>

            {/* Description */}
            <p className="text-center text-gray-600 dark:text-gray-300">
              {selectedAchievement.secret && !selectedAchievement.earned
                ? "Complete the requirements to unlock this secret achievement."
                : selectedAchievement.description}
            </p>

            {/* Earned Date */}
            {selectedAchievement.earned && selectedAchievement.earnedAt && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Earned on{" "}
                    {new Date(selectedAchievement.earnedAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setSelectedAchievement(null)}
              className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}

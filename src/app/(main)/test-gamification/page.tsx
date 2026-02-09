"use client";

import { useState } from "react";

import { AchievementPopup } from "@/components/gamification/AchievementPopup";
import { LeagueStandings } from "@/components/gamification/LeagueStandings";
import { XPAwardToast } from "@/components/gamification/XPAwardToast";
import { XPProgress } from "@/components/gamification/XPProgress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TestGamificationPage() {
  const [showCommon, setShowCommon] = useState(false);
  const [showRare, setShowRare] = useState(false);
  const [showEpic, setShowEpic] = useState(false);
  const [showLegendary, setShowLegendary] = useState(false);
  const [showXPToast, setShowXPToast] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Gamification Components Test</h1>

      {/* XP Progress */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">XP Progress</h2>
        <XPProgress
          totalXP={3450}
          level={12}
          currentLevelXP={450}
          nextLevelXP={1000}
        />
      </Card>

      {/* League Standings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">League Standings</h2>
        <LeagueStandings currentLeague="hafiz" weeklyXP={5200} rank={8} />
      </Card>

      {/* Achievement Popups */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Achievement Popups</h2>
        <div className="flex gap-4 flex-wrap">
          <Button onClick={() => setShowCommon(true)}>
            Show Common Achievement
          </Button>
          <Button onClick={() => setShowRare(true)}>
            Show Rare Achievement
          </Button>
          <Button onClick={() => setShowEpic(true)}>
            Show Epic Achievement
          </Button>
          <Button onClick={() => setShowLegendary(true)}>
            Show Legendary Achievement
          </Button>
        </div>
      </Card>

      {/* XP Award Toast */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">XP Award Toast</h2>
        <Button onClick={() => setShowXPToast(true)}>Show XP Award</Button>
      </Card>

      {/* Popups */}
      <AchievementPopup
        achievement={
          showCommon
            ? {
                name: "First Steps",
                description: "Complete your first recitation session",
                icon: "mic",
                rarity: "common",
                xpReward: 25,
              }
            : null
        }
        onDismiss={() => setShowCommon(false)}
      />

      <AchievementPopup
        achievement={
          showRare
            ? {
                name: "Weekly Warrior",
                description: "Maintain a 7-day streak",
                icon: "flame",
                rarity: "rare",
                xpReward: 100,
              }
            : null
        }
        onDismiss={() => setShowRare(false)}
      />

      <AchievementPopup
        achievement={
          showEpic
            ? {
                name: "Surah Master",
                description: "Recite an entire surah without mistakes",
                icon: "award",
                rarity: "epic",
                xpReward: 500,
              }
            : null
        }
        onDismiss={() => setShowEpic(false)}
      />

      <AchievementPopup
        achievement={
          showLegendary
            ? {
                name: "Hafiz ul-Quran",
                description: "Memorize the entire Quran",
                icon: "crown",
                rarity: "legendary",
                xpReward: 10000,
              }
            : null
        }
        onDismiss={() => setShowLegendary(false)}
      />

      {showXPToast && (
        <XPAwardToast
          amount={50}
          multiplier={1.5}
          source="Session Complete"
          onComplete={() => setShowXPToast(false)}
        />
      )}
    </div>
  );
}

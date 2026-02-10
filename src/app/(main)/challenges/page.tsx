"use client";

import { useState } from "react";
import { History, Loader2, Swords } from "lucide-react";

import { cn } from "@/lib/utils";
import { useChallengeHistory, useChallenges } from "@/hooks/use-challenges";
import { useTranslation } from "@/hooks/use-translation";
import { ChallengeCard } from "@/components/gamification/ChallengeCard";
import { DailyChallenge } from "@/components/gamification/DailyChallenge";

type Tab = "challenges" | "history";

export default function ChallengesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("challenges");
  const { data: challengesData, isLoading: loadingChallenges } =
    useChallenges();
  const { data: historyData, isLoading: loadingHistory } =
    useChallengeHistory();

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
          <Swords className="w-5 h-5 text-[#059669] dark:text-[#00E5A0]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("challenges.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("challenges.subtitle")}
          </p>
        </div>
      </div>

      {/* Daily Challenge (always visible) */}
      <DailyChallenge />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#D1E0D8] dark:border-[#00E5A0]/10 pb-2">
        <button
          onClick={() => setActiveTab("challenges")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
            activeTab === "challenges"
              ? "bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0]"
              : "text-muted-foreground hover:bg-[#059669]/5 dark:hover:bg-[#00E5A0]/5"
          )}
        >
          <Swords className="w-4 h-4" />
          {t("challenges.title")}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
            activeTab === "history"
              ? "bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0]"
              : "text-muted-foreground hover:bg-[#059669]/5 dark:hover:bg-[#00E5A0]/5"
          )}
        >
          <History className="w-4 h-4" />
          {t("challenges.history")}
        </button>
      </div>

      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <div className="space-y-4">
          {loadingChallenges ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#059669] dark:text-[#00E5A0]" />
            </div>
          ) : challengesData?.challenges?.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {t("challenges.no_challenges")}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {challengesData?.challenges?.map(
                (challenge: {
                  id: string;
                  type: string;
                  title: string;
                  description?: string | null;
                  config: Record<string, number | undefined>;
                  xpReward: number;
                  attempts?: Array<{
                    score: number;
                    stars: number;
                    completed: boolean;
                  }>;
                }) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {loadingHistory ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#059669] dark:text-[#00E5A0]" />
            </div>
          ) : historyData?.attempts?.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No challenge attempts yet</p>
            </div>
          ) : (
            historyData?.attempts?.map(
              (attempt: {
                id: string;
                score: number;
                accuracy: number | null;
                duration: number;
                completed: boolean;
                stars: number;
                createdAt: string;
                challenge: { title: string; type: string };
              }) => (
                <div
                  key={attempt.id}
                  className="rounded-lg border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-medium">
                      {attempt.challenge.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(attempt.createdAt).toLocaleDateString()}{" "}
                      &middot; {Math.floor(attempt.duration / 60)}m{" "}
                      {attempt.duration % 60}s
                    </p>
                  </div>
                  <div className="text-end">
                    <div className="text-sm font-semibold">
                      {attempt.score} pts
                    </div>
                    {attempt.accuracy !== null && (
                      <div className="text-xs text-muted-foreground">
                        {attempt.accuracy}% accuracy
                      </div>
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
}

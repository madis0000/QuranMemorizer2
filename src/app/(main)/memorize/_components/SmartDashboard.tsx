"use client";

import { SURAH_NAMES } from "@/data/hizb-data";
import {
  BookOpen,
  Brain,
  Clock,
  Flame,
  Play,
  RefreshCw,
  Shuffle,
  Target,
  TrendingUp,
} from "lucide-react";

import { getAyahCount } from "@/lib/gamification/surah-trees";
import { useActiveSessions, useSessions } from "@/hooks/use-progress";
import { useDueCards, useSRSStats } from "@/hooks/use-srs";
import type { MemorizeMode } from "@/stores/quranStore";
import type { StartSessionConfig } from "@/stores/sessionStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SmartDashboardProps {
  mode: string;
  onStartSession?: (config: StartSessionConfig) => void;
}

export function SmartDashboard({ mode, onStartSession }: SmartDashboardProps) {
  const { data: dueData } = useDueCards();
  const { data: srsStats } = useSRSStats();
  const { data: activeSessionsData } = useActiveSessions();
  const { data: lastSessionData } = useSessions({
    limit: 1,
    status: "COMPLETED",
  });
  const streak = useUserStore((s) => s.streak.currentStreak);

  const dueCount = dueData?.cards?.length ?? 0;
  const activeSessions = activeSessionsData?.sessions ?? [];
  const resumableSession = activeSessions.find(
    (s) => s.status === "PAUSED" || s.status === "ACTIVE"
  );

  const stats = srsStats as
    | { newCount?: number; learningCount?: number; reviewCount?: number }
    | undefined;

  // Compute streak-aware suggestion from last completed session
  const lastSession = (
    lastSessionData as {
      sessions?: Array<{ surahNumber: number; endAyah: number }>;
    }
  )?.sessions?.[0];
  let suggestedSurah: number | null = null;
  let suggestedStartAyah: number | null = null;
  let suggestedDesc = "";

  if (lastSession) {
    const totalAyahs = getAyahCount(lastSession.surahNumber) || 0;
    if (lastSession.endAyah < totalAyahs) {
      // Continue same surah from where they left off
      suggestedSurah = lastSession.surahNumber;
      suggestedStartAyah = lastSession.endAyah + 1;
      suggestedDesc = `${SURAH_NAMES[suggestedSurah] ?? `Surah ${suggestedSurah}`} from ayah ${suggestedStartAyah}`;
    } else if (lastSession.surahNumber < 114) {
      // Move to next surah
      suggestedSurah = lastSession.surahNumber + 1;
      suggestedStartAyah = 1;
      suggestedDesc = `${SURAH_NAMES[suggestedSurah] ?? `Surah ${suggestedSurah}`} from the beginning`;
    }
  }

  const handleContinueSurah = () => {
    if (!onStartSession || !suggestedSurah || !suggestedStartAyah) return;
    const totalAyahs = getAyahCount(suggestedSurah) || 7;
    onStartSession({
      mode: "memorize",
      surahNumber: suggestedSurah,
      startAyah: suggestedStartAyah,
      endAyah: totalAyahs,
      targetType: (mode || "ayah") as MemorizeMode,
    });
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Header with streak */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Ready to memorize?
            </h2>
            <p className="text-xs text-muted-foreground">
              Choose how to start your session
            </p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                {streak}
              </span>
              <span className="text-[10px] text-muted-foreground">
                day streak
              </span>
            </div>
          )}
        </div>

        {/* FSRS Review Queue */}
        {dueCount > 0 && (
          <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                    <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {dueCount} ayah{dueCount !== 1 ? "s" : ""} due for review
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {stats?.newCount ? `${stats.newCount} new · ` : ""}
                      {stats?.learningCount
                        ? `${stats.learningCount} learning · `
                        : ""}
                      {stats?.reviewCount ? `${stats.reviewCount} review` : ""}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Play className="h-3 w-3" />
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue Session */}
        {resumableSession && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      Continue where you left off
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {SURAH_NAMES[resumableSession.surahNumber] ??
                        `Surah ${resumableSession.surahNumber}`}{" "}
                      · {resumableSession.startAyah}-{resumableSession.endAyah}
                      {resumableSession.accuracy != null &&
                        ` · ${Math.round(resumableSession.accuracy)}%`}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 border-blue-300 dark:border-blue-700"
                >
                  <Play className="h-3 w-3" />
                  Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Start Grid */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Start
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickStartCard
              icon={<RefreshCw className="h-4 w-4" />}
              title="Review Weak Ayahs"
              desc="Practice verses you struggled with"
              color="from-red-500/10 to-orange-500/10 dark:from-red-900/20 dark:to-orange-900/20"
              iconColor="text-red-500"
            />
            <QuickStartCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Continue Surah"
              desc={suggestedDesc || "Pick up from your last position"}
              color="from-blue-500/10 to-cyan-500/10 dark:from-blue-900/20 dark:to-cyan-900/20"
              iconColor="text-blue-500"
              onClick={suggestedSurah ? handleContinueSurah : undefined}
            />
            <QuickStartCard
              icon={<Shuffle className="h-4 w-4" />}
              title="Random Challenge"
              desc="10 random memorized ayahs"
              color="from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/20"
              iconColor="text-purple-500"
            />
            <QuickStartCard
              icon={<Target className="h-4 w-4" />}
              title="Similar Verse Drill"
              desc="Master confusing verse pairs"
              color="from-amber-500/10 to-yellow-500/10 dark:from-amber-900/20 dark:to-yellow-900/20"
              iconColor="text-amber-500"
            />
          </div>
        </div>

        {/* Mode Instructions */}
        <ModeInstructions mode={mode} />
      </div>
    </div>
  );
}

function QuickStartCard({
  icon,
  title,
  desc,
  color,
  iconColor,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  iconColor: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={`text-left rounded-xl border p-3.5 bg-gradient-to-br ${color} hover:shadow-md transition-all group`}
      onClick={onClick}
    >
      <div
        className={`${iconColor} mb-2 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{desc}</div>
    </button>
  );
}

function ModeInstructions({ mode }: { mode: string }) {
  const descriptions: Record<
    string,
    { title: string; icon: React.ReactNode; steps: string[] }
  > = {
    mushaf: {
      title: "Mushaf Mode",
      icon: <BookOpen className="h-4 w-4" />,
      steps: [
        "Select a page in the toolbar, then press Start",
        "Words are hidden — recall them or use voice to recite",
        "Tap hidden words to peek",
      ],
    },
    ayah: {
      title: "Ayah Mode",
      icon: <BookOpen className="h-4 w-4" />,
      steps: [
        "Choose surah + ayah range in toolbar, press Start",
        "Each verse appears individually — recite from memory",
        "Navigate between ayahs with arrows",
      ],
    },
    surah: {
      title: "Surah Mode",
      icon: <BookOpen className="h-4 w-4" />,
      steps: [
        "Select a surah, press Start",
        "All verses load — work through them one by one",
      ],
    },
    juz: {
      title: "Juz Mode",
      icon: <BookOpen className="h-4 w-4" />,
      steps: [
        "Select juz (1-30), press Start",
        "Navigate across surah boundaries seamlessly",
      ],
    },
    hizb: {
      title: "Hizb Mode",
      icon: <BookOpen className="h-4 w-4" />,
      steps: [
        "Select hizb (1-60), press Start",
        "Shorter than juz — great for daily revision",
      ],
    },
    subject: {
      title: "Subject Mode",
      icon: <BookOpen className="h-4 w-4" />,
      steps: [
        "Choose a theme (Du'a, Stories, etc.), press Start",
        "Verses from across the Quran, connected by meaning",
      ],
    },
  };

  const info = descriptions[mode] ?? descriptions.ayah;

  return (
    <div className="rounded-xl bg-white/60 dark:bg-white/5 border p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-foreground">{info.icon}</span>
        <h3 className="text-sm font-semibold">{info.title}</h3>
      </div>
      <div className="space-y-1.5">
        {info.steps.map((step, i) => (
          <p
            key={i}
            className="text-[11px] text-muted-foreground flex items-start gap-2"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#059669]/10 dark:bg-[#00E5A0]/10 text-[9px] font-medium text-[#059669] dark:text-[#00E5A0] shrink-0 mt-0.5">
              {i + 1}
            </span>
            {step}
          </p>
        ))}
      </div>
    </div>
  );
}

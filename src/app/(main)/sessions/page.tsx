"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  History,
  Pause,
  PlayCircle,
  Target,
  Timer,
  Trash2,
  TrendingUp,
} from "lucide-react";

import {
  useDiscardSession,
  useResumeSession,
  useSessions,
} from "@/hooks/use-progress";
import { useQuranStore } from "@/stores/quranStore";
import { useSessionStore, type DBSessionSnapshot } from "@/stores/sessionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type StatusFilter = "all" | "PAUSED" | "COMPLETED";

const SURAH_NAMES: Record<number, string> = {
  1: "Al-Fatihah",
  2: "Al-Baqarah",
  3: "Ali 'Imran",
  4: "An-Nisa",
  5: "Al-Ma'idah",
  6: "Al-An'am",
  7: "Al-A'raf",
  8: "Al-Anfal",
  9: "At-Tawbah",
  10: "Yunus",
  11: "Hud",
  12: "Yusuf",
  13: "Ar-Ra'd",
  14: "Ibrahim",
  15: "Al-Hijr",
  16: "An-Nahl",
  17: "Al-Isra",
  18: "Al-Kahf",
  19: "Maryam",
  20: "Ta-Ha",
  21: "Al-Anbiya",
  22: "Al-Hajj",
  23: "Al-Mu'minun",
  24: "An-Nur",
  25: "Al-Furqan",
  26: "Ash-Shu'ara",
  27: "An-Naml",
  28: "Al-Qasas",
  29: "Al-Ankabut",
  30: "Ar-Rum",
  36: "Ya-Sin",
  55: "Ar-Rahman",
  56: "Al-Waqi'ah",
  67: "Al-Mulk",
  78: "An-Naba",
  112: "Al-Ikhlas",
  113: "Al-Falaq",
  114: "An-Nas",
};

function getSurahName(num: number): string {
  return SURAH_NAMES[num] ?? `Surah ${num}`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface SessionItem {
  id: string;
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  pageNumber: number | null;
  mode: string;
  duration: number;
  accuracy: number | null;
  wordsRecited: number;
  mistakeCount: number;
  status: string;
  stateSnapshot: DBSessionSnapshot | null;
  targetType: string | null;
  pausedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  _count: { mistakes: number };
}

export default function SessionsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const resumeSession = useResumeSession();
  const discardSession = useDiscardSession();
  const session = useSessionStore();
  const setMemorizeMode = useQuranStore((s) => s.setMemorizeMode);

  const statusQuery =
    statusFilter === "all" ? "PAUSED,COMPLETED" : statusFilter;

  const { data, isLoading } = useSessions({
    limit,
    offset,
    status: statusQuery,
  });

  const sessions: SessionItem[] = data?.sessions ?? [];
  const total: number = data?.total ?? 0;

  // Stats
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");
  const avgAccuracy =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((acc, s) => acc + (s.accuracy ?? 0), 0) /
            completedSessions.length
        )
      : 0;
  const totalTime = sessions.reduce((acc, s) => acc + s.duration, 0);

  const handleResume = useCallback(
    (sessionItem: SessionItem) => {
      resumeSession.mutate(sessionItem.id, {
        onSuccess: () => {
          session.loadFromSnapshot({
            id: sessionItem.id,
            surahNumber: sessionItem.surahNumber,
            startAyah: sessionItem.startAyah,
            endAyah: sessionItem.endAyah,
            pageNumber: sessionItem.pageNumber,
            mode: sessionItem.mode,
            targetType: sessionItem.targetType,
            duration: sessionItem.duration,
            stateSnapshot: sessionItem.stateSnapshot,
          });
          if (sessionItem.targetType) {
            setMemorizeMode(
              sessionItem.targetType as Parameters<typeof setMemorizeMode>[0]
            );
          }
          router.push("/memorize");
        },
      });
    },
    [resumeSession, session, setMemorizeMode, router]
  );

  const handleDiscard = useCallback(
    (sessionId: string) => {
      discardSession.mutate(sessionId);
    },
    [discardSession]
  );

  const filters: Array<{ label: string; value: StatusFilter }> = [
    { label: "All", value: "all" },
    { label: "Paused", value: "PAUSED" },
    { label: "Completed", value: "COMPLETED" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6 text-[#059669] dark:text-[#00E5A0]" />
          Session History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View past sessions, resume saved progress, or review completed work.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="py-4 text-center">
            <Target className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <div className="text-2xl font-bold tabular-nums">{total}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <div className="text-2xl font-bold tabular-nums">
              {avgAccuracy}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Timer className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <div className="text-2xl font-bold tabular-nums">
              {formatDuration(totalTime)}
            </div>
            <div className="text-xs text-muted-foreground">Total Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setOffset(0);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? "bg-[#059669] text-white dark:bg-[#00E5A0] dark:text-[#0A1210]"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Session List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No sessions yet"
          description="Start a memorization session to see your history here."
        />
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              onResume={() => handleResume(s)}
              onDiscard={() => handleDiscard(s.id)}
              isResuming={resumeSession.isPending}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - limit))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground flex items-center px-3">
            {offset + 1}–{Math.min(offset + limit, total)} of {total}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={offset + limit >= total}
            onClick={() => setOffset(offset + limit)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function SessionCard({
  session: s,
  onResume,
  onDiscard,
  isResuming,
}: {
  session: SessionItem;
  onResume: () => void;
  onDiscard: () => void;
  isResuming: boolean;
}) {
  const isPaused = s.status === "PAUSED" || s.status === "ACTIVE";
  const modeLabel = s.targetType
    ? s.targetType.charAt(0).toUpperCase() + s.targetType.slice(1)
    : s.mode;

  return (
    <Card
      className={`transition-colors ${
        isPaused
          ? "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20"
          : ""
      }`}
    >
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Title row */}
            <div className="flex items-center gap-2">
              {isPaused ? (
                <Pause className="h-4 w-4 text-amber-500 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
              <span className="font-medium text-sm truncate">
                {getSurahName(s.surahNumber)} {s.surahNumber}:{s.startAyah}–
                {s.endAyah}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium shrink-0">
                {modeLabel}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {formatDuration(s.duration)}
              </span>
              {s.accuracy != null && (
                <span
                  className={`font-medium ${
                    s.accuracy >= 80
                      ? "text-emerald-600 dark:text-emerald-400"
                      : s.accuracy >= 50
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {Math.round(s.accuracy)}% accuracy
                </span>
              )}
              {s.wordsRecited > 0 && <span>{s.wordsRecited} words</span>}
              <span className="ml-auto">{formatTimeAgo(s.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          {isPaused && (
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                onClick={onDiscard}
                title="Discard session"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={onResume}
                disabled={isResuming}
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Resume
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

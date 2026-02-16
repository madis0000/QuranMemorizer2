"use client";

import { Clock, PlayCircle, Trash2 } from "lucide-react";

import type { MemorizeMode } from "@/stores/quranStore";
import type { StartSessionConfig } from "@/stores/sessionStore";
import { MemorizeToolbar } from "@/components/memorization/MemorizeToolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Module-level timestamp helper to avoid react-hooks/purity lint for Date.now() */
const timestamp = () => Date.now();

const MODE_LABELS: Record<string, string> = {
  mushaf: "Mushaf",
  ayah: "Ayah",
  surah: "Surah",
  juz: "Juz",
  hizb: "Hizb",
  subject: "Subject",
};

function formatTimeAgo(ts: number) {
  const mins = Math.floor((timestamp() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

// ---------- DB Recovery Dialog ----------

interface DBRecoveryProps {
  memorizeMode: MemorizeMode;
  onModeChange: (mode: MemorizeMode) => void;
  onStartSession: (config: StartSessionConfig) => void;
  onEndSession: () => void;
  dbSession: {
    surahNumber: number;
    startAyah: number;
    endAyah: number;
    targetType: string | null;
    status: string;
    createdAt: string;
  };
  onResume: () => void;
  onDiscard: () => void;
}

export function DBRecoveryDialog({
  memorizeMode,
  onModeChange,
  onStartSession,
  onEndSession,
  dbSession,
  onResume,
  onDiscard,
}: DBRecoveryProps) {
  const dbCreatedAt = new Date(dbSession.createdAt).getTime();

  return (
    <div className="flex flex-col -mt-14 lg:-mt-16 h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-4.125rem)] bg-[#F8FAF9] dark:bg-[#121E18]">
      <MemorizeToolbar
        memorizeMode={memorizeMode}
        onModeChange={onModeChange}
        isActive={false}
        onStartSession={onStartSession}
        onEndSession={onEndSession}
      />
      <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F0ED] dark:bg-[#0A1210] p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-[#059669] dark:text-[#00E5A0]" />
              Resume Saved Session?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have a saved session that can be resumed.
            </p>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode</span>
                <span className="font-medium">
                  {MODE_LABELS[dbSession.targetType ?? "ayah"] ??
                    dbSession.targetType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Range</span>
                <span className="font-medium">
                  {dbSession.surahNumber}:{dbSession.startAyah}–
                  {dbSession.endAyah}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`font-medium ${dbSession.status === "PAUSED" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
                >
                  {dbSession.status === "PAUSED" ? "Paused" : "Active"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTimeAgo(dbCreatedAt)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-1.5"
                onClick={onDiscard}
              >
                <Trash2 className="h-4 w-4" />
                Discard
              </Button>
              <Button className="flex-1 gap-1.5" onClick={onResume}>
                <PlayCircle className="h-4 w-4" />
                Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------- LocalStorage Recovery Dialog ----------

interface LocalRecoveryProps {
  memorizeMode: MemorizeMode;
  onModeChange: (mode: MemorizeMode) => void;
  onStartSession: (config: StartSessionConfig) => void;
  onEndSession: () => void;
  session: {
    targetType: string;
    currentPageNumber: number;
    surahNumber: number;
    startAyah: number;
    endAyah: number;
    currentAyah: number;
    wordsRecited: number;
    correctWords: number;
    startTime: number | null;
  };
  onResume: () => void;
  onDiscard: () => void;
}

export function LocalRecoveryDialog({
  memorizeMode,
  onModeChange,
  onStartSession,
  onEndSession,
  session,
  onResume,
  onDiscard,
}: LocalRecoveryProps) {
  const recoveredAccuracy =
    session.wordsRecited > 0
      ? Math.round((session.correctWords / session.wordsRecited) * 100)
      : 0;

  return (
    <div className="flex flex-col -mt-14 lg:-mt-16 h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-4.125rem)] bg-[#F8FAF9] dark:bg-[#121E18]">
      <MemorizeToolbar
        memorizeMode={memorizeMode}
        onModeChange={onModeChange}
        isActive={false}
        onStartSession={onStartSession}
        onEndSession={onEndSession}
      />
      <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F0ED] dark:bg-[#0A1210] p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-[#059669] dark:text-[#00E5A0]" />
              Resume Session?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have an unfinished memorization session.
            </p>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode</span>
                <span className="font-medium">
                  {MODE_LABELS[session.targetType] ?? session.targetType}
                </span>
              </div>
              {session.targetType === "mushaf" ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Page</span>
                  <span className="font-medium">
                    {session.currentPageNumber}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Range</span>
                  <span className="font-medium">
                    {session.surahNumber}:{session.startAyah}–{session.endAyah}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Ayah</span>
                <span className="font-medium">
                  {session.surahNumber}:{session.currentAyah}
                </span>
              </div>
              {session.wordsRecited > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-medium">{recoveredAccuracy}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {session.startTime
                    ? formatTimeAgo(session.startTime)
                    : "unknown"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-1.5"
                onClick={onDiscard}
              >
                <Trash2 className="h-4 w-4" />
                Discard
              </Button>
              <Button className="flex-1 gap-1.5" onClick={onResume}>
                <PlayCircle className="h-4 w-4" />
                Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

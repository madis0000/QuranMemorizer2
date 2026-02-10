"use client";

import { useEffect, useState } from "react";
import { History, Loader2, Trophy } from "lucide-react";

import {
  getRecordingsForVerse,
  type RecordingMetadata,
} from "@/lib/audio/recording-store";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

import { RecitationReplay } from "./RecitationReplay";

interface RecordingHistoryProps {
  verseKey: string;
}

export function RecordingHistory({ verseKey }: RecordingHistoryProps) {
  const { t } = useTranslation();
  const [recordings, setRecordings] = useState<RecordingMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    getRecordingsForVerse(verseKey)
      .then(setRecordings)
      .finally(() => setLoading(false));
  }, [verseKey]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#059669] dark:text-[#00E5A0]" />
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No recordings yet for this verse
      </div>
    );
  }

  // Find best recording
  const bestId = recordings.reduce(
    (best, rec) => ((rec.accuracy ?? 0) > (best.accuracy ?? 0) ? rec : best),
    recordings[0]
  ).id;

  const selected = recordings.find((r) => r.id === selectedId);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-[#059669] dark:text-[#00E5A0]" />
        <h4 className="text-sm font-semibold">
          Recording History ({recordings.length})
        </h4>
      </div>

      {/* Recording list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {recordings.map((rec) => (
          <button
            key={rec.id}
            onClick={() => setSelectedId(rec.id)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg border transition-all text-start",
              selectedId === rec.id
                ? "border-[#059669] bg-[#059669]/5 dark:border-[#00E5A0] dark:bg-[#00E5A0]/5"
                : "border-[#D1E0D8] dark:border-[#00E5A0]/10 hover:border-[#059669]/30"
            )}
          >
            <div>
              <div className="text-xs text-muted-foreground">
                {new Date(rec.createdAt).toLocaleDateString()}{" "}
                {new Date(rec.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-xs">
                {Math.floor(rec.duration / 60)}:
                {String(rec.duration % 60).padStart(2, "0")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {rec.id === bestId && (
                <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
              )}
              {rec.accuracy !== undefined && (
                <span className="text-sm font-medium">{rec.accuracy}%</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Selected replay */}
      {selected && <RecitationReplay recording={selected} />}
    </div>
  );
}

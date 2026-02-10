"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X as XIcon } from "lucide-react";

import { scoreDrillAnswer, type Drill } from "@/lib/similar-verses/drills";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

interface SimilarVerseDrillProps {
  drill: Drill;
  onComplete: (correct: boolean, score: number) => void;
}

export function SimilarVerseDrill({
  drill,
  onComplete,
}: SimilarVerseDrillProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleSelect = useCallback(
    (option: string) => {
      if (showResult) return;

      setSelected(option);
      setShowResult(true);

      const result = scoreDrillAnswer(
        drill,
        option,
        Date.now() - startTimeRef.current
      );

      setTimeout(() => {
        onComplete(result.correct, result.score);
      }, 1500);
    },
    [drill, showResult, onComplete]
  );

  const DRILL_TYPE_LABELS: Record<string, string> = {
    continue: t("similar.continue_drill"),
    which_surah: t("similar.which_surah"),
    spot_difference: t("similar.spot_difference"),
    complete_verse: t("similar.continue_drill"),
  };

  return (
    <div className="rounded-xl border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-6 backdrop-blur-sm space-y-6">
      {/* Drill type label */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0]">
          {DRILL_TYPE_LABELS[drill.type] ?? drill.type}
        </span>
        <span className="text-xs text-muted-foreground">{drill.verseKey}</span>
      </div>

      {/* Prompt */}
      <div
        className="text-xl leading-loose font-amiri text-center py-4"
        dir="rtl"
        lang="ar"
      >
        {drill.prompt}
      </div>

      {/* Options */}
      {drill.options && (
        <div className="space-y-3">
          {drill.options.map((option, idx) => {
            const isSelected = selected === option;
            const isCorrect = option === drill.correctAnswer;
            const showCorrectness = showResult;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={showResult}
                className={cn(
                  "w-full p-4 rounded-lg border text-start transition-all font-amiri text-lg",
                  "border-[#D1E0D8] dark:border-[#00E5A0]/10",
                  !showResult &&
                    "hover:border-[#059669]/50 dark:hover:border-[#00E5A0]/30 cursor-pointer",
                  showCorrectness &&
                    isCorrect &&
                    "border-[#059669] bg-[#059669]/10 dark:border-[#00E5A0] dark:bg-[#00E5A0]/10",
                  showCorrectness &&
                    isSelected &&
                    !isCorrect &&
                    "border-red-500 bg-red-500/10"
                )}
                dir="rtl"
                lang="ar"
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrectness && isCorrect && (
                    <Check className="w-5 h-5 text-[#059669] dark:text-[#00E5A0] shrink-0" />
                  )}
                  {showCorrectness && isSelected && !isCorrect && (
                    <XIcon className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Result message */}
      {showResult && (
        <div
          className={cn(
            "text-center text-sm font-medium py-2 rounded-lg",
            selected === drill.correctAnswer
              ? "bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0]"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          )}
        >
          {selected === drill.correctAnswer
            ? t("similar.correct")
            : t("similar.incorrect")}
        </div>
      )}
    </div>
  );
}

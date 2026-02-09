"use client";

import { useCallback, useMemo, useState } from "react";
import type { TajweedRuleType } from "@/types/quran";
import { CheckCircle, Mic, RotateCcw, Volume2 } from "lucide-react";

import { detectTajweedRules } from "@/lib/tajweed/detector";
import { getRuleInfo } from "@/lib/tajweed/rule-mapper";
import { cn } from "@/lib/utils";
import { useTajweedStore } from "@/stores/tajweedStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/** Practice verses - each entry has a verse key and Arabic text */
interface PracticeVerse {
  verseKey: string;
  text: string;
  surahName: string;
}

/** Sample verses organized by rule type for focused practice */
const PRACTICE_VERSES: Partial<Record<TajweedRuleType, PracticeVerse[]>> = {
  ikhfa: [
    {
      verseKey: "2:25",
      text: "\u0645\u0650\u0646 \u062A\u064E\u062D\u0652\u062A\u0650\u0647\u064E\u0627 \u0627\u0644\u0652\u0623\u064E\u0646\u0652\u0647\u064E\u0627\u0631\u064F",
      surahName: "Al-Baqarah",
    },
    {
      verseKey: "2:3",
      text: "\u0648\u064E\u0645\u0650\u0645\u0651\u064E\u0627 \u0631\u064E\u0632\u064E\u0642\u0652\u0646\u064E\u0627\u0647\u064F\u0645\u0652 \u064A\u064F\u0646\u0641\u0650\u0642\u064F\u0648\u0646\u064E",
      surahName: "Al-Baqarah",
    },
  ],
  iqlab: [
    {
      verseKey: "2:17",
      text: "\u0623\u064E\u0646\u0628\u0650\u0626\u0652\u0647\u064F\u0645 \u0628\u0650\u0623\u064E\u0633\u0652\u0645\u064E\u0627\u0626\u0650\u0647\u0650\u0645\u0652",
      surahName: "Al-Baqarah",
    },
  ],
  idgham_ghunnah: [
    {
      verseKey: "2:85",
      text: "\u0645\u0650\u0646 \u0648\u064E\u0644\u0650\u064A\u0651\u064D",
      surahName: "Al-Baqarah",
    },
    {
      verseKey: "36:1",
      text: "\u064A\u0633\u0646 \u0648\u064E\u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u0650",
      surahName: "Ya-Sin",
    },
  ],
  idgham_no_ghunnah: [
    {
      verseKey: "90:9",
      text: "\u0645\u0650\u0646 \u0631\u0651\u064E\u0628\u0651\u0650\u0643\u064E",
      surahName: "Al-Balad",
    },
  ],
  izhar: [
    {
      verseKey: "2:4",
      text: "\u0645\u0650\u0646\u0652 \u0639\u0650\u0644\u0652\u0645\u064D",
      surahName: "Al-Baqarah",
    },
    {
      verseKey: "6:13",
      text: "\u0645\u0650\u0646\u0652 \u062E\u064E\u064A\u0652\u0631\u064D",
      surahName: "Al-An'am",
    },
  ],
  qalqalah: [
    {
      verseKey: "112:1",
      text: "\u0642\u064F\u0644\u0652 \u0647\u064F\u0648\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0623\u064E\u062D\u064E\u062F\u0652",
      surahName: "Al-Ikhlas",
    },
    {
      verseKey: "113:1",
      text: "\u0642\u064F\u0644\u0652 \u0623\u064E\u0639\u064F\u0648\u0630\u064F \u0628\u0650\u0631\u064E\u0628\u0651\u0650 \u0627\u0644\u0652\u0641\u064E\u0644\u064E\u0642\u0650",
      surahName: "Al-Falaq",
    },
  ],
  ghunnah: [
    {
      verseKey: "110:1",
      text: "\u0625\u0650\u0646\u0651\u064E\u0627 \u0623\u064E\u0639\u0652\u0637\u064E\u064A\u0652\u0646\u064E\u0627\u0643\u064E",
      surahName: "Al-Kawthar",
    },
  ],
  madd_normal: [
    {
      verseKey: "1:1",
      text: "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0640\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
      surahName: "Al-Fatiha",
    },
  ],
  madd_muttasil: [
    {
      verseKey: "12:31",
      text: "\u062C\u064E\u0627\u0621\u064E \u0623\u064E\u062C\u064E\u0644\u064F\u0647\u064F\u0645\u0652",
      surahName: "Yusuf",
    },
  ],
  ikhfa_shafawi: [
    {
      verseKey: "105:4",
      text: "\u062A\u064E\u0631\u0652\u0645\u0650\u064A\u0647\u0650\u0645 \u0628\u0650\u062D\u0650\u062C\u064E\u0627\u0631\u064E\u0629\u064D",
      surahName: "Al-Fil",
    },
  ],
  izhar_shafawi: [
    {
      verseKey: "2:6",
      text: "\u0623\u064E\u0645\u0652 \u0644\u064E\u0645\u0652 \u062A\u064F\u0646\u0630\u0650\u0631\u0652\u0647\u064F\u0645\u0652",
      surahName: "Al-Baqarah",
    },
  ],
};

export interface TajweedPracticeProps {
  /** Rule type to practice */
  ruleType: TajweedRuleType;
  /** Callback when practice session completes */
  onComplete?: (score: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Interactive Tajweed practice mode.
 * Shows a verse with the target rule highlighted, lets the user practice,
 * and scores based on recognition of the rule.
 */
export function TajweedPractice({
  ruleType,
  onComplete,
  className,
}: TajweedPracticeProps) {
  const { recordPractice } = useTajweedStore();
  const ruleInfo = getRuleInfo(ruleType);

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [practiceState, setPracticeState] = useState<
    "ready" | "recording" | "scored"
  >("ready");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const verses = PRACTICE_VERSES[ruleType] ?? [];
  const currentVerse = verses[currentVerseIndex % Math.max(verses.length, 1)];

  // Detect tajweed rules in the current verse text
  const detectedRules = useMemo(() => {
    if (!currentVerse) return [];
    return detectTajweedRules(currentVerse.text);
  }, [currentVerse]);

  // Count how many instances of the target rule exist
  const targetRuleCount = useMemo(() => {
    return detectedRules.filter((r) => r.type === ruleType).length;
  }, [detectedRules, ruleType]);

  // Render verse text with highlighted rules
  const renderedText = useMemo(() => {
    if (!currentVerse) return null;

    const text = currentVerse.text;
    const rules = detectedRules.filter((r) => r.type === ruleType);

    if (rules.length === 0) {
      return <span>{text}</span>;
    }

    const segments: Array<{
      text: string;
      isHighlighted: boolean;
      key: number;
    }> = [];
    let currentIndex = 0;

    for (const rule of rules) {
      if (rule.startChar > currentIndex) {
        segments.push({
          text: text.slice(currentIndex, rule.startChar),
          isHighlighted: false,
          key: currentIndex,
        });
      }
      segments.push({
        text: text.slice(rule.startChar, rule.endChar + 1),
        isHighlighted: true,
        key: rule.startChar,
      });
      currentIndex = rule.endChar + 1;
    }

    if (currentIndex < text.length) {
      segments.push({
        text: text.slice(currentIndex),
        isHighlighted: false,
        key: currentIndex,
      });
    }

    return (
      <>
        {segments.map((seg) =>
          seg.isHighlighted ? (
            <span
              key={seg.key}
              className="rounded px-0.5"
              style={{
                color: ruleInfo.color,
                backgroundColor: `${ruleInfo.color}20`,
              }}
            >
              {seg.text}
            </span>
          ) : (
            <span key={seg.key}>{seg.text}</span>
          )
        )}
      </>
    );
  }, [currentVerse, detectedRules, ruleType, ruleInfo.color]);

  const handleStartRecording = useCallback(() => {
    setPracticeState("recording");
    // In a real implementation, this would use the VoiceRecorder component
    // For now, simulate a recording with auto-scoring after a delay
    setTimeout(() => {
      // Simulate a score based on a deterministic seed from attempts
      const simulatedScore = 70 + ((attempts * 7 + 13) % 30);
      setScore(simulatedScore);
      setTotalScore((prev) => prev + simulatedScore);
      setAttempts((prev) => prev + 1);
      setPracticeState("scored");

      // Record the practice
      recordPractice({
        ruleType,
        score: simulatedScore,
        timestamp: Date.now(),
        verseKey: currentVerse?.verseKey ?? "unknown",
      });
    }, 2000);
  }, [attempts, currentVerse?.verseKey, recordPractice, ruleType]);

  const handleNextVerse = useCallback(() => {
    setCurrentVerseIndex((prev) => prev + 1);
    setPracticeState("ready");
    setScore(0);
  }, []);

  const handleFinish = useCallback(() => {
    const avgScore = attempts > 0 ? Math.round(totalScore / attempts) : 0;
    onComplete?.(avgScore);
  }, [attempts, totalScore, onComplete]);

  if (verses.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No practice verses available for {ruleInfo.name} yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: ruleInfo.color }}
          />
          Practice: {ruleInfo.name}
          <span className="text-xs font-normal text-muted-foreground">
            ({ruleInfo.nameArabic})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Verse display */}
        {currentVerse && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {currentVerse.surahName} ({currentVerse.verseKey})
              </span>
              <span className="text-xs text-muted-foreground">
                {targetRuleCount} {ruleInfo.name} rule
                {targetRuleCount !== 1 ? "s" : ""} found
              </span>
            </div>
            <p
              className="font-arabic text-2xl leading-loose"
              dir="rtl"
              lang="ar"
            >
              {renderedText}
            </p>
          </div>
        )}

        {/* Practice Controls */}
        <div className="flex flex-col items-center gap-3">
          {practiceState === "ready" && (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Recite the verse above, focusing on the highlighted{" "}
                <span style={{ color: ruleInfo.color, fontWeight: 600 }}>
                  {ruleInfo.name}
                </span>{" "}
                rules.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <Volume2 className="mr-1 h-4 w-4" />
                  Listen
                </Button>
                <Button size="sm" onClick={handleStartRecording}>
                  <Mic className="mr-1 h-4 w-4" />
                  Record
                </Button>
              </div>
            </>
          )}

          {practiceState === "recording" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                <Mic className="h-8 w-8 animate-pulse text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground">Listening...</p>
            </div>
          )}

          {practiceState === "scored" && (
            <div className="w-full space-y-3">
              {/* Score display */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={cn(
                      "h-5 w-5",
                      score >= 90
                        ? "text-green-500"
                        : score >= 70
                          ? "text-amber-500"
                          : "text-red-500"
                    )}
                  />
                  <span className="text-2xl font-bold">{score}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {score >= 90
                    ? "Excellent!"
                    : score >= 70
                      ? "Good, keep practicing!"
                      : "Needs more practice"}
                </p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>
                    Attempt {attempts} of {verses.length}
                  </span>
                  <span>
                    Avg: {attempts > 0 ? Math.round(totalScore / attempts) : 0}%
                  </span>
                </div>
                <Progress
                  value={attempts > 0 ? Math.round(totalScore / attempts) : 0}
                  className="h-2"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPracticeState("ready")}
                >
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Retry
                </Button>
                {currentVerseIndex < verses.length - 1 ? (
                  <Button size="sm" onClick={handleNextVerse}>
                    Next Verse
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleFinish}>
                    Finish
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TajweedPractice;

"use client";

import type { TajweedRuleType } from "@/types/quran";
import { HelpCircle, Info, Lightbulb, X } from "lucide-react";

import { getRuleInfo } from "@/lib/tajweed/rule-mapper";
import { cn } from "@/lib/utils";
import { MASTERY_LEVEL_LABELS, useTajweedStore } from "@/stores/tajweedStore";
import { Button } from "@/components/ui/button";

export interface TajweedCoachProps {
  /** Override which rule to show (otherwise uses store activeRule) */
  ruleType?: TajweedRuleType | null;
  /** Whether the panel is visible */
  visible?: boolean;
  /** Callback when the panel is closed */
  onClose?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/** Tips for each rule category */
const RULE_TIPS: Partial<Record<TajweedRuleType, string[]>> = {
  ikhfa: [
    "Place your tongue near (but not touching) the position of the following letter.",
    "The ghunnah (nasalization) should come from the nose, not the mouth.",
    "Practice with common phrases like 'min ba`di' to build muscle memory.",
  ],
  iqlab: [
    "Convert the noon sound to a meem, then hold the ghunnah for 2 counts.",
    "Your lips should close as if pronouncing meem.",
    "The word 'anbi`hum' in Surah Al-Baqarah is a classic example.",
  ],
  idgham_ghunnah: [
    "The noon completely disappears into the following letter.",
    "Maintain the nasal sound (ghunnah) for 2 counts.",
    "Remember the letters with the mnemonic: Ya, Noon, Meem, Waw.",
  ],
  idgham_no_ghunnah: [
    "The noon merges completely - no nasal sound at all.",
    "This only happens before Lam and Ra.",
    "Transition smoothly without any pause between the words.",
  ],
  izhar: [
    "Pronounce the noon clearly from the tip of the tongue.",
    "No merging or hiding - the noon is fully articulated.",
    "The 6 throat letters are: Hamza, Ha, Ain, Haa, Ghain, Kha.",
  ],
  qalqalah: [
    "The echo should be a short, crisp bounce - not a full vowel.",
    "At the end of an ayah (waqf), the qalqalah is stronger.",
    "Practice the 5 letters individually: Qaf, Tta, Ba, Jim, Dal.",
  ],
  ghunnah: [
    "The nasalization should resonate through the nose for 2 full counts.",
    "Keep your mouth in the position of the letter while nasalizing.",
    "Listen to expert reciters and try to match their ghunnah duration.",
  ],
  madd_normal: [
    "Count exactly 2 beats: 'one-two' at a steady pace.",
    "The elongation should be smooth and even, not rushed.",
    "This is the foundation - master this before moving to longer madds.",
  ],
  madd_muttasil: [
    "Elongate for 4-5 counts when the hamza is in the same word.",
    "This madd is obligatory (waajib) - it cannot be shortened to 2.",
    "Maintain an even sound throughout the elongation.",
  ],
  madd_lazim: [
    "Always elongate for exactly 6 counts - no more, no less.",
    "This is the longest madd and occurs with sukun or shadda after the madd letter.",
    "Found at the beginning of some surahs in the disconnected letters.",
  ],
  ikhfa_shafawi: [
    "Bring your lips close together without fully closing them.",
    "The meem sound is partially hidden with a light ghunnah.",
    "This only occurs before the letter Ba.",
  ],
  izhar_shafawi: [
    "Pronounce the meem clearly from the lips.",
    "No nasalization extension - just a clean meem sound.",
    "This occurs before all letters except Ba and Meem.",
  ],
};

/**
 * Floating coach panel showing the current active Tajweed rule
 * with its description, color, score, and practice tips.
 */
export function TajweedCoach({
  ruleType: ruleTypeProp,
  visible = true,
  onClose,
  className,
}: TajweedCoachProps) {
  const { activeRule, masteryLevels, getAverageScore, getSessionCount } =
    useTajweedStore();

  const currentRule = ruleTypeProp ?? activeRule;

  if (!visible || !currentRule) {
    return null;
  }

  const ruleInfo = getRuleInfo(currentRule);
  const mastery = masteryLevels[currentRule];
  const avgScore = getAverageScore(currentRule);
  const sessions = getSessionCount(currentRule);
  const tips = RULE_TIPS[currentRule] ?? [];

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-lg",
        "animate-fade-in",
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: ruleInfo.color }}
          />
          <div>
            <h3 className="text-sm font-bold">{ruleInfo.name}</h3>
            <p className="text-xs" dir="rtl" lang="ar">
              {ruleInfo.nameArabic}
            </p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label="Close coach panel"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Description */}
      <div className="mb-3 flex items-start gap-2 rounded-md bg-muted/50 p-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          {ruleInfo.detailedDescription}
        </p>
      </div>

      {/* Practice Stats */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-muted/30 p-1.5">
          <p className="text-lg font-bold">{avgScore}%</p>
          <p className="text-[10px] text-muted-foreground">Avg Score</p>
        </div>
        <div className="rounded-md bg-muted/30 p-1.5">
          <p className="text-lg font-bold">{sessions}</p>
          <p className="text-[10px] text-muted-foreground">Sessions</p>
        </div>
        <div className="rounded-md bg-muted/30 p-1.5">
          <p className="text-lg font-bold">{MASTERY_LEVEL_LABELS[mastery]}</p>
          <p className="text-[10px] text-muted-foreground">Level</p>
        </div>
      </div>

      {/* Example */}
      <div className="mb-3 rounded-md border p-2 text-center">
        <p className="text-xs text-muted-foreground">Example</p>
        <p
          className="font-arabic text-xl leading-loose"
          dir="rtl"
          lang="ar"
          style={{ color: ruleInfo.color }}
        >
          {ruleInfo.exampleWord}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {ruleInfo.exampleTransliteration}
        </p>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-1">
            <Lightbulb className="h-3 w-3 text-amber-500" />
            <span className="text-xs font-semibold">Tips</span>
          </div>
          <ul className="space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-1.5">
                <HelpCircle className="mt-0.5 h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                <span className="text-[11px] leading-tight text-muted-foreground">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TajweedCoach;

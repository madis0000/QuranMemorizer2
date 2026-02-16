"use client";

import type { SurahTree } from "@/lib/gamification/surah-trees";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  computeNodeState,
  NODE_STATE_COLORS,
  SURAH_ARABIC,
} from "./road-utils";
import { SurahCompositionView } from "./SurahCompositionView";

interface SurahPopupProps {
  tree: SurahTree;
  open: boolean;
  onClose: () => void;
}

export function SurahPopup({ tree, open, onClose }: SurahPopupProps) {
  const state = computeNodeState(tree);
  const colors = NODE_STATE_COLORS[state];
  const arabicName = SURAH_ARABIC[tree.surahNumber] ?? "";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: colors.fill + "33",
                border: `2px solid ${colors.stroke}`,
              }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: colors.stroke }}
              >
                {tree.surahNumber}
              </span>
            </div>
            <span>{tree.surahName}</span>
            <span className="text-lg font-arabic" dir="rtl">
              {arabicName}
            </span>
          </DialogTitle>
          <DialogDescription>
            {tree.totalAyahs} ayahs — {tree.bloomCount} blooming —{" "}
            {tree.trunkMastery}% mastery
          </DialogDescription>
        </DialogHeader>

        <SurahCompositionView tree={tree} onBack={onClose} hideHeader />
      </DialogContent>
    </Dialog>
  );
}

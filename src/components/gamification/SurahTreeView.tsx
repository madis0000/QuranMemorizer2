"use client";

import type {
  FlowerStage,
  SurahTree,
  TreeSize,
} from "@/lib/gamification/surah-trees";
import { cn } from "@/lib/utils";

const TREE_HEIGHT: Record<TreeSize, string> = {
  bonsai: "h-20",
  shrub: "h-28",
  sapling: "h-36",
  tree: "h-44",
  oak: "h-52",
  baobab: "h-60",
};

const SEASON_COLORS: Record<string, string> = {
  spring: "text-[#059669] dark:text-[#00E5A0]",
  summer: "text-[#047857] dark:text-[#34d399]",
  autumn: "text-[#B8860B] dark:text-[#FFD700]",
  winter: "text-[#6b7280] dark:text-[#9ca3af]",
};

const FLOWER_COLORS: Record<FlowerStage, string> = {
  seed: "bg-[#D1E0D8]/50 dark:bg-[#1a2e23]/50",
  sprout: "bg-[#059669]/20 dark:bg-[#00E5A0]/20",
  bud: "bg-[#059669]/40 dark:bg-[#00E5A0]/40",
  bloom: "bg-[#059669] dark:bg-[#00E5A0]",
  wilted: "bg-[#B8860B]/40 dark:bg-[#FFD700]/30",
};

interface SurahTreeViewProps {
  tree: SurahTree;
  compact?: boolean;
  onClick?: () => void;
}

export function SurahTreeView({ tree, compact, onClick }: SurahTreeViewProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-4 backdrop-blur-sm transition-all",
        onClick &&
          "cursor-pointer hover:border-[#059669]/50 dark:hover:border-[#00E5A0]/30",
        compact && "p-2"
      )}
      onClick={onClick}
    >
      {/* Tree SVG */}
      <div
        className={cn(
          "relative flex items-end justify-center",
          TREE_HEIGHT[tree.treeSize]
        )}
      >
        {/* Trunk */}
        <div
          className="w-2 bg-[#8B6914] dark:bg-[#B8860B] rounded-t"
          style={{ height: "40%" }}
        />
        {/* Canopy */}
        <div
          className={cn(
            "absolute bottom-[40%] w-full rounded-full",
            SEASON_COLORS[tree.season]
          )}
          style={{
            height: "70%",
            background: "currentColor",
            opacity: 0.2,
            borderRadius: "50% 50% 40% 40%",
          }}
        />
      </div>

      {/* Info */}
      {!compact && (
        <div className="text-center mt-3 space-y-1">
          <div className="text-xs font-medium">{tree.surahName}</div>
          <div className="text-[10px] text-muted-foreground capitalize">
            {tree.season}
          </div>
        </div>
      )}

      {/* Flower grid (miniature) */}
      <div className="flex flex-wrap gap-0.5 mt-2 justify-center max-w-[80px]">
        {tree.flowers.slice(0, compact ? 20 : 50).map((flower) => (
          <div
            key={flower.ayahNumber}
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              FLOWER_COLORS[flower.stage]
            )}
            title={`Ayah ${flower.ayahNumber}: ${flower.stage}`}
          />
        ))}
        {tree.flowers.length > (compact ? 20 : 50) && (
          <span className="text-[8px] text-muted-foreground">
            +{tree.flowers.length - (compact ? 20 : 50)}
          </span>
        )}
      </div>

      {/* Mastery bar */}
      <div className="w-full mt-2">
        <div className="h-1 bg-[#D1E0D8] dark:bg-[#00E5A0]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#059669] dark:bg-[#00E5A0] rounded-full transition-all"
            style={{ width: `${tree.trunkMastery}%` }}
          />
        </div>
        {!compact && (
          <div className="text-[10px] text-muted-foreground text-center mt-0.5">
            {tree.trunkMastery}%
          </div>
        )}
      </div>
    </div>
  );
}

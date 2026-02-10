"use client";

import type { BiomeState } from "@/lib/gamification/garden";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const BIOME_EMOJI: Record<string, string> = {
  meadow: "\uD83C\uDF3F",
  oasis: "\uD83C\uDF34",
  forest: "\uD83C\uDF32",
  mountain: "\u26F0\uFE0F",
  valley: "\uD83C\uDF3E",
  garden: "\uD83C\uDF3A",
  riverside: "\uD83C\uDF0A",
};

const BIOME_BG: Record<string, string> = {
  meadow: "from-[#059669]/5 to-[#059669]/10",
  oasis: "from-[#0d9488]/5 to-[#0d9488]/10",
  forest: "from-[#065f46]/5 to-[#065f46]/10",
  mountain: "from-[#6b7280]/5 to-[#6b7280]/10",
  valley: "from-[#059669]/5 to-[#047857]/10",
  garden: "from-[#FFD700]/5 to-[#B8860B]/10",
  riverside: "from-[#0d9488]/5 to-[#059669]/10",
};

interface BiomeMapProps {
  biomes: BiomeState[];
  onSelectBiome?: (juzNumber: number) => void;
}

export function BiomeMap({ biomes, onSelectBiome }: BiomeMapProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{t("garden.biomes")}</h3>
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
        {biomes.map((biome) => (
          <button
            key={biome.juzNumber}
            onClick={() => onSelectBiome?.(biome.juzNumber)}
            className={cn(
              "relative rounded-lg p-2 border transition-all text-center",
              "border-[#D1E0D8] dark:border-[#00E5A0]/10",
              "hover:border-[#059669]/50 dark:hover:border-[#00E5A0]/30",
              `bg-gradient-to-br ${BIOME_BG[biome.type] ?? BIOME_BG.meadow}`
            )}
          >
            <span className="text-lg">
              {BIOME_EMOJI[biome.type] ?? "\uD83C\uDF3F"}
            </span>
            <div className="text-[10px] font-medium mt-1">
              Juz {biome.juzNumber}
            </div>
            <div className="h-1 mt-1 bg-[#D1E0D8]/50 dark:bg-[#00E5A0]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#059669] dark:bg-[#00E5A0] rounded-full"
                style={{ width: `${biome.completionPct}%` }}
              />
            </div>
            <div className="text-[8px] text-muted-foreground mt-0.5">
              {biome.completionPct}%
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

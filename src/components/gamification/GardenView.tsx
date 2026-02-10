"use client";

import { Loader2, Sparkles, TreePine } from "lucide-react";

import type { BiomeState } from "@/lib/gamification/garden";
import { cn } from "@/lib/utils";
import { useGarden } from "@/hooks/use-garden";
import { useTranslation } from "@/hooks/use-translation";

import { BiomeMap } from "./BiomeMap";
import { GardenShop } from "./GardenShop";

export function GardenView() {
  const { t } = useTranslation();
  const { data, isLoading } = useGarden();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#059669] dark:text-[#00E5A0]" />
      </div>
    );
  }

  const garden = data?.garden;
  if (!garden) {
    return (
      <div className="text-center py-16">
        <TreePine className="w-12 h-12 mx-auto mb-4 text-[#059669]/30 dark:text-[#00E5A0]/30" />
        <p className="text-muted-foreground">{t("garden.empty")}</p>
      </div>
    );
  }

  const state = garden.state as {
    biomes?: BiomeState[];
    decorations?: Array<{ id: string; name: string }>;
  };

  return (
    <div className="space-y-6">
      {/* Paradise check */}
      {garden.isParadise && (
        <div className="rounded-xl border border-[#FFD700]/40 bg-gradient-to-r from-[#FFD700]/10 to-[#B8860B]/10 p-4 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#FFD700]" />
          <h3 className="text-lg font-bold text-[#B8860B] dark:text-[#FFD700]">
            {t("garden.paradise")}
          </h3>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-3 text-center">
          <div className="text-2xl font-bold">{garden.gardenLevel}</div>
          <div className="text-xs text-muted-foreground">
            {t("garden.level")}
          </div>
        </div>
        <div className="rounded-lg border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-3 text-center">
          <div
            className={cn(
              "text-2xl font-bold text-[#B8860B] dark:text-[#FFD700]"
            )}
          >
            {garden.hasanat}
          </div>
          <div className="text-xs text-muted-foreground">
            {t("garden.hasanat")}
          </div>
        </div>
        <div className="rounded-lg border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-3 text-center">
          <div className="text-2xl font-bold">
            {state.decorations?.length ?? 0}
          </div>
          <div className="text-xs text-muted-foreground">Decorations</div>
        </div>
      </div>

      {/* Biome Map */}
      {state.biomes && <BiomeMap biomes={state.biomes} />}

      {/* Shop */}
      <GardenShop hasanat={garden.hasanat} />
    </div>
  );
}

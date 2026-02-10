"use client";

import { ShoppingBag } from "lucide-react";

import { GARDEN_SHOP } from "@/lib/gamification/garden";
import { cn } from "@/lib/utils";
import { usePurchaseDecoration } from "@/hooks/use-garden";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

const TYPE_EMOJI: Record<string, string> = {
  fountain: "\u26F2",
  bridge: "\uD83C\uDF09",
  bird: "\uD83D\uDC26",
  butterfly: "\uD83E\uDD8B",
  lantern: "\uD83C\uDFEE",
  gate: "\u26E9\uFE0F",
};

interface GardenShopProps {
  hasanat: number;
}

export function GardenShop({ hasanat }: GardenShopProps) {
  const { t } = useTranslation();
  const purchaseMutation = usePurchaseDecoration();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#059669] dark:text-[#00E5A0]" />
          <h3 className="text-sm font-semibold">{t("garden.shop")}</h3>
        </div>
        <span className="text-xs text-[#B8860B] dark:text-[#FFD700] font-medium">
          {hasanat} {t("garden.hasanat")}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {GARDEN_SHOP.map((item) => {
          const canAfford = hasanat >= item.cost;
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-lg border p-3 text-center",
                "border-[#D1E0D8] dark:border-[#00E5A0]/10",
                "bg-white/80 dark:bg-[#0F1A14]/80"
              )}
            >
              <span className="text-2xl">
                {TYPE_EMOJI[item.type] ?? "\u2728"}
              </span>
              <div className="text-xs font-medium mt-1">{item.name}</div>
              <div className="text-[10px] text-[#B8860B] dark:text-[#FFD700] font-medium mt-0.5">
                {item.cost} {t("garden.hasanat")}
              </div>
              <Button
                size="sm"
                variant="ghost"
                disabled={!canAfford || purchaseMutation.isPending}
                onClick={() => purchaseMutation.mutate(item.id)}
                className={cn(
                  "mt-1.5 text-xs h-7 w-full",
                  canAfford
                    ? "text-[#059669] dark:text-[#00E5A0]"
                    : "text-muted-foreground"
                )}
              >
                {canAfford ? t("common.start") : "---"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

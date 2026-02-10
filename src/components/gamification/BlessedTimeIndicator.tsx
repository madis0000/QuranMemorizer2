"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { getBlessedTimeMultiplier } from "@/lib/gamification/xp";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export function BlessedTimeIndicator() {
  const { t } = useTranslation();
  const [blessedTime, setBlessedTime] = useState<{
    multiplier: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    function check() {
      const result = getBlessedTimeMultiplier(new Date().getHours());
      setBlessedTime(result.multiplier > 1 ? result : null);
    }
    check();
    const interval = setInterval(check, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, []);

  if (!blessedTime) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold",
        "bg-[#FFD700]/15 text-[#B8860B] dark:bg-[#FFD700]/10 dark:text-[#FFD700]",
        "border border-[#FFD700]/30 dark:border-[#FFD700]/20",
        "animate-pulse"
      )}
    >
      <Sparkles className="w-3.5 h-3.5 fill-current" />
      <span>
        {t("blessed.active") || blessedTime.name}: {blessedTime.multiplier}x XP
      </span>
    </div>
  );
}

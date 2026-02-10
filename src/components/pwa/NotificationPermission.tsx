"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

import {
  getPushSubscription,
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/notifications/push";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

export function NotificationPermission() {
  const { t } = useTranslation();
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(isPushSupported());
    getPushSubscription().then((sub) => setSubscribed(!!sub));
  }, []);

  if (!supported) return null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (subscribed) {
        await unsubscribeFromPush();
        setSubscribed(false);
      } else {
        const sub = await subscribeToPush();
        setSubscribed(!!sub);
        if (!sub) {
          // Permission was denied
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            subscribed
              ? "bg-[#059669]/10 dark:bg-[#00E5A0]/10"
              : "bg-[#D1E0D8]/50 dark:bg-[#1a2e23]/50"
          )}
        >
          {subscribed ? (
            <Bell className="w-4 h-4 text-[#059669] dark:text-[#00E5A0]" />
          ) : (
            <BellOff className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div>
          <div className="text-sm font-medium">{t("notifications.enable")}</div>
          <div className="text-xs text-muted-foreground">
            {t("notifications.enable_desc")}
          </div>
        </div>
      </div>
      <Button
        variant={subscribed ? "ghost" : "default"}
        size="sm"
        onClick={handleToggle}
        disabled={loading}
        className={
          subscribed
            ? ""
            : "bg-[#059669] hover:bg-[#047857] text-white dark:bg-[#00E5A0] dark:hover:bg-[#00E5A0]/80 dark:text-[#0F1A14]"
        }
      >
        {loading ? "..." : subscribed ? t("common.done") : t("common.start")}
      </Button>
    </div>
  );
}

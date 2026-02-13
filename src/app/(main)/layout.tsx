"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/stores";

import { getAchievementByCode } from "@/lib/gamification/achievements";
import { useGamificationStore } from "@/stores/gamificationStore";
import {
  MobileBottomNav,
  MobileTopBar,
} from "@/components/layout/MobileBottomNav";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Dynamic imports for heavy components — reduces initial bundle
const MiniPlayer = dynamic(
  () => import("@/components/audio/MiniPlayer").then((m) => m.MiniPlayer),
  { ssr: false }
);
const AchievementPopup = dynamic(
  () =>
    import("@/components/gamification/AchievementPopup").then(
      (m) => m.AchievementPopup
    ),
  { ssr: false }
);
const BlessedTimeIndicator = dynamic(
  () =>
    import("@/components/gamification/BlessedTimeIndicator").then(
      (m) => m.BlessedTimeIndicator
    ),
  { ssr: false }
);
const XPAwardToast = dynamic(
  () =>
    import("@/components/gamification/XPAwardToast").then(
      (m) => m.XPAwardToast
    ),
  { ssr: false }
);
const VoiceSearchFAB = dynamic(
  () =>
    import("@/components/voice/VoiceSearchFAB").then((m) => m.VoiceSearchFAB),
  { ssr: false }
);

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOnboarded } = useUserStore();
  const { recentXPAward, clearXPAward, recentAchievement, dismissAchievement } =
    useGamificationStore();
  const achievementData = recentAchievement
    ? getAchievementByCode(recentAchievement)
    : null;

  // Redirect to onboarding if not completed (wait for Zustand hydration first)
  const [hydrated, setHydrated] = useState(() => {
    try {
      return useUserStore.persist?.hasHydrated?.() ?? false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (hydrated) return;
    // Zustand persist hydrates async — wait for it before checking isOnboarded
    const unsub = useUserStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return () => {
      unsub();
    };
  }, [hydrated]);

  useEffect(() => {
    if (hydrated && !isOnboarded && pathname !== "/onboarding") {
      router.push("/onboarding");
    }
  }, [hydrated, isOnboarded, pathname, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Top Nav */}
      <TopNavBar />

      {/* Mobile Top Bar */}
      <MobileTopBar />

      {/* Main Content */}
      <main className="pt-14 lg:pt-16 pb-20 lg:pb-0">
        <ErrorBoundary>{children}</ErrorBoundary>
        <MiniPlayer />
        <BlessedTimeIndicator />
      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />

      {/* Voice Search FAB - floats above all content */}
      <VoiceSearchFAB />

      {/* Gamification Overlays */}
      {recentXPAward && (
        <XPAwardToast
          amount={recentXPAward.amount}
          multiplier={recentXPAward.multiplier}
          source="Session Complete"
          onComplete={clearXPAward}
        />
      )}
      {achievementData && (
        <AchievementPopup
          achievement={achievementData}
          onDismiss={dismissAchievement}
        />
      )}
    </div>
  );
}

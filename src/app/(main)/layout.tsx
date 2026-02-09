"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/stores";
import {
  BarChart3,
  BookOpen,
  Brain,
  Flame,
  Headphones,
  Menu,
  Search,
  Settings,
  Trees,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { VoiceSearchFAB } from "@/components/voice/VoiceSearchFAB";

const navigation = [
  { nameKey: "nav.quran", href: "/quran", icon: BookOpen },
  { nameKey: "nav.memorize", href: "/memorize", icon: Brain },
  { nameKey: "nav.listen", href: "/listen", icon: Headphones },
  { nameKey: "nav.search", href: "/search", icon: Search },
  { nameKey: "nav.progress", href: "/progress", icon: BarChart3 },
  { nameKey: "nav.circles", href: "/circles", icon: Users },
  { nameKey: "nav.settings", href: "/settings", icon: Settings },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { streak, sidebarOpen, toggleSidebar, isOnboarded } = useUserStore();
  const { t } = useTranslation();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!isOnboarded && pathname !== "/onboarding") {
      router.push("/onboarding");
    }
  }, [isOnboarded, pathname, router]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300",
          sidebarOpen ? "lg:w-64" : "lg:w-20"
        )}
      >
        <div className="flex flex-col flex-grow border-r border-[#D1E0D8] bg-white/80 backdrop-blur-sm dark:border-[#00E5A0]/10 dark:bg-[#0F1A14]/90">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-[#D1E0D8] dark:border-[#00E5A0]/10">
            {sidebarOpen && (
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#059669] dark:bg-[#00E5A0]/20 dark:shadow-[0_0_15px_rgba(0,229,160,0.3)] flex items-center justify-center">
                  <Trees className="h-5 w-5 text-primary-foreground dark:text-[#00E5A0]" />
                </div>
                <span className="font-semibold text-lg">QuranMemorizer</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.nameKey}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0]"
                      : "text-muted-foreground hover:bg-[#059669]/5 dark:hover:bg-[#00E5A0]/5 hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && <span>{t(item.nameKey)}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Streak Display */}
          {sidebarOpen && (
            <div className="p-4 border-t border-[#D1E0D8] dark:border-[#00E5A0]/10">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#059669]/5 border border-[#D1E0D8] dark:bg-[#00E5A0]/5 dark:border-[#00E5A0]/10">
                <Flame className="h-5 w-5 text-[#FFD700]" />
                <div>
                  <p className="text-sm font-medium">
                    {streak.currentStreak} {t("streak.day_streak")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("streak.keep_going")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-[#D1E0D8] bg-white/80 backdrop-blur-sm dark:border-[#00E5A0]/10 dark:bg-[#0F1A14]/90">
        <div className="flex h-full items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#059669] dark:bg-[#00E5A0]/20 dark:shadow-[0_0_15px_rgba(0,229,160,0.3)] flex items-center justify-center">
              <Trees className="h-5 w-5 text-primary-foreground dark:text-[#00E5A0]" />
            </div>
            <span className="font-semibold">QuranMemorizer</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-16">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="relative bg-white/95 backdrop-blur-md border-r border-[#D1E0D8] dark:bg-[#0F1A14]/95 dark:border-[#00E5A0]/10 w-64 h-full py-4 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.nameKey}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0]"
                      : "text-muted-foreground hover:bg-[#059669]/5 dark:hover:bg-[#00E5A0]/5 hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{t(item.nameKey)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20",
          "pt-16 lg:pt-0"
        )}
      >
        <div className="h-full pb-16">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
        <MiniPlayer />
      </main>

      {/* Voice Search FAB - floats above all content */}
      <VoiceSearchFAB />
    </div>
  );
}

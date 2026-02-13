"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Clock,
  Flower2,
  GitCompareArrows,
  Headphones,
  Menu,
  Moon,
  RotateCcw,
  Search,
  Settings,
  Sun,
  Swords,
  Trees,
  Trophy,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useUserStore } from "@/stores/userStore";
import { GamificationStrip } from "@/components/layout/GamificationStrip";
import { Button } from "@/components/ui/button";

const bottomTabs = [
  { nameKey: "nav.quran", href: "/quran", icon: BookOpen },
  { nameKey: "nav.memorize", href: "/memorize", icon: Brain },
  { nameKey: "nav.listen", href: "/listen", icon: Headphones },
  { nameKey: "nav.search", href: "/search", icon: Search },
  { nameKey: "nav.progress", href: "/progress", icon: BarChart3 },
];

const allNavItems = [
  { nameKey: "nav.quran", href: "/quran", icon: BookOpen },
  { nameKey: "nav.memorize", href: "/memorize", icon: Brain },
  { nameKey: "nav.listen", href: "/listen", icon: Headphones },
  { nameKey: "nav.search", href: "/search", icon: Search },
  { nameKey: "nav.progress", href: "/progress", icon: BarChart3 },
  { nameKey: "nav.sessions", href: "/sessions", icon: Clock },
  { nameKey: "nav.garden", href: "/garden", icon: Flower2 },
  { nameKey: "nav.challenges", href: "/challenges", icon: Swords },
  { nameKey: "nav.similar", href: "/similar-verses", icon: GitCompareArrows },
  { nameKey: "nav.circles", href: "/circles", icon: Users },
  { nameKey: "nav.review", href: "/review", icon: RotateCcw },
  { nameKey: "nav.achievements", href: "/achievements", icon: Trophy },
  { nameKey: "nav.settings", href: "/settings", icon: Settings },
];

export function MobileTopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 border-b border-[#D1E0D8] bg-[#F0F5F2]/90 backdrop-blur-xl dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/90">
        <div className="flex h-full items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[#059669] dark:text-[#00E5A0]"
          >
            <Trees
              className="size-4"
              style={{ filter: "drop-shadow(0 0 4px rgba(5,150,105,0.3))" }}
            />
            <span className="font-medium text-sm">QM</span>
          </Link>

          <GamificationStrip compact />

          <div className="flex items-center gap-1">
            <MobileThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Full-screen hamburger overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="relative bg-[#F0F5F2]/95 backdrop-blur-xl dark:bg-[#080F0B]/95 w-full h-full py-6 px-6 space-y-1 overflow-y-auto">
            {allNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.nameKey}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0]"
                      : "text-[#5A7B6B] hover:bg-[#059669]/5 dark:text-[#6B8B7B] dark:hover:bg-[#00E5A0]/5"
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
    </>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#D1E0D8] bg-[#F0F5F2]/90 backdrop-blur-xl dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/90 pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {bottomTabs.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.nameKey}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-[#059669] dark:text-[#00E5A0]"
                  : "text-[#5A7B6B] dark:text-[#6B8B7B]"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "fill-current/10")}
              />
              <span className="text-[10px] font-medium truncate">
                {t(item.nameKey)}
              </span>
              {isActive && (
                <span className="absolute -bottom-0 h-0.5 w-6 rounded-full bg-[#059669] dark:bg-[#00E5A0]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Mobile theme toggle button
 */
function MobileThemeToggle() {
  const theme = useUserStore((s) => s.settings.theme);
  const setTheme = useUserStore((s) => s.setTheme);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme(isDark ? "light" : "dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleToggle}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  ChevronDown,
  Clock,
  Flower2,
  GitCompareArrows,
  Headphones,
  Moon,
  RotateCcw,
  Search,
  Settings,
  Sun,
  Swords,
  Trees,
  Trophy,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useUserStore, type Theme } from "@/stores/userStore";
import { GamificationStrip } from "@/components/layout/GamificationStrip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryNav = [
  { nameKey: "nav.quran", href: "/quran", icon: BookOpen },
  { nameKey: "nav.memorize", href: "/memorize", icon: Brain },
  { nameKey: "nav.listen", href: "/listen", icon: Headphones },
  { nameKey: "nav.search", href: "/search", icon: Search },
  { nameKey: "nav.progress", href: "/progress", icon: BarChart3 },
];

const secondaryNav = [
  { nameKey: "nav.sessions", href: "/sessions", icon: Clock },
  { nameKey: "nav.garden", href: "/garden", icon: Flower2 },
  { nameKey: "nav.challenges", href: "/challenges", icon: Swords },
  { nameKey: "nav.tajweed", href: "/tajweed", icon: BookOpen },
  { nameKey: "nav.similar", href: "/similar-verses", icon: GitCompareArrows },
  { nameKey: "nav.circles", href: "/circles", icon: Users },
  { nameKey: "nav.review", href: "/review", icon: RotateCcw },
  { nameKey: "nav.achievements", href: "/achievements", icon: Trophy },
];

export function TopNavBar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isSecondaryActive = secondaryNav.some((item) =>
    pathname.startsWith(item.href)
  );

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-[#D1E0D8] bg-[#F0F5F2]/80 backdrop-blur-xl dark:border-[#00E5A0]/10 dark:bg-[#080F0B]/80 hidden lg:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-light tracking-wide text-[#059669] transition-opacity duration-200 hover:opacity-80 dark:text-[#00E5A0] shrink-0"
        >
          <Trees
            className="size-5"
            style={{ filter: "drop-shadow(0 0 6px rgba(5,150,105,0.3))" }}
          />
          <span className="font-medium">QuranMemorizer</span>
        </Link>

        {/* Center: Primary Nav + More */}
        <div className="flex items-center gap-1">
          {primaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.nameKey}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive
                    ? "text-[#059669] dark:text-[#00E5A0]"
                    : "text-[#5A7B6B] hover:text-[#059669] dark:text-[#6B8B7B] dark:hover:text-[#00E5A0]"
                )}
              >
                {t(item.nameKey)}
                {isActive && (
                  <span className="absolute bottom-0 start-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-[#059669] dark:bg-[#00E5A0] dark:shadow-[0_0_6px_rgba(0,229,160,0.5)]" />
                )}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isSecondaryActive
                    ? "text-[#059669] dark:text-[#00E5A0]"
                    : "text-[#5A7B6B] hover:text-[#059669] dark:text-[#6B8B7B] dark:hover:text-[#00E5A0]"
                )}
              >
                {t("nav.more") || "More"}
                <ChevronDown className="h-3.5 w-3.5" />
                {isSecondaryActive && (
                  <span className="absolute bottom-0 start-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-[#059669] dark:bg-[#00E5A0]" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {secondaryNav.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <DropdownMenuItem key={item.nameKey} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive && "text-[#059669] dark:text-[#00E5A0]"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {t(item.nameKey)}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: Gamification + Theme Toggle + Settings */}
        <div className="flex items-center gap-3 shrink-0">
          <GamificationStrip />
          <div className="h-4 w-px bg-border" />
          <ThemeToggle />
          <Link href="/settings" aria-label="Settings">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

/**
 * Theme toggle button — cycles light → dark → system
 */
function ThemeToggle() {
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
      // system or sepia → toggle to opposite of current appearance
      setTheme(isDark ? "light" : "dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleToggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}

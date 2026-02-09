import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Headphones,
  LogIn,
  Mic,
  Repeat,
  Sparkles,
  Star,
  Trophy,
  UserPlus,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const cobalt = "#1B4B8A";
const terracotta = "#C1553B";
const teal = "#2A7F6F";
const gold = "#C9A84C";

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    description:
      "7+ editions rendered with exact physical layouts &mdash; Madinah, IndoPak, and beyond.",
    accent: cobalt,
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Recite aloud and receive instant word-level feedback via Web Speech API with Whisper AI fallback.",
    accent: terracotta,
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    description:
      "Science-backed scheduling achieving 30% fewer reviews with higher retention than SM-2.",
    accent: teal,
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    description:
      "Real-time color-coded coaching with audio analysis and animated pronunciation guides.",
    accent: gold,
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    description:
      "From first-letter hints to full recall &mdash; eight distinct strategies for every memory pathway.",
    accent: cobalt,
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    description:
      "Five competitive tiers from Talib to Imam with weekly promotions and streak multipliers.",
    accent: terracotta,
  },
  {
    icon: Headphones,
    title: "Follow Renowned Qaris",
    description:
      "Ayah-by-ayah playback with word-level highlighting, adjustable speed, and offline downloads.",
    accent: teal,
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    description:
      "Install on any device, study without internet. Data syncs seamlessly when you reconnect.",
    accent: gold,
  },
];

const stats = [
  { value: "114", label: "Surahs" },
  { value: "6,236", label: "Ayahs" },
  { value: "7+", label: "Editions" },
  { value: "100+", label: "Translations" },
];

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Privacy", href: "#privacy" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------ */
/*  Zellij SVG Pattern                                                 */
/* ------------------------------------------------------------------ */

function ZellijPattern({
  className,
  opacity = 0.15,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="zellij"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          {/* 8-pointed star */}
          <polygon
            points="50,10 61,39 90,39 67,56 74,85 50,68 26,85 33,56 10,39 39,39"
            fill="none"
            stroke={cobalt}
            strokeWidth="0.8"
          />
          {/* Cross elements */}
          <rect
            x="44"
            y="0"
            width="12"
            height="12"
            fill="none"
            stroke={terracotta}
            strokeWidth="0.5"
            transform="rotate(45 50 6)"
          />
          <rect
            x="44"
            y="88"
            width="12"
            height="12"
            fill="none"
            stroke={terracotta}
            strokeWidth="0.5"
            transform="rotate(45 50 94)"
          />
          <rect
            x="-6"
            y="44"
            width="12"
            height="12"
            fill="none"
            stroke={teal}
            strokeWidth="0.5"
            transform="rotate(45 0 50)"
          />
          <rect
            x="94"
            y="44"
            width="12"
            height="12"
            fill="none"
            stroke={teal}
            strokeWidth="0.5"
            transform="rotate(45 100 50)"
          />
          {/* Inner ring */}
          <circle
            cx="50"
            cy="50"
            r="18"
            fill="none"
            stroke={gold}
            strokeWidth="0.4"
          />
          {/* Corner diamonds */}
          <polygon
            points="0,0 8,0 0,8"
            fill="none"
            stroke={cobalt}
            strokeWidth="0.3"
          />
          <polygon
            points="100,0 92,0 100,8"
            fill="none"
            stroke={cobalt}
            strokeWidth="0.3"
          />
          <polygon
            points="0,100 8,100 0,92"
            fill="none"
            stroke={cobalt}
            strokeWidth="0.3"
          />
          <polygon
            points="100,100 92,100 100,92"
            fill="none"
            stroke={cobalt}
            strokeWidth="0.3"
          />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#zellij)" />
    </svg>
  );
}

/* Small geometric star icon for stats */
function GeometricStar({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="inline-block"
      aria-hidden="true"
    >
      <polygon
        points="8,1 9.8,6.2 15,6.2 10.8,9.5 12.2,15 8,11.5 3.8,15 5.2,9.5 1,6.2 6.2,6.2"
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  );
}

/* Mini pattern strip for card tops */
function MiniPatternStrip({ color }: { color: string }) {
  return (
    <svg
      className="h-[3px] w-full"
      viewBox="0 0 400 3"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`mini-${color.replace("#", "")}`}
          x="0"
          y="0"
          width="12"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <polygon points="6,0 9,1.5 6,3 3,1.5" fill={color} opacity="0.5" />
          <line
            x1="0"
            y1="1.5"
            x2="3"
            y2="1.5"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.3"
          />
          <line
            x1="9"
            y1="1.5"
            x2="12"
            y2="1.5"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <rect
        width="400"
        height="3"
        fill={`url(#mini-${color.replace("#", "")})`}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GeometricZellijLanding() {
  return (
    <div className="min-h-screen bg-white text-[#1B1B1B] antialiased">
      {/* ---- Sticky Nav ---- */}
      <nav className="sticky top-0 z-50 border-b border-[#1B4B8A]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#1B4B8A] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#1B4B8A] focus-visible:outline-none"
          >
            <GeometricStar color={cobalt} />
            QuranMemorizer
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-[#1B1B1B]/60 transition-opacity duration-200 hover:bg-[#1B4B8A]/5 hover:text-[#1B4B8A] focus-visible:ring-2 focus-visible:ring-[#1B4B8A]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-lg bg-[#1B4B8A] text-white transition-opacity duration-200 hover:bg-[#1B4B8A]/80 focus-visible:ring-2 focus-visible:ring-[#1B4B8A]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ---- Hero with Zellij Band ---- */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16">
        {/* Massive zellij pattern band */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex h-80 items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <ZellijPattern
            className="h-full w-full min-w-[1200px]"
            opacity={0.12}
          />
        </div>

        <div className="relative mx-auto max-w-4xl pt-24 text-center sm:pt-32">
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-[#1B4B8A] sm:text-6xl lg:text-7xl">
            Memorize the Quran
            <br />
            <span className="text-[#C1553B]">with timeless craft</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#1B1B1B]/50">
            Where centuries of Islamic geometric artistry meet cutting-edge
            memorization science. AI voice recognition, FSRS-6 spaced
            repetition, and 13-rule Tajweed coaching &mdash; built on a
            foundation of pattern and precision.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-[#1B4B8A] px-8 text-base font-semibold text-white transition-opacity duration-200 hover:bg-[#1B4B8A]/80 focus-visible:ring-2 focus-visible:ring-[#1B4B8A]"
            >
              <Link href="/register">
                Start Memorizing Free
                <ChevronRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-lg border-[#1B4B8A]/20 px-8 text-base text-[#1B4B8A] transition-opacity duration-200 hover:bg-[#1B4B8A]/5 hover:text-[#1B4B8A] focus-visible:ring-2 focus-visible:ring-[#1B4B8A]"
            >
              <Link href="/quran">Explore the Mushaf</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Stats with geometric stars ---- */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, index) => {
            const colors = [cobalt, terracotta, teal, gold];
            const color = colors[index % colors.length];
            return (
              <div key={stat.label} className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <GeometricStar color={color} />
                  <span
                    className="tabular-nums text-3xl font-bold sm:text-4xl"
                    style={{ color }}
                  >
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm text-[#1B1B1B]/40">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- Features with mini pattern strips ---- */}
      <section id="features" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold text-[#1B4B8A] sm:text-4xl">
              Every pattern of memorization, perfected
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#1B1B1B]/50">
              Like the interlocking geometry of zellij tilework, each feature
              connects to create a complete and beautiful system.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="overflow-hidden rounded-lg border border-[#1B1B1B]/5 bg-white shadow-sm"
                >
                  {/* Mini pattern strip at top */}
                  <MiniPatternStrip color={feature.accent} />
                  <div className="p-6">
                    <div
                      className="mb-4 flex size-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${feature.accent}10` }}
                    >
                      <Icon
                        className="size-6"
                        style={{ color: feature.accent }}
                      />
                    </div>
                    <h3
                      className="mb-2 text-lg font-bold"
                      style={{ color: feature.accent }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed text-[#1B1B1B]/50"
                      dangerouslySetInnerHTML={{ __html: feature.description }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Divider with mini zellij ---- */}
      <div className="mx-auto max-w-4xl" aria-hidden="true">
        <ZellijPattern className="h-6 w-full" opacity={0.08} />
      </div>

      {/* ---- Traditional Methods ---- */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#1B4B8A]">
            Traditional methods, modern precision
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-[#1B1B1B]/50">
            Battle-tested Islamic memorization methodologies, each digitized and
            enhanced with AI-powered feedback and geometric progress tracking.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                name: "Mauritanian Method",
                desc: "Mastery gates &mdash; achieve 95%+ accuracy before advancing to the next verse.",
                color: cobalt,
              },
              {
                name: "3&times;3 Method",
                desc: "Read verse 3 times, recite from memory 3 times, then combine with previous verses.",
                color: terracotta,
              },
              {
                name: "Ottoman Method",
                desc: "Page-by-page memorization with bi-weekly review cycles for long-term retention.",
                color: teal,
              },
              {
                name: "Sabaq / Sabqi / Manzil",
                desc: "New lesson, recent review, and older review tracked separately for optimal recall.",
                color: gold,
              },
            ].map((method) => (
              <div
                key={method.name}
                className="overflow-hidden rounded-lg border border-[#1B1B1B]/5"
              >
                <MiniPatternStrip color={method.color} />
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <GeometricStar color={method.color} />
                    <h3
                      className="text-lg font-bold"
                      style={{ color: method.color }}
                      dangerouslySetInnerHTML={{ __html: method.name }}
                    />
                  </div>
                  <p
                    className="text-sm leading-relaxed text-[#1B1B1B]/50"
                    dangerouslySetInnerHTML={{ __html: method.desc }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Achievements ---- */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-[#1B1B1B]/5 bg-white p-10 shadow-sm sm:p-14">
            <div className="grid items-center gap-10 sm:grid-cols-2">
              <div>
                <h2 className="text-balance text-3xl font-bold text-[#1B4B8A]">
                  50+ achievements to collect
                </h2>
                <p className="mt-4 leading-relaxed text-[#1B1B1B]/50">
                  Like tiles in a grand mosaic, each achievement fits into a
                  larger picture of your memorization journey. Four rarity tiers
                  &mdash; Common, Rare, Epic, and Legendary &mdash; arranged in
                  geometric perfection.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { Icon: Award, color: cobalt },
                  { Icon: Star, color: terracotta },
                  { Icon: Trophy, color: teal },
                  { Icon: Sparkles, color: gold },
                  { Icon: BarChart3, color: cobalt },
                  { Icon: Brain, color: terracotta },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex size-16 items-center justify-center rounded-lg sm:size-20"
                    style={{ backgroundColor: `${badge.color}08` }}
                  >
                    <badge.Icon
                      className="size-7"
                      style={{ color: badge.color }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA with full-bleed zellij band ---- */}
      <section className="relative overflow-hidden px-6 py-24">
        {/* Background pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <ZellijPattern
            className="h-full w-full min-w-[1200px]"
            opacity={0.06}
          />
          <div className="absolute inset-0 bg-[#1B4B8A]/[0.03]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold text-[#1B4B8A] sm:text-4xl">
            Begin your mosaic of memorization
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[#1B1B1B]/50">
            Free forever. No ads. No distractions. Just you, the Quran, and the
            most architecturally precise memorization tools ever built.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-[#1B4B8A] px-8 text-base font-semibold text-white transition-opacity duration-200 hover:bg-[#1B4B8A]/80 focus-visible:ring-2 focus-visible:ring-[#1B4B8A]"
            >
              <Link href="/register">
                Create Free Account
                <ChevronRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-lg border-[#1B4B8A]/20 px-8 text-base text-[#1B4B8A] transition-opacity duration-200 hover:bg-[#1B4B8A]/5 hover:text-[#1B4B8A] focus-visible:ring-2 focus-visible:ring-[#1B4B8A]"
            >
              <Link href="/quran">Browse the Mushaf</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-[#1B4B8A]/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-[#1B4B8A] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#1B4B8A] focus-visible:outline-none"
          >
            <GeometricStar color={cobalt} />
            QuranMemorizer 2.0
          </Link>
          <nav className="flex flex-wrap gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#1B1B1B]/40 transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#1B4B8A] focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 text-center text-xs text-[#1B1B1B]/25">
          &copy; 2026 QuranMemorizer. Built with love for the Ummah.
        </div>
      </footer>
    </div>
  );
}

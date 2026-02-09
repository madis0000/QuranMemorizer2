import Link from "next/link";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Cloud,
  Droplets,
  Flower2,
  Headphones,
  Leaf,
  LogIn,
  Mic,
  Repeat,
  Snowflake,
  Sparkles,
  Sprout,
  Sun,
  TreePine,
  Trophy,
  UserPlus,
  WifiOff,
  Wind,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const seasons = [
  {
    id: "spring",
    name: "Spring",
    subtitle: "New Beginnings",
    icon: Sprout,
    accentColor: "#5BB8A6",
    accentLight: "rgba(91,184,166,0.10)",
    accentDark: "#4A9E8E",
    description:
      "Every Hifz journey begins with a single seed. In Spring, you plant your first surah trees. Fresh green shoots push through the soil as you memorize your first ayahs. The garden is full of promise.",
    detail:
      "FSRS-6 schedules your first reviews at gentle intervals, building roots of retention before pushing for speed. Each new ayah becomes a tiny bud on your surah\u2019s branches.",
    surahCard: {
      name: "Al-Fatihah",
      arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
      ayahs: 7,
      memorized: 3,
      branches: ["Praise", "Guidance", "Prayer"],
      stateLabel: "Sprouting",
    },
    weatherIcon: Droplets,
    weatherLabel: "Gentle rain nourishes new growth",
  },
  {
    id: "summer",
    name: "Summer",
    subtitle: "Peak Growth",
    icon: Sun,
    accentColor: "#4A9E8E",
    accentLight: "rgba(74,158,142,0.12)",
    accentDark: "#3A8E7E",
    description:
      "Your garden is alive with color. Flowers bloom on every branch as memorized ayahs take root. Butterflies \u2014 your achievements \u2014 visit the brightest trees. The canopy thickens with knowledge.",
    detail:
      "Streaks are strong, leagues are competitive, and your XP multiplier is at its peak. Tajweed coaching refines each recitation. This is where Huffaz are made.",
    surahCard: {
      name: "Yasin",
      arabic: "\u064A\u0633",
      ayahs: 83,
      memorized: 72,
      branches: ["Resurrection", "Signs", "Parables"],
      stateLabel: "Flourishing",
    },
    weatherIcon: Sun,
    weatherLabel: "Full sunlight fuels rapid growth",
  },
  {
    id: "autumn",
    name: "Autumn",
    subtitle: "Gentle Warning",
    icon: Wind,
    accentColor: "#B8884A",
    accentLight: "rgba(184,136,74,0.10)",
    accentDark: "#A07838",
    description:
      "The leaves turn amber. Without consistent review, your flowers begin to wilt. FSRS detects fading retention and sends you back to strengthen what\u2019s slipping. Autumn is not failure \u2014 it\u2019s a natural signal.",
    detail:
      "Overdue cards pile up, and your surah trees lose their vibrancy. But the roots remain strong underground. A few focused review sessions can bring everything back to full bloom.",
    surahCard: {
      name: "Al-Baqarah",
      arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
      ayahs: 286,
      memorized: 286,
      branches: ["Faith", "Law", "Stories", "Jihad", "Finance"],
      stateLabel: "Needs Review",
    },
    weatherIcon: Cloud,
    weatherLabel: "Clouds gather \u2014 time to tend your garden",
  },
  {
    id: "winter",
    name: "Winter",
    subtitle: "Dormancy & Roots",
    icon: Snowflake,
    accentColor: "#7A8B9A",
    accentLight: "rgba(122,139,154,0.10)",
    accentDark: "#6A7B8A",
    description:
      "The garden rests under a blanket of quiet. Trees stand bare, but beneath the surface, your FSRS stability scores tell the true story: the roots of retention run deep. Nothing is lost.",
    detail:
      "Winter is for those who paused but never forgot. When you return, the thaw is swift. Your memory palace remembers the page positions. Your muscle memory recalls the Tajweed. Spring always comes again.",
    surahCard: {
      name: "Ar-Rahman",
      arabic: "\u0627\u0644\u0631\u062D\u0645\u0646",
      ayahs: 78,
      memorized: 78,
      branches: ["Blessings", "Creation", "Paradise"],
      stateLabel: "Dormant",
    },
    weatherIcon: Snowflake,
    weatherLabel: "Rest period \u2014 roots hold strong",
  },
] as const;

const features = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions with exact physical layouts \u2014 Madinah, IndoPak, and beyond.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech API for speed, Whisper AI for Quran-specific precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Science-backed scheduling with 30% fewer reviews and higher retention than SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time color-coded coaching with animated pronunciation guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "From first-letter hints to full recall \u2014 eight memory strategies for every learner.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions, streaks, and daily challenges.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah following with word-level sync and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install on any device. Study without internet. Syncs when you reconnect.",
  },
];

const gardenMetaphor = [
  {
    icon: Sprout,
    label: "Seed",
    desc: "Begin memorizing a surah",
  },
  {
    icon: Leaf,
    label: "Branches",
    desc: "Explore thematic subjects",
  },
  {
    icon: Flower2,
    label: "Flowers",
    desc: "Each memorized ayah blooms",
  },
  {
    icon: TreePine,
    label: "Mastery",
    desc: "Complete surah = golden tree",
  },
];

const footerLinks = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
  { label: "Tajweed", href: "/tajweed" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function computeGrowth(memorized: number, total: number): number {
  return Math.round((memorized / total) * 100);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SeasonsGrowthTimelineLanding() {
  return (
    <div className="min-h-screen bg-[#E8ECF1] text-[#3A3F47] antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="sticky top-0 z-50 bg-[#E8ECF1]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="rounded-2xl px-5 py-2.5 text-lg font-bold tracking-tight text-[#4A9E8E] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
          >
            QuranMemorizer
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {["Spring", "Summer", "Autumn", "Winter"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm font-medium text-[#5A6068] transition-colors duration-200 hover:text-[#4A9E8E] focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="rounded-2xl bg-[#E8ECF1] px-4 py-2 text-[#3A3F47] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-2xl bg-[#4A9E8E] px-5 py-2 text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO: SPRING THEME ==================== */}
      <section className="relative px-6 pb-24 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Large neumorphic plate */}
          <div className="mx-auto mb-12 max-w-3xl rounded-2xl bg-[#E8ECF1] px-10 py-14 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            {/* Season badge */}
            <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-2xl bg-[#E8ECF1] px-5 py-2.5 shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
              <Sprout className="size-4 text-[#5BB8A6]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#5BB8A6]">
                It&rsquo;s Always Spring When You Begin
              </span>
            </div>

            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-[#2E3339] sm:text-5xl lg:text-6xl">
              Your Quran garden grows
              <span className="text-[#4A9E8E]"> through every season</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#5A6068]">
              Plant seeds of knowledge in Spring. Watch them bloom in Summer.
              Tend them through Autumn. Trust the roots in Winter. Every season
              of your Hifz journey is beautiful &mdash; and every season brings
              you closer to Paradise.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/register">
                Start in Spring
                <ChevronRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-[#E8ECF1] px-8 py-4 text-base font-semibold text-[#3A3F47] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
            >
              <Link href="/quran">Explore the Mushaf</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== GARDEN METAPHOR STRIP ==================== */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {gardenMetaphor.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                  <Icon className="size-7 text-[#4A9E8E]" />
                </div>
                <p className="text-sm font-bold text-[#2E3339]">{item.label}</p>
                <p className="mt-1 text-xs text-[#5A6068]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== FOUR SEASON SECTIONS ==================== */}
      {seasons.map((season, index) => {
        const Icon = season.icon;
        const WeatherIcon = season.weatherIcon;
        const pct = computeGrowth(
          season.surahCard.memorized,
          season.surahCard.ayahs
        );
        const isEven = index % 2 === 0;

        return (
          <section key={season.id} id={season.id} className="px-6 py-20">
            <div className="mx-auto max-w-6xl">
              {/* Season header */}
              <div className="mb-12 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                  <Icon
                    className="size-7"
                    style={{ color: season.accentColor }}
                  />
                </div>
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-widest"
                  style={{ color: season.accentColor }}
                >
                  Season {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
                  {season.name}{" "}
                  <span style={{ color: season.accentColor }}>
                    &mdash; {season.subtitle}
                  </span>
                </h2>
              </div>

              {/* Content: text + surah card */}
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 ${
                  isEven ? "" : "lg:[direction:rtl]"
                }`}
              >
                {/* Text side */}
                <div className={isEven ? "" : "lg:[direction:ltr]"}>
                  <div className="rounded-2xl bg-[#E8ECF1] p-8 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff] sm:p-10">
                    <p className="text-base leading-relaxed text-[#3A3F47]">
                      {season.description}
                    </p>
                    <div
                      className="my-6 h-px bg-[#c8ccd1]"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-relaxed text-[#5A6068]">
                      {season.detail}
                    </p>
                    {/* Weather indicator */}
                    <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#E8ECF1] px-4 py-3 shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                      <WeatherIcon
                        className="size-5 shrink-0"
                        style={{ color: season.accentColor }}
                      />
                      <span className="text-xs font-medium text-[#5A6068]">
                        {season.weatherLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Surah card side */}
                <div className={isEven ? "" : "lg:[direction:ltr]"}>
                  <div className="mx-auto max-w-sm rounded-2xl bg-[#E8ECF1] p-8 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                    {/* Tree visual */}
                    <div className="mx-auto mb-6 flex flex-col items-center">
                      <div className="relative flex h-36 w-20 items-end justify-center overflow-hidden rounded-2xl bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                        {/* Growth fill */}
                        <div
                          className="w-full rounded-t-xl"
                          style={{
                            height: `${pct}%`,
                            background: `linear-gradient(to top, ${season.accentColor}30, ${season.accentColor}10)`,
                            borderTop: `2px solid ${season.accentColor}60`,
                          }}
                        />
                        {/* Tree icon at top */}
                        <div className="absolute top-3 flex size-10 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[3px_3px_6px_#c8ccd1,-3px_-3px_6px_#ffffff]">
                          <TreePine
                            className="size-5"
                            style={{ color: season.accentColor }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Surah info */}
                    <div className="text-center">
                      <p
                        className="text-2xl font-semibold"
                        dir="rtl"
                        style={{ color: season.accentDark }}
                      >
                        {season.surahCard.arabic}
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#2E3339]">
                        {season.surahCard.name}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-[#5A6068]">
                          Progress
                        </span>
                        <span
                          className="tabular-nums font-bold"
                          style={{ color: season.accentColor }}
                        >
                          {season.surahCard.memorized}/{season.surahCard.ayahs}{" "}
                          ayahs
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: season.accentColor,
                          }}
                        />
                      </div>
                    </div>

                    {/* State label */}
                    <div className="mt-4 flex items-center justify-center">
                      <span
                        className="rounded-2xl px-4 py-1.5 text-xs font-bold shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]"
                        style={{ color: season.accentColor }}
                      >
                        {season.surahCard.stateLabel}
                      </span>
                    </div>

                    {/* Branches */}
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {season.surahCard.branches.map((branch) => (
                        <span
                          key={branch}
                          className="rounded-2xl bg-[#E8ECF1] px-3 py-1 text-[10px] font-medium text-[#5A6068] shadow-[3px_3px_6px_#c8ccd1,-3px_-3px_6px_#ffffff]"
                        >
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ==================== SEASON SUMMARY STRIP ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-[#E8ECF1] p-8 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff] sm:p-10">
            <h3 className="mb-8 text-center text-xl font-bold text-[#2E3339]">
              The Cycle of Growth
            </h3>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {seasons.map((season) => {
                const Icon = season.icon;
                return (
                  <div key={season.id} className="text-center">
                    <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
                      <Icon
                        className="size-6"
                        style={{ color: season.accentColor }}
                      />
                    </div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: season.accentColor }}
                    >
                      {season.name}
                    </p>
                    <p className="mt-1 text-xs text-[#5A6068]">
                      {season.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-[#5A6068]">
              Every Hafiz experiences all four seasons. The key is consistency
              &mdash; FSRS-6 ensures your roots grow deep, so even after Winter,
              Spring always returns stronger.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== QURAN QUOTE ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl bg-[#E8ECF1] px-8 py-10 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <blockquote className="text-xl font-semibold italic leading-relaxed text-[#2E3339] sm:text-2xl">
              &ldquo;And We have certainly made the Qur&rsquo;an easy for
              remembrance, so is there any who will remember?&rdquo;
            </blockquote>
            <cite className="mt-4 block text-sm font-medium not-italic text-[#4A9E8E]">
              Surah Al-Qamar &middot; 54:17
            </cite>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES GRID ==================== */}
      <section id="features" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Everything you need to grow
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#5A6068]">
              Purpose-built for Quran memorization &mdash; refined through every
              season of your Hifz journey.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-[#E8ECF1] p-7 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]"
                >
                  <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]">
                    <Icon className="size-6 text-[#4A9E8E]" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#2E3339]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5A6068]">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== STATS DIALS ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: "114", label: "Surah Trees" },
            { value: "6,236", label: "Ayah Flowers" },
            { value: "30", label: "Juz Biomes" },
            { value: "4", label: "Seasons" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="flex size-28 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[8px_8px_16px_#c8ccd1,-8px_-8px_16px_#ffffff] sm:size-32">
                <div className="flex size-20 flex-col items-center justify-center rounded-full bg-[#E8ECF1] shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] sm:size-24">
                  <span className="tabular-nums text-2xl font-bold text-[#4A9E8E] sm:text-3xl">
                    {stat.value}
                  </span>
                </div>
              </div>
              <span className="mt-3 text-sm font-medium text-[#5A6068]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl bg-[#E8ECF1] px-10 py-14 shadow-[12px_12px_24px_#c8ccd1,-12px_-12px_24px_#ffffff]">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#E8ECF1] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
              <Sprout className="size-7 text-[#5BB8A6]" />
            </div>
            <h2 className="text-balance text-3xl font-bold text-[#2E3339] sm:text-4xl">
              Start in Spring
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#5A6068]">
              The best time to plant a tree was twenty years ago. The second
              best time is now. Begin your Hifz garden today &mdash; free
              forever, no ads, no distractions.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#4A9E8E] px-8 py-4 text-base font-semibold text-white shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#4A9E8E] hover:shadow-[inset_4px_4px_8px_#3a8475,inset_-4px_-4px_8px_#5ab8a7] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/register">
                  Plant Your First Seed
                  <ChevronRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#E8ECF1] px-8 py-4 text-base font-semibold text-[#3A3F47] shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:bg-[#E8ECF1] hover:shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff] focus-visible:ring-2 focus-visible:ring-[#4A9E8E]"
              >
                <Link href="/quran">
                  <BookOpen className="size-5" />
                  Browse the Mushaf
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="px-6 pb-10 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-[#E8ECF1] px-8 py-8 shadow-[6px_6px_12px_#c8ccd1,-6px_-6px_12px_#ffffff]">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <Link
                href="/"
                className="text-lg font-bold text-[#4A9E8E] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
              >
                QuranMemorizer 2.0
              </Link>
              <nav className="flex flex-wrap gap-6">
                {footerLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-[#5A6068] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#4A9E8E] focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-6 text-center text-xs text-[#8A8F96]">
              &copy; 2026 QuranMemorizer. Built with love for the Ummah.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

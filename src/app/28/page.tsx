import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Droplets,
  Flower2,
  Headphones,
  Leaf,
  LogIn,
  Map,
  Mic,
  Mountain,
  Repeat,
  Sparkles,
  Sprout,
  TreeDeciduous,
  TreePine,
  Trees,
  Trophy,
  UserPlus,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

/**
 * Page 28 — "Glassmorphism Greenhouse"
 * Frosted glass panels floating over a lush deep-green gradient.
 * Like peering through a greenhouse at your growing Quran garden.
 * Mint-green accents, gold mastery highlights, clean sans-serif.
 */

const HERO_STATS = [
  { value: "114", label: "Trees" },
  { value: "6,236", label: "Flowers" },
  { value: "30", label: "Biomes" },
  { value: "\u2728", label: "Paradise" },
];

const SURAH_TREES = [
  {
    name: "Al-Fatihah",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    ayahs: 7,
    blooming: 7,
    icon: Flower2,
    season: "summer",
    seasonColor: "#FFD700",
    branches: ["Praise", "Guidance"],
    progress: 100,
  },
  {
    name: "Al-Baqarah",
    arabic: "\u0627\u0644\u0628\u0642\u0631\u0629",
    ayahs: 286,
    blooming: 100,
    icon: TreeDeciduous,
    season: "spring",
    seasonColor: "#7DFFBE",
    branches: ["Faith", "Law", "Stories", "Finance"],
    progress: 35,
  },
  {
    name: "Yasin",
    arabic: "\u064A\u0633",
    ayahs: 83,
    blooming: 50,
    icon: TreePine,
    season: "spring",
    seasonColor: "#7DFFBE",
    branches: ["Resurrection", "Signs", "Creation"],
    progress: 60,
  },
  {
    name: "Al-Kahf",
    arabic: "\u0627\u0644\u0643\u0647\u0641",
    ayahs: 110,
    blooming: 22,
    icon: Mountain,
    season: "autumn",
    seasonColor: "#FFAA44",
    branches: ["Trials", "Faith", "Knowledge"],
    progress: 20,
  },
  {
    name: "Al-Kawthar",
    arabic: "\u0627\u0644\u0643\u0648\u062B\u0631",
    ayahs: 3,
    blooming: 3,
    icon: Sprout,
    season: "summer",
    seasonColor: "#FFD700",
    branches: ["Abundance"],
    progress: 100,
  },
];

const GROWTH_STAGES = [
  {
    stage: "Seed",
    desc: "Plant your first ayah",
    icon: Sprout,
  },
  {
    stage: "Sapling",
    desc: "Build consistent roots",
    icon: Leaf,
  },
  {
    stage: "Bloom",
    desc: "Watch flowers open",
    icon: Flower2,
  },
  {
    stage: "Paradise",
    desc: "Complete your garden",
    icon: Trees,
  },
];

const METAPHOR_ITEMS = [
  {
    icon: Sprout,
    title: "Roots",
    subtitle: "FSRS-6 Stability",
    desc: "Deep roots mean strong, long-lasting memory. The FSRS algorithm measures your retention depth \u2014 the deeper, the less you need to review.",
  },
  {
    icon: Leaf,
    title: "Branches",
    subtitle: "Thematic Subjects",
    desc: "Each surah\u2019s branches represent its mawdu\u2019at \u2014 faith, law, stories, creation. Master a theme and watch the branch thicken.",
  },
  {
    icon: Droplets,
    title: "Rivers",
    subtitle: "Similar Verses",
    desc: "Mutash\u0101bih\u0101t \u2014 similar verses that confuse even Huffaz \u2014 flow as rivers connecting surah trees. Train your ability to tell them apart.",
  },
  {
    icon: Map,
    title: "Biomes",
    subtitle: "30 Juz Sections",
    desc: "Each juz unlocks a unique biome: meadow, oasis, forest, mountain. Complete all 30 to transform your garden into Jannah \u2014 Paradise.",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Page-Accurate Mushaf",
    desc: "7+ editions rendered to exact physical Mushaf proportions, page by page.",
  },
  {
    icon: Mic,
    title: "AI Voice Recognition",
    desc: "Dual-engine: Web Speech for speed, Whisper AI for Arabic Quran precision.",
  },
  {
    icon: Brain,
    title: "FSRS-6 Spaced Repetition",
    desc: "Next-gen scheduling. 30% fewer reviews for the same retention as SM-2.",
  },
  {
    icon: Sparkles,
    title: "13-Rule Tajweed Detection",
    desc: "Real-time coaching with color-coded rules and animated visual guides.",
  },
  {
    icon: Repeat,
    title: "8 Progressive Hide Modes",
    desc: "From first-letter hints to full recall \u2014 eight strategies for every learner.",
  },
  {
    icon: Trophy,
    title: "Quran-Themed Leagues",
    desc: "Five tiers from Talib to Imam. Weekly promotions and daily challenges.",
  },
  {
    icon: Headphones,
    title: "Multi-Qari Playback",
    desc: "Ayah-by-ayah recitation with word-level sync and offline downloads.",
  },
  {
    icon: WifiOff,
    title: "Offline-First PWA",
    desc: "Install on any device. Study without internet. Syncs when you reconnect.",
  },
];

const FOOTER_LINKS = [
  { label: "Read Quran", href: "/quran" },
  { label: "Memorize", href: "/memorize" },
  { label: "Listen", href: "/listen" },
  { label: "Progress", href: "/progress" },
  { label: "Garden", href: "/garden" },
];

/* ------------------------------------------------------------------ */
/*  Reusable style constants                                           */
/* ------------------------------------------------------------------ */

const GLASS = "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl";
const GLASS_STRONG =
  "bg-white/15 backdrop-blur-2xl border border-white/25 rounded-2xl";
const GLASS_SUBTLE =
  "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GlassmorphismGreenhouseLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A4D3C] via-[#0D6B4F] to-[#134E3A] text-white antialiased">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#7DFFBE] transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#7DFFBE] focus-visible:outline-none"
          >
            <Trees className="size-5" />
            QuranMemorizer
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {["Garden", "Journey", "Features"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm text-white/60 transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-[#7DFFBE] focus-visible:outline-none"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#7DFFBE]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Login
              </Link>
            </Button>
            <Button
              asChild
              className={`${GLASS} px-5 py-2 text-[#7DFFBE] shadow-lg shadow-black/10 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#7DFFBE]`}
            >
              <Link href="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main glass plate */}
          <div
            className={`${GLASS_STRONG} mx-auto max-w-3xl px-8 py-14 shadow-lg shadow-black/10 sm:px-14 sm:py-18`}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#7DFFBE]">
              The Surah Tree System
            </p>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Watch Your Garden
              <br />
              Grow Through <span className="text-[#7DFFBE]">Glass</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              114 surahs become 114 trees. Each memorized ayah blooms as a
              flower. AI voice recognition, FSRS-6 spaced repetition, and
              real-time Tajweed coaching nurture your garden to Paradise.
            </p>
          </div>

          {/* Stat pills */}
          <div className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-3 sm:gap-4">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className={`${GLASS} flex items-center gap-2.5 px-5 py-2.5 shadow-lg shadow-black/10`}
              >
                <span className="tabular-nums text-lg font-bold text-[#7DFFBE]">
                  {stat.value}
                </span>
                <span className="text-sm text-white/60">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#7DFFBE] px-8 py-4 text-base font-semibold text-[#0A4D3C] shadow-lg shadow-[#7DFFBE]/20 hover:bg-[#9EFFD3] focus-visible:ring-2 focus-visible:ring-[#7DFFBE]"
            >
              <Link href="/register">
                <Sprout className="size-5" />
                Plant Your First Seed
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className={`${GLASS} px-8 py-4 text-base font-semibold text-white hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#7DFFBE]`}
            >
              <Link href="/quran">
                <BookOpen className="size-5" />
                Explore the Mushaf
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== SURAH TREE CARDS ==================== */}
      <section id="garden" className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#7DFFBE]">
              Your Greenhouse
            </p>
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
              Every surah, a living tree
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/60">
              From a tiny 3-flower bonsai to a 286-flower grand oak &mdash; your
              trees reflect the real structure and scale of the Quran.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {SURAH_TREES.map((tree) => {
              const Icon = tree.icon;
              const isComplete = tree.progress === 100;
              return (
                <div
                  key={tree.name}
                  className={`${GLASS} p-5 shadow-lg shadow-black/10`}
                >
                  {/* Tree icon + season dot */}
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`${GLASS_SUBTLE} flex size-12 items-center justify-center`}
                    >
                      <Icon
                        className="size-6"
                        style={{
                          color: isComplete ? "#FFD700" : "#7DFFBE",
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: tree.seasonColor }}
                      />
                      <span className="text-[10px] capitalize text-white/40">
                        {tree.season}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <p className="text-xl font-semibold text-white" dir="rtl">
                    {tree.arabic}
                  </p>
                  <p className="mt-0.5 text-sm text-white/60">{tree.name}</p>

                  {/* Flower count */}
                  <p className="mt-3 text-sm text-white/60">
                    <span
                      className="tabular-nums font-bold"
                      style={{
                        color: isComplete ? "#FFD700" : "#7DFFBE",
                      }}
                    >
                      {tree.blooming}
                    </span>
                    <span className="text-white/40">
                      /{tree.ayahs} blooming
                    </span>
                  </p>

                  {/* Growth bar */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${tree.progress}%`,
                        backgroundColor: isComplete ? "#FFD700" : "#7DFFBE",
                      }}
                    />
                  </div>

                  {/* Branch tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tree.branches.map((branch) => (
                      <span
                        key={branch}
                        className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] text-white/50 backdrop-blur-sm"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== GROWTH JOURNEY ==================== */}
      <section id="journey" className="px-6 pb-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#7DFFBE]">
              The Journey
            </p>
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
              From seed to Paradise
            </h2>
          </div>

          {/* 4-step flow */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            {GROWTH_STAGES.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === GROWTH_STAGES.length - 1;
              return (
                <div key={step.stage} className="relative text-center">
                  {/* Glass circle */}
                  <div
                    className={`${GLASS_STRONG} mx-auto flex size-20 items-center justify-center rounded-full shadow-lg shadow-black/10`}
                  >
                    <Icon className="size-8 text-[#7DFFBE]" />
                  </div>

                  {/* Connector line (hidden on last + mobile) */}
                  {!isLast && (
                    <div className="absolute top-10 left-[calc(50%+40px)] hidden h-px w-[calc(100%-80px)] bg-white/20 sm:block" />
                  )}

                  <p className="mt-4 text-sm font-bold text-white">
                    {step.stage}
                  </p>
                  <p className="mt-1 text-sm text-white/50">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== GARDEN METAPHOR ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div
            className={`${GLASS_STRONG} p-8 shadow-lg shadow-black/10 sm:p-12`}
          >
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#7DFFBE]">
                The Living Metaphor
              </p>
              <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
                Every element tells a story
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {METAPHOR_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div
                      className={`${GLASS_SUBTLE} flex size-12 shrink-0 items-center justify-center rounded-xl`}
                    >
                      <Icon className="size-5 text-[#7DFFBE]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#7DFFBE]">
                        {item.subtitle}
                      </p>
                      <h3 className="mt-0.5 text-base font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seasonal indicators */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-white/40">
                Seasonal Health Indicators
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {[
                  {
                    label: "Spring \u2014 Active",
                    color: "#7DFFBE",
                  },
                  {
                    label: "Summer \u2014 Mastered",
                    color: "#FFD700",
                  },
                  {
                    label: "Autumn \u2014 Overdue",
                    color: "#FFAA44",
                  },
                  {
                    label: "Winter \u2014 Inactive",
                    color: "#88BBFF",
                  },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-sm text-white/50">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#7DFFBE]">
              Features
            </p>
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
              Everything your Hifz needs
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`${GLASS} p-6 shadow-lg shadow-black/10`}
                >
                  <div
                    className={`${GLASS_SUBTLE} mb-4 flex size-11 items-center justify-center rounded-xl`}
                  >
                    <Icon className="size-5 text-[#7DFFBE]" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== QURANIC QUOTE ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl">
          <div
            className={`${GLASS_STRONG} px-8 py-14 text-center shadow-lg shadow-black/10 sm:px-14`}
          >
            <blockquote className="text-xl leading-relaxed font-light italic text-white sm:text-2xl">
              &ldquo;And We have certainly made the Qur&rsquo;an easy for
              remembrance, so is there any who will remember?&rdquo;
            </blockquote>
            <cite className="mt-5 block text-sm font-medium text-[#7DFFBE] not-italic">
              Surah Al-Qamar &middot; 54:17
            </cite>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className={`${GLASS_STRONG} px-8 py-14 shadow-lg shadow-black/10 sm:px-14`}
          >
            <TreePine className="mx-auto mb-6 size-12 text-[#7DFFBE]" />
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
              Your paradise garden begins
              <br />
              with a <span className="text-[#7DFFBE]">single seed</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/60">
              Free forever. No ads. No distractions. 114 surahs waiting to
              become 114 trees in the most beautiful memorization garden ever
              imagined.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-[#7DFFBE] px-8 py-4 text-base font-semibold text-[#0A4D3C] shadow-lg shadow-[#7DFFBE]/20 hover:bg-[#9EFFD3] focus-visible:ring-2 focus-visible:ring-[#7DFFBE]"
              >
                <Link href="/register">
                  Plant Your First Seed
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className={`${GLASS} px-8 py-4 text-base font-semibold text-white hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#7DFFBE]`}
              >
                <Link href="/quran">
                  <BookOpen className="size-5" />
                  Explore the Mushaf
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/10 px-6 pb-10 pt-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-[#7DFFBE] transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#7DFFBE] focus-visible:outline-none"
          >
            <Trees className="size-4" />
            QuranMemorizer 2.0
          </Link>

          <nav className="flex flex-wrap justify-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-white/40 transition-colors duration-200 hover:text-white/70 focus-visible:ring-2 focus-visible:ring-[#7DFFBE] focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-white/30">
          &copy; 2026 QuranMemorizer. Built with love for the Ummah.
        </p>
      </footer>
    </div>
  );
}
